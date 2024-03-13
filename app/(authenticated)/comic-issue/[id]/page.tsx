'use client'

import React, { useCallback, useEffect, useState } from 'react'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import { Theme } from '@mui/material/styles'
import PageBanner from 'public/assets/page-banner.png'
import VerifiedIcon from 'public/assets/vector-icons/verified-icon.svg'
import CloseIcon from 'public/assets/vector-icons/close.svg'
import AvatarImage from 'components/AvatarImage'
import InfoList from 'components/ui/InfoList'
import { CANDY_MACHINE_QUERY_KEYS, useFetchCandyMachine } from 'api/candyMachine'
// import { useFetchCandyMachine, useFetchCandyMachineReceipts } from 'api/candyMachine'
import { comicIssueKeys, useFavouritiseComicIssue, useFetchComicIssue, useRateComicIssue } from 'api/comicIssue'
import { roundNumber } from 'utils/numbers'
import FlexRow from '@/components/ui/FlexRow'
import Button from '@/components/Button'
import Image from 'next/image'
// import { useCountdown } from 'hooks'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import Navigation from '@/components/layout/Navigation'
import { useFetchMintOneTransaction } from '@/api/transaction'
import Dialog from '@mui/material/Dialog'
import { useFetchMe, useFetchUserWallets, useRequestUserEmailVerification } from '@/api/user'
import { useToggle } from '@/hooks'
import { WALLET_LABELS } from '@/constants/wallets'
import { useToaster } from '@/providers/ToastProvider'
import ButtonLink from '@/components/ButtonLink'
import { RoutePath } from '@/enums/routePath'
import HeartIcon from '@/components/icons/HeartIcon'
import StarIcon from '@/components/icons/StarIcon'
import StarRatingDialog from '@/components/dialogs/StarRatingDialog'
import { CandyMachine } from '@/models/candyMachine'
import useAuthorizeWallet from '@/hooks/useAuthorizeWallet'
import { shortenString, sleep } from '@/utils/helpers'
import dynamic from 'next/dynamic'
import { isNil } from 'lodash'
import clsx from 'clsx'
import { nftKeys } from '@/api/nft'
import { useQueryClient } from 'react-query'
import CandyMachineGroup from '@/components/CandyMachineGroup'
import { io } from 'socket.io-client'
import { CandyMachineReceipt } from '@/models/candyMachine/candyMachineReceipt'
import NftMintedDialog from '@/components/dialogs/NftMintedDialog'

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
	const [starRatingDialog, , closeStarRatingDialog, openStarRatingDialog] = useToggle()
	const [showMintedNftDialog, openMintedNftDialog, closeMintedNftDialog] = useToggle()
	const [nftAddress, setNftAddress] = useState<string>()

	const { publicKey, signAllTransactions } = useWallet()
	const { connection } = useConnection()
	const queryClient = useQueryClient()
	const toaster = useToaster()

	const { mutateAsync: toggleFavoriteComicIssue, isLoading: loadingToggleFavoriteComicIssue } =
		useFavouritiseComicIssue(params.id)
	const { mutateAsync: rateComicIssue } = useRateComicIssue(params.id)

	const { data: me } = useFetchMe()
	const { data: comicIssue, error } = useFetchComicIssue(params.id)
	const { data: connectedWallets = [] } = useFetchUserWallets(me?.id || 0)

	const candyMachineAddress = comicIssue?.activeCandyMachineAddress || ''
	const walletAddress = publicKey?.toBase58()
	const connectedWalletAddresses = connectedWallets.map((wallet) => wallet.address)
	const hasWalletConnected = !!walletAddress && connectedWalletAddresses.includes(walletAddress)
	const hasVerifiedEmail = !!me?.isEmailVerified
	const myId = me?.id || 0

	useEffect(() => {
		if (!walletAddress) return
		const socket = io(process.env.NEXT_PUBLIC_API_ENDPOINT || '')
		socket.on(`wallet/${walletAddress}/item-minted`, async (data: CandyMachineReceipt): Promise<void> => {
			setNftAddress(data.nft.address)
			queryClient.invalidateQueries([CANDY_MACHINE_QUERY_KEYS.CANDY_MACHINE])
			queryClient.invalidateQueries(comicIssueKeys.get(params.id))
			queryClient.invalidateQueries(nftKeys.getMany({ comicIssueId: params.id }))
			queryClient.invalidateQueries(nftKeys.getMany({ ownerAddress: walletAddress }))
		})
		return () => {
			socket.disconnect()
		}
	}, [params.id, queryClient, walletAddress])

	const { data: candyMachine, refetch: fetchCandyMachine } = useFetchCandyMachine({
		candyMachineAddress,
		walletAddress,
	})

	// const { data: receipts } = useFetchCandyMachineReceipts({ candyMachineAddress, skip: 0, take: 20 })
	const { mutateAsync: requestUserEmailVerification } = useRequestUserEmailVerification()

	useAuthorizeWallet()

	const getActiveGroup = (candyMachineData: CandyMachine | undefined) => {
		return candyMachineData?.groups.find((group) => {
			const startDate = new Date(group.startDate)
			const endDate = new Date(group.endDate)
			const currentDate = new Date(new Date().toUTCString())

			return startDate <= currentDate && currentDate <= endDate
		})
	}

	const { refetch: fetchMintOneTransaction, isLoading: isMintTransactionLoading } = useFetchMintOneTransaction(
		{
			candyMachineAddress,
			minterAddress: walletAddress || '',
			label: getActiveGroup(candyMachine)?.label || '',
		},
		false
	)

	const hasMintingStarted = () => {
		if (candyMachine?.groups.at(0)?.startDate)
			return !(new Date(candyMachine?.groups.at(0)?.startDate || '') > new Date())
		return false
	}

	// const { countdownString } = useCountdown({ expirationDate: candyMachine?.endsAt })
	const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))

	const handleBuyClick = useCallback(async () => {
		if (!hasWalletConnected) {
			return toggleWalletNotConnectedDialog()
		}

		if (!hasVerifiedEmail) {
			return toggleEmailNotVerifiedDialog()
		}

		const activeGroup = getActiveGroup(candyMachine)

		if (!activeGroup?.wallet.isEligible) {
			const { data: updatedCandyMachine } = await fetchCandyMachine()
			const updatedActiveGroup = getActiveGroup(updatedCandyMachine)

			if (
				updatedActiveGroup?.wallet.itemsMinted &&
				updatedActiveGroup?.mintLimit <= updatedActiveGroup?.wallet.itemsMinted
			) {
				toaster.add(`wallet ${shortenString(walletAddress)} has reached its minting limit.`, 'error')
				return
			}
			// else if (!updatedActiveGroup?.wallet.isEligible) {
			// 	toaster.add(`Wallet ${shortenString(walletAddress)} is not eligible to mint`, 'error')
			// 	return
			// }
		} else {
			const { data: mintTransactions = [], error } = await fetchMintOneTransaction()
			if (error) return

			if (!signAllTransactions) {
				toaster.add('Wallet does not support signing multiple transactions', 'error')
				return
			}

			const signedTransactions = await signAllTransactions(mintTransactions)

			toaster.confirmingTransactions()
			let i = 0
			for (const transaction of signedTransactions) {
				try {
					const signature = await connection.sendTransaction(transaction)

					const latestBlockhash = await connection.getLatestBlockhash()
					const response = await connection.confirmTransaction({ signature, ...latestBlockhash })
					if (!!response.value.err) {
						console.log('Response error log: ', response.value.err)
						throw new Error()
					}
					openMintedNftDialog()
					toaster.add('Successfully minted the comic! NFT is now in your wallet', 'success')
				} catch (e) {
					console.log('error: ', e)
					if (signedTransactions.length === 2 && i === 0) {
						toaster.add('Wallet is not allowlisted to mint this comic', 'error')
					} else {
						toaster.add('Something went wrong', 'error')
					}
					return
				}
				i += 1
			}

			await sleep(1000)
			queryClient.invalidateQueries([CANDY_MACHINE_QUERY_KEYS.CANDY_MACHINE])
			queryClient.invalidateQueries(comicIssueKeys.get(params.id))
			queryClient.invalidateQueries(comicIssueKeys.getByOwner(myId))
			queryClient.invalidateQueries(nftKeys.getMany({ comicIssueId: params.id }))
			queryClient.invalidateQueries(nftKeys.getMany({ ownerAddress: walletAddress }))
			queryClient.invalidateQueries(nftKeys.getMany({ userId: myId }))
		}
	}, [
		candyMachine,
		connection,
		fetchCandyMachine,
		openMintedNftDialog,
		fetchMintOneTransaction,
		hasVerifiedEmail,
		hasWalletConnected,
		myId,
		params.id,
		queryClient,
		signAllTransactions,
		toaster,
		toggleEmailNotVerifiedDialog,
		toggleWalletNotConnectedDialog,
		walletAddress,
	])

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
						{!isMobile && (
							<Box className='comic-issue-page--left'>
								<FlexRow className='comic-issue-stats'>
									<InfoList orientation='vertical'>
										<Button naked onClick={openStarRatingDialog}>
											<StarIcon size='lg' solid={!isNil(comicIssue.myStats?.rating)} />
											&nbsp;
											<span>{roundNumber(comicIssue.stats.averageRating) || '-'}</span>
										</Button>
										<Button
											naked
											disabled={loadingToggleFavoriteComicIssue}
											onClick={async () => {
												await toggleFavoriteComicIssue()
											}}
										>
											<HeartIcon size='lg' solid={comicIssue.myStats?.isFavourite} />
											&nbsp;<span>{comicIssue.stats.favouritesCount}</span>
										</Button>
									</InfoList>
								</FlexRow>
							</Box>
						)}

						{!isMobile && (
							<Box className='comic-issue-page--middle'>
								<Image src={comicIssue.cover} alt='' priority width={600} height={800} />
								<ButtonLink
									href={RoutePath.ReadComicIssue(comicIssue.id)}
									backgroundColor='transparent'
									borderColor='grey-100'
									className='button--preview'
								>
									Read
								</ButtonLink>
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
									<div className='mint-header'>
										{hasMintingStarted() ? <p className='text--success'>● Minting in progress</p> : null}
										<Box>
											<h3 style={{ margin: '8px 0 0 0' }}>
												Total: {candyMachine.itemsMinted}/{candyMachine.supply}
											</h3>
											{/* <p style={{ margin: '0 0 4px 0' }}>
											<em>*200 of which goes into the &apos;Comic Vault&apos;</em>
										</p> */}
										</Box>
									</div>
									<div className='mint-details'>
										{candyMachine.groups.map((group) => {
											return (
												<CandyMachineGroup
													key={group.label}
													group={group}
													isMintTransactionLoading={isMintTransactionLoading}
													handleMint={handleBuyClick}
													totalMinted={candyMachine.itemsMinted}
												/>
											)
										})}
									</div>
								</>
							)}

							{isMobile && (
								<Box className='comic-issue-page--left'>
									<FlexRow className='comic-issue-stats' display={isMobile ? 'none' : 'inherit	'}>
										<InfoList orientation='horizontal'>
											<Button naked onClick={openStarRatingDialog}>
												<StarIcon size='lg' solid={!isNil(comicIssue.myStats?.rating)} />
												&nbsp;<span>{roundNumber(comicIssue.stats.averageRating) || '-'}</span>
											</Button>
											<Button
												naked
												disabled={loadingToggleFavoriteComicIssue}
												onClick={async () => {
													await toggleFavoriteComicIssue()
												}}
											>
												<HeartIcon size='lg' solid={comicIssue.myStats?.isFavourite} />
												&nbsp;<span>{comicIssue.stats.favouritesCount}</span>
											</Button>
										</InfoList>
									</FlexRow>
								</Box>
							)}

							{isMobile && (
								<Box my={2}>
									<ButtonLink
										href={RoutePath.ReadComicIssue(comicIssue.id)}
										backgroundColor='transparent'
										borderColor='grey-100'
										className='button--preview'
									>
										Read
									</ButtonLink>
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
					PaperProps={{ className: 'text-dialog ' }}
					onClose={toggleEmailNotVerifiedDialog}
					open={emailNotVerifiedDialogOpen}
					maxWidth='xs'
				>
					<div className='close-icon-wrapper'>
						<CloseIcon className='close-icon' onClick={toggleEmailNotVerifiedDialog} />
					</div>
					<strong>📖 Email not verified</strong>
					Verify your email to be eligible for a free mint
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
					PaperProps={{ className: 'text-dialog connect-wallet-dialog' }}
					onClose={toggleWalletNotConnectedDialog}
					open={walletNotConnectedDialogOpen && !walletAddress}
					maxWidth='xs'
				>
					<div className='close-icon-wrapper'>
						<CloseIcon className='close-icon' onClick={toggleWalletNotConnectedDialog} />
					</div>
					<strong>⚠️ Wallet not connected</strong>
					You need to connect your wallet first.
					<hr />
					<BaseWalletMultiButtonDynamic labels={WALLET_LABELS} />
				</Dialog>
				<StarRatingDialog
					title='Rate the episode'
					open={starRatingDialog}
					onClose={closeStarRatingDialog}
					onSubmit={async (rating: number) => {
						await rateComicIssue({ rating })
						closeStarRatingDialog()
					}}
				/>
				<NftMintedDialog
					nftAddress={nftAddress}
					id={params.id.toString()}
					open={showMintedNftDialog}
					onClose={closeMintedNftDialog}
				/>
			</main>
		</>
	)
}

export default ComicIssueDetails
