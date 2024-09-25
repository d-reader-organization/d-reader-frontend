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
import { useFetchMintTransaction } from '@/api/transaction'
import { useToaster } from '@/providers/ToastProvider'
import useAuthorizeWallet from '@/hooks/useAuthorizeWallet'
import clsx from 'clsx'
import CircularProgress from '@mui/material/CircularProgress'
import SkeletonImage from '@/components/SkeletonImage'
import { CandyMachineReceipt } from '@/models/candyMachine/candyMachineReceipt'
import { AssetMintedDialog } from '@/components/dialogs/AssetMintedDialog'
import { useToggle } from '@/hooks'
import ConfirmingTransactionDialog from '@/components/dialogs/ConfirmingTransactionDialog'
import io from 'socket.io-client'
import { useQueryClient } from 'react-query'
import { assetKeys } from '@/api/asset'
import Grid from '@mui/material/Grid'
import GuestNavigation from '@/components/layout/GuestNavigation'
import { Theme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import FaqLink from '@/components/ui/FaqLink'
import ButtonLink from '@/components/ButtonLink'
import { getCouponDiscount, validateMintEligibilty } from '@/utils/mint'
import { CandyMachineDetail } from '@/components/CandyMachineDetail'
import { useUserAuth } from '@/providers/UserAuthProvider'
import Navigation from '@/components/layout/Navigation'
import { CouponType } from '@/models/candyMachine/candyMachineCoupon'
import { sendMintTransaction } from '@/api/transaction/queries/useSendMintTransaction'
import { useFetchSupportedTokens } from '@/api/settings'

export const dynamic = 'force-dynamic'

interface Params {
	id: string | number
}

const MintPage = ({ params }: { params: Params }) => {
	const { publicKey, signAllTransactions } = useWallet()
	const [mintDetailsSection, openMintDetailsSection, closeMintDetailsSection] = useToggle(false)
	const [transactionConfirmationDialog, , closeTransactionConfirmationDialog, openTransactionConfirmationDialog] =
		useToggle()
	const [isMintTransactionLoading, openMintTransactionLoading, closeMintTransactionLoading] = useToggle(false)
	const [showMintedAssetDialog, openMintedAssetDialog, closeMintedAssetDialog] = useToggle()
	const [assetAddress, setAssetAddress] = useState<string>()
	const { connection } = useConnection()
	const queryClient = useQueryClient()
	const toaster = useToaster()
	const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))
	const { isAuthenticated } = useUserAuth()
	const [selectedCouponId,setSelectedCouponId] = useState<number>()
	const [couponLabel,setCouponLabel] = useState<string>()
	const [numberOfItems,setNumberOfItems] = useState(1);

	const paramsId = params.id
	const { data: comicIssue, error } = useFetchPublicComicIssue(paramsId)
	const comicIssueId = comicIssue?.id || 0
	const candyMachineAddress = comicIssue?.activeCandyMachineAddress || ''
	const walletAddress = publicKey?.toBase58()

	useEffect(() => {
		if (!walletAddress) return
		const socket = io(process.env.NEXT_PUBLIC_API_ENDPOINT || '')
		socket.on(`wallet/${walletAddress}/item-minted`, async (data: CandyMachineReceipt): Promise<void> => {
			setAssetAddress(data.asset.address)
			queryClient.invalidateQueries([CANDY_MACHINE_QUERY_KEYS.CANDY_MACHINE])
			queryClient.invalidateQueries(comicIssueKeys.get(comicIssueId))
			queryClient.invalidateQueries(assetKeys.getMany({ comicIssueId }))
			queryClient.invalidateQueries(assetKeys.getMany({ ownerAddress: walletAddress }))
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

	const {data: supportedTokens} = useFetchSupportedTokens();
	useEffect(()=>{
		const publicCoupon = candyMachine?.coupons.find(coupon=>coupon.type == CouponType.PublicUser);
		setSelectedCouponId(publicCoupon?.id);
	},[candyMachine])

	useAuthorizeWallet()

	const { refetch: fetchMintTransaction } = useFetchMintTransaction(
		{
			candyMachineAddress,
			minterAddress: walletAddress || '',
			label: couponLabel,
			couponId: selectedCouponId,
			numberOfItems:numberOfItems.toString()
		},
		!!walletAddress && !!candyMachine && validateMintEligibilty(candyMachine?.coupons,selectedCouponId).isEligible
	)
	
	const handleCloseMintedAssetDialog = useCallback(() => {
		setAssetAddress(undefined)
		closeMintedAssetDialog()
	}, [closeMintedAssetDialog])

	const handleMint = useCallback(async () => {
		console.log(couponLabel)
		if(!walletAddress){
			toaster.add("Please connect your wallet", 'info');
			return;
		}

		openMintTransactionLoading()
		try {
			const { data: updatedCandyMachine } = await fetchCandyMachine()
			if(!updatedCandyMachine){
				toaster.add("Mint is not active",'error');
				return;
			}

			const isMintValid = validateMintEligibilty(updatedCandyMachine?.coupons,selectedCouponId)
			if (isMintValid) {
				const { data: mintTransactions = [] } = await fetchMintTransaction()
				if (!signAllTransactions) {
					return toaster.add('Wallet does not support signing multiple transactions', 'error')
				}
				const signedTransactions = await signAllTransactions(mintTransactions)
				closeMintTransactionLoading()
				openTransactionConfirmationDialog()
				const serializedTransactions : string[] = []
				
				let i = 0
				for (const transaction of signedTransactions) {
					try {
						const serializedTransaction = Buffer.from(transaction.serialize()).toString('base64')
						serializedTransactions.push(serializedTransaction);
					} catch (e) {
						console.log('error: ', e)
						toaster.add('Something went wrong', 'error')
					}
					i += 1
				}
				openMintedAssetDialog()
				await sendMintTransaction(walletAddress,serializedTransactions);
				toaster.add('Successfully minted the comic! Find the asset in your wallet', 'success')
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
		fetchMintTransaction,
		openMintTransactionLoading,
		openMintedAssetDialog,
		openTransactionConfirmationDialog,
		signAllTransactions,
		toaster,
	])

	if (error) return <Box p={2}>{error.message}</Box>
	if (!comicIssue) return null

	const heroImage = comicIssue.cover || PageBanner.src
	return (
		<>
			{isAuthenticated ? <Navigation paramId={params.id}/> : <GuestNavigation />}

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
					<Grid item className='details details--right' xs={12} md={6} mt={[4, 0]}>
						<p className='comic-issue-title'>
							{comicIssue.comic?.title} - {comicIssue.title}
						</p>
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
							<Box pt={3}>
								{supportedTokens && selectedCouponId && candyMachine && candyMachine.coupons.length > 0 && !comicIssue.isSecondarySaleActive ? (
									<div>
									<div className='mint-details'>
									<CandyMachineDetail
										selectedCouponId={selectedCouponId}
										supportedTokens={supportedTokens}
										candyMachine={candyMachine}
										isMintTransactionLoading={isMintTransactionLoading}
										handleMint={handleMint}
										setCouponLabel={setCouponLabel}
										isAuthenticated={isAuthenticated}
									/>
								</div>
								<div className='coupon-list'>
									{candyMachine.coupons.map(coupon=>(
										<div className={coupon.stats.isEligible ? 'coupon' : 'coupon coupon--disable'} onClick={()=>setSelectedCouponId(coupon.id)}>
											<p>{coupon.name}</p>
											<p>{coupon.description}</p>
											<p>{coupon.numberOfRedemptions}</p>
											<p>Discount: {getCouponDiscount(candyMachine.coupons,coupon)}</p>
										</div>
									))}
								</div>
									</div>
								) : (
									<ButtonLink backgroundColor='yellow-500' href='https://www.tensor.trade/creator/dreader' blank>
										Trade on Tensor
									</ButtonLink>
								)}
							</Box>
						) : (
							<Box className='comic-issue-container' pt={3}>
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
								<p>📖 Pages: {comicIssue.stats?.totalPagesCount || 16}</p>

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
			</main>
			<AssetMintedDialog
				assetAddress={assetAddress}
				comicIssue={comicIssue}
				open={showMintedAssetDialog}
				onClose={handleCloseMintedAssetDialog}
			/>
			<ConfirmingTransactionDialog open={transactionConfirmationDialog} onClose={closeTransactionConfirmationDialog} />
		</>
	)
}

export default MintPage
