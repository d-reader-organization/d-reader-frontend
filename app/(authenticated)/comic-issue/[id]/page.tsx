'use client'

import React, { useCallback, useEffect } from 'react'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import { Theme } from '@mui/material/styles'
import PageBanner from 'public/assets/page-banner.png'
import VerifiedIcon from 'public/assets/vector-icons/verified-icon.svg'
import CloseIcon from 'public/assets/vector-icons/close.svg'
import CollectionStatusItem from 'components/ui/CollectionStatusItem'
import AvatarImage from 'components/AvatarImage'
import PriceTag from 'components/tags/PriceTag'
import InfoList from 'components/ui/InfoList'
import { useFetchCandyMachine } from 'api/candyMachine'
// import { useFetchCandyMachine, useFetchCandyMachineReceipts } from 'api/candyMachine'
import { useFetchComicIssue } from 'api/comicIssue'
import { roundNumber } from 'utils/numbers'
import FlexRow from '@/components/FlexRow'
import Button from '@/components/Button'
import Image from 'next/image'
// import { useCountdown } from 'hooks'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import Navigation from '@/components/layout/Navigation'
import { useFetchMintOneTransaction } from '@/api/transaction'
import Dialog from '@mui/material/Dialog'
import { useFetchMe, useFetchUserWallets, useRequestUserEmailVerification } from '@/api/user'
import { useToggle } from '@/hooks'
import { useRequestWalletPassword, useConnectUserWallet } from '@/api/auth'
import { Transaction, PublicKey, sendAndConfirmTransaction } from '@solana/web3.js'
import { WALLET_LABELS } from '@/constants/wallets'
import dynamic from 'next/dynamic'
import bs58 from 'bs58'
import clsx from 'clsx'
import { useToaster } from '@/providers/ToastProvider'

interface Params {
	id: string
}

const BaseWalletMultiButtonDynamic = dynamic(
	async () => (await import('@solana/wallet-adapter-react-ui')).BaseWalletMultiButton,
	{ ssr: false }
)

const ComicIssueDetails = ({ params }: { params: Params }) => {
	const [walletNotConnectedDialogOpen, toggleWalletNotConnectedDialog] = useToggle()
	const [emailNotVerifiedDialogOpen, toggleEmailNotVerifiedDialog] = useToggle()
	const { wallet, publicKey, signMessage, signTransaction, signAllTransactions } = useWallet()
	const { connection } = useConnection()
	const toaster = useToaster()

	const { mutateAsync: requestWalletPassword } = useRequestWalletPassword()
	const { mutateAsync: connectUserWallet } = useConnectUserWallet()

	const { data: comicIssue, error } = useFetchComicIssue(params.id)
	const { data: me } = useFetchMe()
	const { data: connectedWallets = [], isLoading, isFetched } = useFetchUserWallets(me?.id || 0)

	const candyMachineAddress = comicIssue?.activeCandyMachineAddress || ''
	const walletAddress = publicKey?.toBase58()
	const connectedWalletAddresses = connectedWallets.map((wallet) => wallet.address)
	const hasWalletConnected = !!walletAddress && connectedWalletAddresses.includes(walletAddress)
	const hasVerifiedEmail = !!me?.isEmailVerified

	console.log(connectedWalletAddresses, hasWalletConnected)

	const { data: candyMachine } = useFetchCandyMachine({ candyMachineAddress, walletAddress })
	// const { data: receipts } = useFetchCandyMachineReceipts({ candyMachineAddress, skip: 0, take: 20 })
	const { mutateAsync: requestUserEmailVerification } = useRequestUserEmailVerification()

	const { refetch } = useFetchMintOneTransaction(
		{
			candyMachineAddress,
			minterAddress: walletAddress || '',
			label: 'dFree', // TODO: currently active group,
		},
		false
	)

	// const { countdownString } = useCountdown({ expirationDate: candyMachine?.endsAt })
	const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))

	// TRANSPARENT BACKGROUND NAVIGATION
	// TODO: It might not have a CM nor AH (offchain)
	// console.log(candyMachine)
	// console.log(receipts)
	// TODO: auctionHouse

	// const toggleFavorite = () => {
	// 	console.log('Toggle favorite')
	// }

	// const toggleBookmark = () => {
	// 	console.log('Toggle bookmark')
	// }

	const authorizeWallet = useCallback(async () => {
		console.log(publicKey, isFetched, isLoading, hasWalletConnected)
		console.log('TRIED!')
		if (!publicKey || !isFetched || isLoading || hasWalletConnected) return
		console.log('INSIDE')

		const address = publicKey.toBase58()
		const otp = await requestWalletPassword(address)
		const message = new TextEncoder().encode(otp)

		let encoding = ''
		// If wallet supports message signing, go with that option
		if (signMessage && wallet?.adapter.name !== 'Ledger') {
			const signedMessage = await signMessage(message)
			encoding = bs58.encode(signedMessage)
		}
		// Otherwise sign a transaction with OTP stored in its instruction
		else if (signTransaction) {
			const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash()

			const transaction = new Transaction({ feePayer: publicKey, blockhash, lastValidBlockHeight }).add({
				keys: [],
				programId: PublicKey.default,
				data: Buffer.from(message),
			})

			const signedTransaction = await signTransaction(transaction)
			encoding = bs58.encode(signedTransaction.serialize())
		} else throw new Error('Wallet does not support message or transaction signing!')

		await connectUserWallet({ address, encoding })
	}, [
		publicKey,
		isFetched,
		isLoading,
		hasWalletConnected,
		requestWalletPassword,
		signMessage,
		wallet?.adapter.name,
		signTransaction,
		connectUserWallet,
		connection,
	])

	// Trigger this useEffect only if it's not a mobile device
	// otherwise, show a "verify wallet" button or use a custom "Connect and Sign" button
	useEffect(() => {
		authorizeWallet()
	}, [authorizeWallet])

	const handleBuyClick = async () => {
		if (!hasWalletConnected) toggleWalletNotConnectedDialog()
		else if (!hasVerifiedEmail) toggleEmailNotVerifiedDialog()
		else {
			const { data: mintTransactions = [] } = await refetch()
			if (!signAllTransactions) {
				toaster.add('Wallet does not support signing multiple transactions', 'error')
				return
			}
			const signedTransactions = await signAllTransactions(mintTransactions)
			let i = 0
			for (const transaction of signedTransactions) {
				try {
					console.log('inside')
					const signature = await connection.sendTransaction(transaction, {
						skipPreflight: true,
					})

					console.log(signature)
					const latestBlockhash = await connection.getLatestBlockhash()
					const response = await connection.confirmTransaction({ signature, ...latestBlockhash })
					console.log('response: ', response)
					toaster.add('confirming transaction...', 'info')
					toaster.add('Successfully minted the comic! NFT is now in your wallet', 'success')
				} catch (e) {
					if (signedTransactions.length === 2 && i === 0) {
						toaster.add('Wallet is not allowlisted to mint this comic', 'error')
					}
					toaster.add('Something went wrong', 'error')
					console.log('error: ', e)
				}
				i += 1
			}
		}
	}

	if (error) return <Box p={2}>{error.message}</Box>
	if (!comicIssue || !comicIssue.stats || !comicIssue.myStats) return null

	const heroImage = comicIssue.cover || PageBanner.src

	return (
		<>
			<Navigation />
			<main className='comic-issue-page'>
				<div
					className='comic-issue-banner-image'
					style={{ backgroundImage: `url('${heroImage}')`, filter: !isMobile ? 'blur(10px)' : '' }}
				>
					<div className={clsx('bottom-overlay', `bottom-overlay--${!isMobile ? 'standard' : 'simpler'}`)} />
				</div>

				<Container className='comic-issue-container' maxWidth='xl'>
					<Box className='comic-issue-header'>
						<Box className='comic-issue-page--left'>
							<FlexRow className='comic-issue-stats' display={isMobile ? 'none' : 'inherit	'}>
								<InfoList orientation='vertical'>
									<Button backgroundColor='transparent' noMinWidth>
										⭐&nbsp;<span>{roundNumber(comicIssue.stats.averageRating) || '-'}</span>
									</Button>
									<Button backgroundColor='transparent' noMinWidth>
										❤️&nbsp;<span>{comicIssue.stats.favouritesCount}</span>
									</Button>
								</InfoList>
							</FlexRow>
						</Box>

						{!isMobile && (
							<Box className='comic-issue-page--middle'>
								<Image src={comicIssue.cover} alt='' priority width={600} height={800} />
								<FlexRow>
									<Button backgroundColor='transparent' borderColor='grey-100' className='button--preview'>
										Preview
									</Button>
									{candyMachine && (
										<Button backgroundColor='yellow-500' onClick={handleBuyClick}>
											Buy&nbsp;
											<PriceTag
												component='span'
												maxDecimals={2}
												price={candyMachine.groups[0]?.mintPrice || 0}
												bold
												icon
											/>
										</Button>
									)}
								</FlexRow>
							</Box>
						)}

						<Box className='comic-issue-page--right'>
							<FlexRow>
								<Typography variant='h4' component='h1'>
									{comicIssue.title}
								</Typography>
							</FlexRow>
							{comicIssue.genres && (
								<FlexRow>
									<Box className='comic-issue-genre-list'>
										{comicIssue.genres.map((genre) => (
											<Box className='genre-item' key={genre.slug}>
												<img src={genre.icon} alt='' className='genre-icon' />
												<Typography variant='body1'>{genre.name}</Typography>
											</Box>
										))}
									</Box>
								</FlexRow>
							)}
							{comicIssue.flavorText && (
								<Typography variant='body2' className='comic-issue-flavor-text'>
									{comicIssue.flavorText}
								</Typography>
							)}
							<Typography className='comic-issue-description'>{comicIssue.description}</Typography>
							{comicIssue.creator && (
								<Box className='comic-issue-creator-wrapper'>
									<AvatarImage src={comicIssue.creator.avatar} size={48} />
									<Box ml={2}>
										<Typography className='text--author'>author</Typography>
										<Typography fontWeight='bold'>
											{comicIssue.creator.name} {comicIssue.creator.isVerified ? <VerifiedIcon /> : ''}
										</Typography>
									</Box>
								</Box>
							)}
							{candyMachine && (
								<>
									<FlexRow justifyContent='space-between' alignItems='center' mt={2}>
										<p className='text--important'>● Minting in progress</p> Total: {candyMachine.itemsMinted}/
										{candyMachine.supply}
									</FlexRow>

									{candyMachine.groups.map((group) => {
										return (
											<React.Fragment key={group.label}>
												<FlexRow>{group.displayLabel}:</FlexRow>
												<InfoList orientation='horizontal' mb={1}>
													{/* TODO: websocket events here for updates */}
													<CollectionStatusItem orientation='vertical' label='supply' value={group.supply} />
													<CollectionStatusItem orientation='vertical' label='minted' value={group.itemsMinted} />
													<CollectionStatusItem
														orientation='vertical'
														label='price'
														value={
															<PriceTag
																component='span'
																maxDecimals={2}
																price={group.mintPrice || 0}
																bold
																symbol
																reverse
															/>
														}
													/>
												</InfoList>
											</React.Fragment>
										)
									})}
								</>
							)}
							{isMobile && (
								<Box my={2}>
									<FlexRow>
										<Button backgroundColor='transparent' borderColor='grey-100' className='button--preview'>
											Preview
										</Button>
										{candyMachine && (
											<Button backgroundColor='yellow-500' onClick={handleBuyClick}>
												Buy&nbsp;
												<PriceTag
													component='span'
													maxDecimals={2}
													price={candyMachine.groups[0].mintPrice || 0}
													bold
													icon
												/>
											</Button>
										)}
									</FlexRow>
								</Box>
							)}
						</Box>
					</Box>

					{comicIssue.isSecondarySaleActive && (
						<Typography className='section-title' variant='h5' component='h2'>
							Secondary market
						</Typography>
					)}
					{/* <ComicIssueDiscoverList params={{ comicSlug: comic.slug, sortOrder: SortOrder.ASC }} enabled hideItemsCount /> */}
					{/* {comicIssues.length === 0 && <Box>No listed items found</Box>} */}
				</Container>

				<Dialog
					style={{ backdropFilter: 'blur(4px)' }}
					PaperProps={{ className: 'text-dialog' }}
					onClose={toggleEmailNotVerifiedDialog}
					open={emailNotVerifiedDialogOpen}
				>
					<div className='close-icon-wrapper'>
						<CloseIcon className='close-icon' onClick={toggleEmailNotVerifiedDialog} />
					</div>
					<strong>📖 Email not verified</strong>
					Please verify your email to be eligible for a free mint
					<small>Didn&apos;t get the email? check your spam folder{/* before resending */}</small>
					<Button
						onClick={async () => {
							await requestUserEmailVerification()
							toggleEmailNotVerifiedDialog()
						}}
						bold={false}
						backgroundColor='transparent'
						className='action-button action-button--resend-email-from-dialog'
					>
						Resend email confirmation link
					</Button>
				</Dialog>

				<Dialog
					style={{ backdropFilter: 'blur(4px)' }}
					PaperProps={{ className: 'text-dialog' }}
					onClose={toggleWalletNotConnectedDialog}
					open={walletNotConnectedDialogOpen}
				>
					<div className='close-icon-wrapper'>
						<CloseIcon className='close-icon' onClick={toggleWalletNotConnectedDialog} />
					</div>
					<strong>⚠️ Wallet not connected</strong>
					Please connect your wallet first to be eligible for a free mint
					<hr />
					<BaseWalletMultiButtonDynamic labels={WALLET_LABELS} />
				</Dialog>
			</main>
		</>
	)
}

export default ComicIssueDetails
