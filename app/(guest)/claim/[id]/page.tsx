'use client'

import React, { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import { Theme } from '@mui/material/styles'
import PageBanner from 'public/assets/page-banner.png'
import VerifiedIcon from 'public/assets/vector-icons/verified-icon.svg'
import AvatarImage from 'components/AvatarImage'
import { useFetchCandyMachine } from 'api/candyMachine'
import { useFetchPublicComicIssue } from 'api/comicIssue'
import Button from '@/components/Button'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { useFetchMintOneTransaction } from '@/api/transaction'
import { WALLET_LABELS } from '@/constants/wallets'
import { useToaster } from '@/providers/ToastProvider'
import { CandyMachine } from '@/models/candyMachine'
import useAuthorizeWallet from '@/hooks/useAuthorizeWallet'
import dynamic from 'next/dynamic'
import clsx from 'clsx'
import { CircularProgress, LinearProgress } from '@mui/material'
import GuestNavigation from '@/components/layout/guestNavigation'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import SkeletonImage from '@/components/SkeletonImage'
import { shortenString } from '@/utils/helpers'
import Countdown from '@/components/ui/Countdown'
import io from 'socket.io-client'
import { CandyMachineReceipt } from '@/models/candyMachine/candyMachineReceipt'
import MintedNftDialog from '@/components/dialogs/MintedNftDialog'
import { useToggle } from '@/hooks'
import ConfirmTransactionDialog from '@/components/dialogs/ConfirmationTransactionDialog'

interface Params {
	id: string | number
}

const BaseWalletMultiButtonDynamic = dynamic(
	async () => (await import('@solana/wallet-adapter-react-ui')).BaseWalletMultiButton,
	{ ssr: false }
)

const ClaimPage = ({ params }: { params: Params }) => {
	const { publicKey, signAllTransactions } = useWallet()
	const [mintDetailsSection, openMintDetailsSection, closeMintDetailsSection] = useToggle(false)
	const [transactionConfirmationDialog, , closeTransactionConfirmationDialog, openTransactionConfirmationDialog] =
		useToggle()
	const [isMintTransactionLoading, openMintTransactionLoading, closeMintTransactionLoading] = useToggle(false)
	const [showMintedNftDialog, openMintedNftDialog, closeMintedNftDialog] = useToggle()
	const [nftAddress, setNftAddress] = useState<string>()
	const { connection } = useConnection()
	const toaster = useToaster()

	const { data: comicIssue, error } = useFetchPublicComicIssue(params.id)
	const candyMachineAddress = comicIssue?.activeCandyMachineAddress || ''
	const walletAddress = publicKey?.toBase58()
	const hasWalletConnected = !!walletAddress

	useEffect(() => {
		// process.env.NEXT_PUBLIC_API_ENDPOINT
		if (!walletAddress) return
		const socket = io('https://api-dev-devnet.dreader.io' || '')
		socket.on(`wallet/${walletAddress}/item-minted`, async (data: CandyMachineReceipt): Promise<void> => {
			setNftAddress(data.nft.address)
		})
		return () => {
			socket.disconnect()
		}
	}, [walletAddress])

	const {
		data: candyMachine,
		refetch: fetchCandyMachine,
		isLoading: isCandyMachineDetailsLoading,
	} = useFetchCandyMachine({
		candyMachineAddress,
		walletAddress,
	})
	useAuthorizeWallet()

	const getActiveGroup = (candyMachineData: CandyMachine | undefined) => {
		return candyMachineData?.groups.find((group) => {
			const startDate = new Date(group.startDate)
			const endDate = new Date(group.endDate)
			const currentDate = new Date(new Date().toUTCString())

			return startDate <= currentDate && currentDate <= endDate
		})
	}

	const { refetch: fetchMintOneTransaction } = useFetchMintOneTransaction(
		{
			candyMachineAddress,
			minterAddress: walletAddress || '',
			label: getActiveGroup(candyMachine)?.label || '',
		},
		false
	)

	const normalise = (value: number, MAX: number) => (value * 100) / MAX
	const toSol = (lamports: number) => +(lamports / LAMPORTS_PER_SOL).toFixed(3)
	const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))
	const hasMintingStarted = () => {
		if (candyMachine?.groups.at(0)?.startDate)
			return !(new Date(candyMachine?.groups.at(0)?.startDate || '') > new Date())
		return false
	}

	const handleMint = async () => {
		openMintTransactionLoading()
		const activeGroup = getActiveGroup(candyMachine)
		try {
			if (!activeGroup?.wallet.isEligible) {
				const { data: updatedCandyMachine } = await fetchCandyMachine()
				const updatedActiveGroup = getActiveGroup(updatedCandyMachine)

				if (
					updatedActiveGroup?.wallet.itemsMinted &&
					updatedActiveGroup?.mintLimit <= updatedActiveGroup?.wallet.itemsMinted
				) {
					toaster.add(`Wallet ${shortenString(publicKey?.toString() || '')} has reached its minting limit.`, 'error')
				} else if (!updatedActiveGroup?.wallet.isEligible) {
					toaster.add(`Wallet ${shortenString(publicKey?.toString() || '')} is not eligible to mint`, 'error')
				}
			} else {
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
						toaster.add('Successfully minted the comic! NFT is now in your wallet', 'success')
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
	}
	if (error) return <Box p={2}>{error.message}</Box>
	if (!comicIssue) return null

	const heroImage = comicIssue.cover || PageBanner.src

	return (
		<>
			<GuestNavigation />
			<main className='claim-page'>
				<div
					className='comic-issue-banner-image'
					style={{ backgroundImage: `url('${heroImage}')`, filter: 'blur(10px)' }}
				>
					<div className={clsx('bottom-overlay', `bottom-overlay--standard`)} />
				</div>
				<div className='details'>
					<div className='details--left'>
						<SkeletonImage
							src={heroImage}
							width={400}
							height={550}
							loading='eager'
							alt='comic-cover'
							className='comic-issue-cover'
						/>
					</div>
					<Box className='details--right' width={isMobile ? 400 : 600}>
						<div>
							<div>
								<p className='comic-issue-title'>{comicIssue.title}</p>
							</div>
						</div>
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
							<Box>
								{candyMachine && (
									<>
										<div className='mint-header'>
											{hasMintingStarted() ? <p className='text--success'>● Minting in progress</p> : null}
											<p>
												Total: {candyMachine.itemsMinted}/{candyMachine.supply}
											</p>
										</div>
										<div className='mint-details'>
											{candyMachine.groups.map((group) => {
												const isLive = new Date(group.startDate) <= new Date() && new Date(group.endDate) > new Date()
												const isEnded = new Date() > new Date(group.endDate)
												return (
													<div className='mint-group' key={group.label}>
														<div className='group-detail-wrapper'>
															<div>
																<p>{group.displayLabel}</p>
																<div className='group-status'>
																	{isLive ? (
																		<span className='text--success'>Live</span>
																	) : isEnded ? (
																		<span className='text--error'>Ended</span>
																	) : (
																		<span className='text--important'>
																			Upcoming <Countdown targetDateTime={group.startDate} />
																		</span>
																	)}
																</div>
															</div>
															<div>
																<p>{group.mintPrice == 0 ? '*Free' : `${toSol(group.mintPrice)} SOL`}</p>
																<p>
																	{group.itemsMinted}/{group.supply}
																</p>
															</div>
														</div>
														<LinearProgress
															variant='determinate'
															className='progress-bar'
															color='inherit'
															value={normalise(group.itemsMinted, group.supply)}
														/>
														{isLive ? (
															<>
																{hasWalletConnected || isMobile ? (
																	<Button onClick={handleMint}>
																		{!isMintTransactionLoading ? (
																			'Mint'
																		) : (
																			<CircularProgress
																				thickness={6}
																				classes={{ svg: 'loader', root: 'loader--root' }}
																			/>
																		)}
																	</Button>
																) : (
																	<BaseWalletMultiButtonDynamic labels={WALLET_LABELS} style={{ width: '100%' }} />
																)}
																<p className='mint-limit'>
																	{group.mintLimit ? `Limit ${group.mintLimit} per wallet` : null}
																</p>
															</>
														) : null}
													</div>
												)
											})}
										</div>
									</>
								)}
							</Box>
						) : (
							<Box>
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

								<p className='comic-issue-description'>{comicIssue.description}</p>
								{comicIssue.creator && (
									<Box className='comic-issue-creator-wrapper'>
										<AvatarImage className='avatar' src={comicIssue.creator.avatar} size={60} />
										<Box>
											<Typography fontWeight='bold' marginLeft={2}>
												{comicIssue.creator.name} {comicIssue.creator.isVerified ? <VerifiedIcon /> : ''}
											</Typography>
										</Box>
									</Box>
								)}
							</Box>
						)}
					</Box>
				</div>
			</main>
			<MintedNftDialog nftAddress={nftAddress} open={showMintedNftDialog} onClose={closeMintedNftDialog} />
			<ConfirmTransactionDialog open={transactionConfirmationDialog} onClose={closeTransactionConfirmationDialog} />
		</>
	)
}

export default ClaimPage
