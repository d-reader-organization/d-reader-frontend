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
import { CandyMachine } from '@/models/candyMachine'
import useAuthorizeWallet from '@/hooks/useAuthorizeWallet'
import clsx from 'clsx'
import CircularProgress from '@mui/material/CircularProgress'
import SkeletonImage from '@/components/SkeletonImage'
import { shortenString } from '@/utils/helpers'
import { CandyMachineReceipt } from '@/models/candyMachine/candyMachineReceipt'
import NftMintedDialog from '@/components/dialogs/NftMintedDialog'
import { useToggle } from '@/hooks'
import ConfirmingTransactionDialog from '@/components/dialogs/ConfirmingTransactionDialog'
import io from 'socket.io-client'
import { useQueryClient } from 'react-query'
import { nftKeys } from '@/api/nft'
import Grid from '@mui/material/Grid'
import GuestNavigation from '@/components/layout/GuestNavigation'
import CandyMachineGroup from '../CandyMachineGroup'
import { Theme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

interface Params {
	id: string | number
}

const ClaimPage = ({ params }: { params: Params }) => {
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

	const { data: comicIssue, error } = useFetchPublicComicIssue(params.id)
	const candyMachineAddress = comicIssue?.activeCandyMachineAddress || ''
	const walletAddress = publicKey?.toBase58()

	useEffect(() => {
		// process.env.NEXT_PUBLIC_API_ENDPOINT
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

	const hasMintingStarted = () => {
		if (candyMachine?.groups.at(0)?.startDate)
			return !(new Date(candyMachine?.groups.at(0)?.startDate || '') > new Date())
		return false
	}

	const handleMint = useCallback(async () => {
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
				}
				// else if (!updatedActiveGroup?.wallet.isEligible) {
				// 	toaster.add(`Wallet ${shortenString(publicKey?.toString() || '')} is not eligible to mint`, 'error')
				// }
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
		candyMachine,
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
			<main className='claim-page'>
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
												return (
													<CandyMachineGroup
														key={group.label}
														group={group}
														isMintTransactionLoading={isMintTransactionLoading}
														handleMint={handleMint}
													/>
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
			</main>
			<NftMintedDialog nftAddress={nftAddress} open={showMintedNftDialog} onClose={closeMintedNftDialog} />
			<ConfirmingTransactionDialog open={transactionConfirmationDialog} onClose={closeTransactionConfirmationDialog} />
		</>
	)
}

export default ClaimPage
