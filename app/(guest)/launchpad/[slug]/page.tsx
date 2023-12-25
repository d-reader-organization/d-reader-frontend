'use client'

import React, { useState } from 'react'
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
import { useFetchComicIssue, useFetchPublicComicIssue } from 'api/comicIssue'
import FlexRow from '@/components/FlexRow'
import Button from '@/components/Button'
import Image from 'next/image'
// import { useCountdown } from 'hooks'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import Navigation from '@/components/layout/Navigation'
import { useFetchMintOneTransaction } from '@/api/transaction'
import Dialog from '@mui/material/Dialog'
import { useToggle } from '@/hooks'
import { WALLET_LABELS } from '@/constants/wallets'
import { useToaster } from '@/providers/ToastProvider'
import ButtonLink from '@/components/ButtonLink'
import { RoutePath } from '@/enums/routePath'
import { CandyMachine } from '@/models/candyMachine'
import useAuthorizeWallet from '@/hooks/useAuthorizeWallet'
import dynamic from 'next/dynamic'
import clsx from 'clsx'
import { Hidden, LinearProgress, Toolbar } from '@mui/material'
import logoWithTextImage from 'public/assets/logo-with-text-colored.png'
import logoImage from 'public/assets/logo.png'
import Link from 'next/link'
import { useUserAuth } from '@/providers/UserAuthProvider'
import GuestNavigation from '@/components/layout/guestNavigation'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'

interface Params {
	slug: string
}

const BaseWalletMultiButtonDynamic = dynamic(
	async () => (await import('@solana/wallet-adapter-react-ui')).BaseWalletMultiButton,
	{ ssr: false }
)

const ComicIssueDetails = ({ params }: { params: Params }) => {
	const [walletNotConnectedDialogOpen, toggleWalletNotConnectedDialog] = useToggle()

	const { publicKey, signAllTransactions } = useWallet()
	const [toggleAbout, setToggleAbout] = useState<boolean>(false)
	const { connection } = useConnection()
	const toaster = useToaster()
	const { isAuthenticated } = useUserAuth()

	const { data: comicIssue, error } = useFetchPublicComicIssue(params.slug)

	const candyMachineAddress = comicIssue?.activeCandyMachineAddress || ''
	const walletAddress = publicKey?.toBase58()
	const hasWalletConnected = !!walletAddress

	const { data: candyMachine, refetch: fetchCandyMachine } = useFetchCandyMachine({
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

	const handleMint = async () => {
		if (!hasWalletConnected) {
			return toggleWalletNotConnectedDialog()
		}

		const activeGroup = getActiveGroup(candyMachine)

		if (!activeGroup?.wallet.isEligible) {
			const { data: updatedCandyMachine } = await fetchCandyMachine()
			const updatedActiveGroup = getActiveGroup(updatedCandyMachine)

			if (
				updatedActiveGroup?.wallet.itemsMinted &&
				updatedActiveGroup?.mintLimit <= updatedActiveGroup?.wallet.itemsMinted
			) {
				return toaster.add(`Sorry, the wallet ${publicKey?.toString()} has reached its minting limit.`, 'error')
			}
			if (!updatedActiveGroup?.wallet.isEligible) {
				return toaster.add(`Wallet ${publicKey?.toString()} is not eligible to mint`, 'error')
			}
		} else {
			const { data: mintTransactions = [] } = await fetchMintOneTransaction()
			if (!signAllTransactions) {
				return toaster.add('Wallet does not support signing multiple transactions', 'error')
			}
			const signedTransactions = await signAllTransactions(mintTransactions)
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
	}
	if (error) return <Box p={2}>{error.message}</Box>
	if (!comicIssue) return null

	const heroImage = comicIssue.cover || PageBanner.src

	return (
		<>
			<GuestNavigation />
			<main className='launchpad-page'>
				<div
					className='comic-issue-banner-image'
					style={{ backgroundImage: `url('${heroImage}')`, filter: 'blur(10px)' }}
				>
					<div className={clsx('bottom-overlay', `bottom-overlay--standard`)} />
				</div>
				<div className='details'>
					<div className='launchpad-page--right'>
						<Image src={heroImage} width={400} height={550} className='comic-issue-cover' alt='comic' />
					</div>
					<Box className='launchpad-page--left' width={isMobile ? 400 : 600}>
						<div>
							<div>
								<p className='comic-issue-title'>{comicIssue.title}</p>
							</div>
						</div>
						<div className='detail-toggle'>
							<p
								onClick={() => setToggleAbout(false)}
								style={!toggleAbout ? { borderBottom: '2px solid #fceb54' } : {}}
							>
								Mint
							</p>
							<p onClick={() => setToggleAbout(true)} style={toggleAbout ? { borderBottom: '2px solid #fceb54' } : {}}>
								About
							</p>
						</div>
						{!toggleAbout ? (
							<Box>
								{candyMachine && (
									<>
										<div className='mint-header'>
											<p className='text--important'>● Minting in progress</p>
											<p>
												Total: {candyMachine.itemsMinted}/{candyMachine.supply}
											</p>
										</div>
										<div className='mint-details'>
											{candyMachine.groups.map((group) => {
												const isLive = new Date(group.startDate) <= new Date() && new Date(group.endDate) > new Date()
												const isEnded = new Date() > new Date(group.endDate)
												return (
													<div className='mint-group'>
														<div className='group-detail-wrapper'>
															<div>
																<p>{group.displayLabel}</p>
																<p>
																	{isLive ? (
																		<span style={{ color: '#5fe1a2' }}>Live</span>
																	) : isEnded ? (
																		<span style={{ color: '#e3635b' }}>Ended</span>
																	) : (
																		<span style={{ color: '#fff174' }}>Upcoming</span>
																	)}
																</p>
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
																<Button>Mint</Button>
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
		</>
	)
}

export default ComicIssueDetails

/**
 * TODO
 * Wallet connection
 * Responsive
 * Show the live group , then upcoming group , then ended ones
 * Test the flow
 * websocket for progress
 */
