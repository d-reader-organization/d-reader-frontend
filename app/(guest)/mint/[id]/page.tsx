'use client'

import React, { useCallback, useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import PageBanner from 'public/assets/page-banner.png'
import VerifiedIcon from 'public/assets/vector-icons/verified-icon.svg'
import AvatarImage from 'components/AvatarImage'
import { CANDY_MACHINE_QUERY_KEYS, useFetchCandyMachine } from 'api/candyMachine'
import { comicIssueKeys, useFetchPublicComicIssue } from 'api/comicIssue'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { useFetchMintOneTransaction } from '@/api/transaction'
import { useToaster } from '@/providers/ToastProvider'
import useAuthorizeWallet from '@/hooks/useAuthorizeWallet'
import clsx from 'clsx'
import CircularProgress from '@mui/material/CircularProgress'
import SkeletonImage from '@/components/SkeletonImage'
import { CandyMachineReceipt } from '@/models/candyMachine/candyMachineReceipt'
import NftMintedDialog from '@/components/dialogs/NftMintedDialog'
import { useToggle } from '@/hooks'
import ConfirmingTransactionDialog from '@/components/dialogs/ConfirmingTransactionDialog'
import io from 'socket.io-client'
import { useQueryClient } from 'react-query'
import { nftKeys } from '@/api/nft'
import Grid from '@mui/material/Grid'
import GuestNavigation from '@/components/layout/GuestNavigation'
import CandyMachineDetail from '../../../../components/CandyMachineDetail'
import { Theme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import RegistDesktopBanner from 'public/assets/register-desktop-banner.png'
import Link from 'next/link'
import Image from 'next/image'
import FlexRow from '@/components/ui/FlexRow'
import FaqLink from '@/components/ui/FaqLink'
import ButtonLink from '@/components/ButtonLink'
import { getActiveGroup, validateMintEligibilty } from '@/utils/mint'

interface Params {
	id: string | number
}

const MintPage = ({ params }: { params: Params }) => {
	const { publicKey, signAllTransactions } = useWallet()
	const [mintDetailsSection, openMintDetailsSection, closeMintDetailsSection] = useToggle(false)
	const [transactionConfirmationDialog, , closeTransactionConfirmationDialog, openTransactionConfirmationDialog] =
		useToggle()
	const [isMintTransactionLoading, openMintTransactionLoading, closeMintTransactionLoading] = useToggle(false)
	const [showMintedNftDialog, openMintedNftDialog, closeMintedNftDialog] = useToggle()
	const [nftAddress, setNftAddress] = useState<string>()
	const { connection } = useConnection()
	const queryClient = useQueryClient()
	const toaster = useToaster()
	const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))
	// TODO: how do we display the Tensor link properly if user provides the id as a number?
	// No way for us to know what's the collection.slug

	const paramsId = params.id
	const { data: comicIssue, error } = useFetchPublicComicIssue(paramsId)
	const comicIssueId = comicIssue?.id || 0
	const candyMachineAddress = comicIssue?.activeCandyMachineAddress || ''
	const walletAddress = publicKey?.toBase58()

	useEffect(() => {
		if (!walletAddress) return
		const socket = io(process.env.NEXT_PUBLIC_API_ENDPOINT || '')
		socket.on(`wallet/${walletAddress}/item-minted`, async (data: CandyMachineReceipt): Promise<void> => {
			setNftAddress(data.nft.address)
			queryClient.invalidateQueries([CANDY_MACHINE_QUERY_KEYS.CANDY_MACHINE])
			queryClient.invalidateQueries(comicIssueKeys.get(comicIssueId))
			queryClient.invalidateQueries(nftKeys.getMany({ comicIssueId }))
			queryClient.invalidateQueries(nftKeys.getMany({ ownerAddress: walletAddress }))
		})
		return () => {
			socket.disconnect()
		}
	}, [comicIssueId, queryClient, walletAddress])

	const {
		data: candyMachine,
		refetch: fetchCandyMachine,
		isLoading: isCandyMachineDetailsLoading,
	} = useFetchCandyMachine({
		candyMachineAddress,
		walletAddress,
	})
	useAuthorizeWallet()

	const { refetch: fetchMintOneTransaction } = useFetchMintOneTransaction(
		{
			candyMachineAddress,
			minterAddress: walletAddress || '',
			label: getActiveGroup(candyMachine)?.label || '',
		},
		!!walletAddress && validateMintEligibilty(getActiveGroup(candyMachine)).isEligible
	)

	const handleMint = useCallback(async () => {
		openMintTransactionLoading()
		try {
			const { data: updatedCandyMachine } = await fetchCandyMachine()
			const updatedActiveGroup = getActiveGroup(updatedCandyMachine)
			const isMintValid = validateMintEligibilty(updatedActiveGroup)

			if (isMintValid) {
				const { data: mintTransactions = [] } = await fetchMintOneTransaction()
				if (!signAllTransactions) {
					return toaster.add('Wallet does not support signing multiple transactions', 'error')
				}
				const signedTransactions = await signAllTransactions(mintTransactions)
				closeMintTransactionLoading()
				openTransactionConfirmationDialog()

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
						toaster.add('Successfully minted the comic! Find the NFT in your wallet', 'success')
					} catch (e) {
						console.log('error: ', e)
						if (signedTransactions.length === 2 && i === 0) {
							toaster.add('Wallet is not allowlisted to mint this comic', 'error')
						} else {
							toaster.add('Something went wrong', 'error')
						}
					}
					i += 1
				}
			}
		} catch (e) {
			console.error(e)
		} finally {
			closeMintTransactionLoading()
			closeTransactionConfirmationDialog()
		}
	}, [
		closeMintTransactionLoading,
		closeTransactionConfirmationDialog,
		connection,
		fetchCandyMachine,
		fetchMintOneTransaction,
		openMintTransactionLoading,
		openMintedNftDialog,
		openTransactionConfirmationDialog,
		publicKey,
		signAllTransactions,
		toaster,
	])

	if (error) return <Box p={2}>{error.message}</Box>
	if (!comicIssue) return null

	const heroImage = comicIssue.cover || PageBanner.src
	return (
		<>
			<GuestNavigation />

			<main className='mint-page'>
				<div
					className='comic-issue-banner-image'
					style={{ backgroundImage: `url('${heroImage}')`, filter: 'blur(10px)' }}
				>
					<div className={clsx('bottom-overlay', `bottom-overlay--standard`)} />
				</div>
				<Grid container spacing={isMobile ? 0 : 2} maxWidth='lg' className='details-wrapper'>
					<Grid item className='details details--left' xs={12} md={6}>
						<SkeletonImage
							src={heroImage}
							width={345}
							height={500}
							loading='eager'
							alt='comic-cover'
							className='comic-issue-cover'
						/>
					</Grid>
					<Grid item className='details details--right' xs={12} md={6}>
						<p className='comic-issue-title'>{comicIssue.title}</p>
						<div className='detail-toggle'>
							<p
								onClick={closeMintDetailsSection}
								style={!mintDetailsSection ? { borderBottom: '2px solid #fceb54' } : {}}
							>
								Mint
							</p>
							<p
								onClick={openMintDetailsSection}
								style={mintDetailsSection ? { borderBottom: '2px solid #fceb54' } : {}}
							>
								About
							</p>
						</div>
						{isCandyMachineDetailsLoading ? (
							<CircularProgress thickness={6} classes={{ svg: 'details-loader', root: 'details-loader--root' }} />
						) : !mintDetailsSection ? (
							<Box pt={2}>
								{candyMachine && candyMachine.groups.length > 0 && !comicIssue.isSecondarySaleActive ? (
									<div className='mint-details'>
										<CandyMachineDetail
											candyMachine={candyMachine}
											isMintTransactionLoading={isMintTransactionLoading}
											handleMint={handleMint}
										/>
									</div>
								) : (
									<ButtonLink backgroundColor='yellow-500' href='https://www.tensor.trade/creator/dreader'>
										Trade on Tensor
									</ButtonLink>
								)}
							</Box>
						) : (
							<Box pt={1}>
								{comicIssue.flavorText && (
									<Typography variant='body2' className='comic-issue-flavor-text'>
										{comicIssue.flavorText}
									</Typography>
								)}
								{comicIssue.genres && (
									<div>
										<Box className='comic-issue-genre-list'>
											{comicIssue.genres.map((genre) => (
												<Box className='genre-item' key={genre.slug}>
													<img src={genre.icon} alt='' className='genre-icon' />
													<Typography className='genre-name' variant='body1'>
														{genre.name}
													</Typography>
												</Box>
											))}
										</Box>
									</div>
								)}
								<p>📖 Pages: {comicIssue.stats?.totalPagesCount || 30}</p>

								<p className='comic-issue-description'>
									{comicIssue.description.length > 281
										? comicIssue.description.substring(0, 281) + '...'
										: comicIssue.description}
									{/* {words(comicIssue.description).length > 45
										? comicIssue.description.substring(
												0,
												comicIssue.description.indexOf(words(comicIssue.description)[45])
										  ) + '...'
										: comicIssue.description} */}
								</p>
								<p>
									🚨 Register to <FaqLink href='https://dreader.io/links'>dReader</FaqLink> and read the comic.
								</p>
								{comicIssue.creator && (
									<Box className='comic-issue-creator-wrapper'>
										<AvatarImage className='avatar' src={comicIssue.creator.avatar} size={60} />
										<Typography fontWeight='bold' marginLeft={2}>
											{comicIssue.creator.name}{' '}
											{comicIssue.creator.isVerified ? <VerifiedIcon className='verified-icon' /> : ''}
										</Typography>
									</Box>
								)}
							</Box>
						)}
					</Grid>
				</Grid>
				<FlexRow centered justifyContent='center' maxWidth='100%'>
					<Link href={'/login'} target='_blank'>
						<Image
							src={RegistDesktopBanner}
							width={480}
							height={171}
							alt='Register/Login to -10% off on mints'
							className='register-login-banner'
						/>
					</Link>
				</FlexRow>
			</main>
			<NftMintedDialog
				nftAddress={nftAddress}
				comicIssueId={paramsId.toString()}
				open={showMintedNftDialog}
				onClose={closeMintedNftDialog}
			/>
			<ConfirmingTransactionDialog open={transactionConfirmationDialog} onClose={closeTransactionConfirmationDialog} />
		</>
	)
}

export default MintPage
