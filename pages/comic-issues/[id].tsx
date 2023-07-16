import React from 'react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { Box, Button, Container, Hidden, Theme, Typography, useMediaQuery } from '@mui/material'
import PageBanner from 'public/assets/page-banner.png'
import VerifiedIcon from 'public/assets/vector-icons/verified-icon.svg'
import CollectionStatusItem from 'components/ui/CollectionStatusItem'
import ProtectedContent from 'components/ProtectedContent'
import AvatarImage from 'components/AvatarImage'
import PriceTag from 'components/tags/PriceTag'
import { useFetchCandyMachine, useFetchCandyMachineReceipts } from 'api/candyMachine'
import { useFetchComicIssue } from 'api/comicIssue'
import InfoList from 'components/ui/InfoList'
import { roundNumber } from 'utils/numbers'
import FlexRow from 'components/ui/FlexRow'
import Image from 'next/image'
import { useCountdown } from 'hooks'
import clsx from 'clsx'

const ComicIssueDetails: NextPage = () => {
	const router = useRouter()
	const { id } = router.query
	const { data: comicIssue, error } = useFetchComicIssue(id as string)

	const candyMachineAddress = comicIssue?.candyMachineAddress || ''
	const isPrimarySale = !!candyMachineAddress

	const { data: candyMachine } = useFetchCandyMachine(candyMachineAddress)
	const { data: receipts } = useFetchCandyMachineReceipts({ candyMachineAddress, skip: 0, take: 20 })

	const { countdownString } = useCountdown({ expirationDate: candyMachine?.endsAt })
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
	if (!comicIssue || !comicIssue.stats || !comicIssue.myStats || !candyMachine) return null

	const heroImage = comicIssue.cover || PageBanner.src

	return (
		<ProtectedContent>
			<div
				className='comic-issue-details-banner-image'
				style={{ backgroundImage: `url('${heroImage}')`, filter: !isMobile ? 'blur(10px)' : '' }}
			>
				<div className={clsx('bottom-overlay', `bottom-overlay--${!isMobile ? 'standard' : 'simpler'}`)} />
			</div>

			<Container className='comic-issue-details' maxWidth='xl'>
				<Box className='comic-issue-details-header'>
					<Box className='comic-issue-details--left'>
						<FlexRow className='comic-issue-stats'>
							<InfoList orientation='vertical'>
								<Button>
									⭐&nbsp;<span>{roundNumber(comicIssue.stats.averageRating) || '-'}</span>
								</Button>
								<Button>
									❤️&nbsp;<span>{comicIssue.stats.favouritesCount}</span>
								</Button>
							</InfoList>
						</FlexRow>
					</Box>

					{!isMobile && (
						<Box className='comic-issue-details--middle'>
							<Image src={comicIssue.cover} alt='' priority width={600} height={800} />
						</Box>
					)}

					<Box className='comic-issue-details--right'>
						<FlexRow>
							<Typography variant='h4' component='h1'>
								{comicIssue.title}
							</Typography>
							{/* TODO: implement this */}
							{/* <Button onClick={toggleFavorite}>❤️</Button> */}
						</FlexRow>
						{comicIssue.genres && (
							<FlexRow>
								<Box className='comic-issue-genre-list'>
									{comicIssue.genres.map((genre) => (
										<Box className='genre-item' key={genre.slug}>
											<img src={genre.icon} alt='' className='genre-icon' />
											<Hidden smDown>
												<Typography variant='body1'>{genre.name}</Typography>
											</Hidden>
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
						<InfoList orientation='horizontal' mt={6}>
							{/* <CollectionStatusItem
									orientation="vertical" label='volume'
									value={<PriceTag component='span' maxDecimals={0} price={1030220000000} bold symbol reverse />}
								/> */}

							<CollectionStatusItem orientation='vertical' label='ends in' value={countdownString} />
							<CollectionStatusItem orientation='vertical' label='supply' value={candyMachine.supply} />
							<CollectionStatusItem orientation='vertical' label='minted' value={candyMachine.itemsMinted} />
							{/* <CollectionStatusItem orientation="vertical" label='listed' value={auctionHouse.itemsListed} /> */}
							<CollectionStatusItem
								orientation='vertical'
								label='price'
								value={
									<PriceTag component='span' maxDecimals={2} price={candyMachine.baseMintPrice} bold symbol reverse />
								}
							/>
						</InfoList>
					</Box>
				</Box>

				<Typography className='section-title' variant='h5' component='h2'>
					{isPrimarySale ? 'Buy now' : 'Secondary market'}
				</Typography>
				{/* <ComicIssueDiscoverList params={{ comicSlug: comic.slug, sortOrder: SortOrder.ASC }} enabled hideItemsCount /> */}
				{/* {comicIssues.length === 0 && <Box>No listed items found</Box>} */}
			</Container>
		</ProtectedContent>
	)
}

export default ComicIssueDetails
