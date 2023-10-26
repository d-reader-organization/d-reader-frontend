'use client'

import React from 'react'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import { Theme } from '@mui/material/styles'
import PageBanner from 'public/assets/page-banner.png'
import VerifiedIcon from 'public/assets/vector-icons/verified-icon.svg'
import CollectionStatusItem from 'components/ui/CollectionStatusItem'
import AvatarImage from 'components/AvatarImage'
import PriceTag from 'components/tags/PriceTag'
import InfoList from 'components/ui/InfoList'
import { useFetchCandyMachine, useFetchCandyMachineReceipts } from 'api/candyMachine'
import { useFetchComicIssue } from 'api/comicIssue'
import { roundNumber } from 'utils/numbers'
import FlexRow from '@/components/FlexRow'
import Button from '@/components/Button'
import Image from 'next/image'
// import { useCountdown } from 'hooks'
import clsx from 'clsx'
import { useWallet } from '@solana/wallet-adapter-react'
import Navigation from '@/components/layout/Navigation'

interface Params {
	id: string
}

const ComicIssueDetails = ({ params }: { params: Params }) => {
	const { data: comicIssue, error } = useFetchComicIssue(params.id)
	const { publicKey } = useWallet()

	const walletAddress = publicKey?.toBase58() || ''
	const candyMachineAddress = comicIssue?.activeCandyMachineAddress || ''
	const isPrimarySale = !!candyMachineAddress

	const { data: candyMachine } = useFetchCandyMachine({ candyMachineAddress, walletAddress })
	const { data: receipts } = useFetchCandyMachineReceipts({ candyMachineAddress, skip: 0, take: 20 })

	// const { countdownString } = useCountdown({ expirationDate: candyMachine?.endsAt })
	const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))

	// TRANSPARENT BACKGROUND NAVIGATION
	// TODO: It might not have a CM nor AH (offchain)
	console.log(candyMachine)
	console.log(receipts)
	// TODO: auctionHouse

	// const toggleFavorite = () => {
	// 	console.log('Toggle favorite')
	// }

	// const toggleBookmark = () => {
	// 	console.log('Toggle bookmark')
	// }

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
										<Button backgroundColor='yellow-500'>
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
							{/* TODO: add "view more" if more than 2-3 rows */}
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
								<InfoList orientation='horizontal' mt={6}>
									{/* <CollectionStatusItem
								orientation="vertical" label='volume'
								value={<PriceTag component='span' maxDecimals={0} price={1030220000000} bold symbol reverse />}
							/> */}

									{/* <CollectionStatusItem orientation='vertical' label='ends in' value={countdownString} /> */}
									<CollectionStatusItem orientation='vertical' label='supply' value={candyMachine.supply} />
									<CollectionStatusItem orientation='vertical' label='minted' value={candyMachine.itemsMinted} />
									{/* <CollectionStatusItem orientation="vertical" label='listed' value={auctionHouse.itemsListed} /> */}
									<CollectionStatusItem
										orientation='vertical'
										label='price'
										value={
											<PriceTag
												component='span'
												maxDecimals={2}
												price={candyMachine.groups[0]?.mintPrice || 0}
												bold
												symbol
												reverse
											/>
										}
									/>
								</InfoList>
							)}
							{isMobile && (
								<Box mt={2}>
									<FlexRow>
										<Button backgroundColor='transparent' borderColor='grey-100' className='button--preview'>
											Preview
										</Button>
										{candyMachine && (
											<Button backgroundColor='yellow-500'>
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

					<Typography className='section-title' variant='h5' component='h2'>
						{isPrimarySale ? 'Buy now' : 'Secondary market'}
					</Typography>
					{/* <ComicIssueDiscoverList params={{ comicSlug: comic.slug, sortOrder: SortOrder.ASC }} enabled hideItemsCount /> */}
					{/* {comicIssues.length === 0 && <Box>No listed items found</Box>} */}
				</Container>
			</main>
		</>
	)
}

export default ComicIssueDetails
