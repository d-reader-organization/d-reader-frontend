import React from 'react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { Box, Button, Container, Hidden, Theme, Typography, useMediaQuery } from '@mui/material'
import ComicIssueDiscoverList from 'components/comicIssue/ComicIssueDiscoverList'
import PageBanner from 'public/assets/page-banner.png'
import WebsiteIcon from 'public/assets/vector-icons/web-icon.svg'
import TwitterIcon from 'public/assets/vector-icons/twitter-icon.svg'
import DiscordIcon from 'public/assets/vector-icons/discord-icon.svg'
import TelegramIcon from 'public/assets/vector-icons/telegram-icon.svg'
import InstagramIcon from 'public/assets/vector-icons/instagram-icon.svg'
import TikTokIcon from 'public/assets/vector-icons/tiktok-icon.svg'
import YouTubeIcon from 'public/assets/vector-icons/youtube-icon.svg'
import VerifiedIcon from 'public/assets/vector-icons/verified-icon.svg'
import CollectionStatusItem from 'components/ui/CollectionStatusItem'
import IconButtonLink from 'components/buttons/ButtonLink'
import ProtectedContent from 'components/ProtectedContent'
import AvatarImage from 'components/AvatarImage'
import PriceTag from 'components/tags/PriceTag'
import { useFetchComicIssues } from 'api/comicIssue'
import { useFetchComic } from 'api/comic'
import { SortOrder } from 'enums/sortOrder'
import InfoList from 'components/ui/InfoList'
import { roundNumber } from 'utils/numbers'
import FlexRow from 'components/ui/FlexRow'
import Image from 'next/image'
import clsx from 'clsx'

const ComicDetails: NextPage = () => {
	const router = useRouter()
	const { slug } = router.query
	const { data: comic, error } = useFetchComic(slug as string)
	const { flatData: comicIssues = [] } = useFetchComicIssues({
		comicSlug: slug as string,
		take: 20,
		skip: 0,
	})

	const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))

	// const toggleFavorite = () => {
	// 	console.log('Toggle favorite')
	// }

	// const toggleBookmark = () => {
	// 	console.log('Toggle bookmark')
	// }

	if (error) return <Box p={2}>{error.message}</Box>
	if (!comic || !comic.stats || !comic.myStats) return null

	const hasHeroImage = comic.banner || comic.cover
	const fallbackImage = isMobile ? comic.cover : PageBanner.src
	const heroImage = comic.banner || fallbackImage

	return (
		<ProtectedContent>
			<div className='comic-details-banner-image' style={{ backgroundImage: `url('${heroImage}')` }}>
				<div className={clsx('bottom-overlay', `bottom-overlay--${hasHeroImage ? 'standard' : 'simpler'}`)} />
				{comic.logo && <Image src={comic.logo} priority width={600} height={300} className='comic-logo' alt='' />}
			</div>

			<Container className='comic-details' maxWidth='xl'>
				<Box className='comic-details-header'>
					<Box className='comic-details--left'>
						<FlexRow>
							<Typography variant='h4' component='h1'>
								{comic.title}
							</Typography>
							{/* TODO: implement this + import heart icons */}
							{/* <Button onClick={toggleFavorite}>❤️</Button> */}
						</FlexRow>
						{comic.genres && (
							<FlexRow>
								<Box className='comic-genre-list'>
									{comic.genres.map((genre) => (
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
						{comic.flavorText && (
							<Typography variant='body2' className='comic-flavor-text'>
								{comic.flavorText}
							</Typography>
						)}
						{/* TODO: add "view more" if more than 2-3 rows */}
						<Typography className='comic-description'>{comic.description}</Typography>
						{comic.creator && (
							<Box className='comic-creator-wrapper'>
								<AvatarImage src={comic.creator.avatar} size={48} />
								<Box ml={2}>
									<Typography className='text--author'>author</Typography>
									<Typography fontWeight='bold'>
										{comic.creator.name} {comic.creator.isVerified ? <VerifiedIcon /> : ''}
									</Typography>
								</Box>
							</Box>
						)}
					</Box>
					<Box className='comic-details--right'>
						<FlexRow className='comic-links-wrapper'>
							<FlexRow className='comic-links'>
								{/* TODO: if too many links, show a linktree dropdown */}
								<IconButtonLink href={comic.website} Icon={WebsiteIcon} blank />
								<IconButtonLink href={comic.twitter} Icon={TwitterIcon} blank />
								<IconButtonLink href={comic.discord} Icon={DiscordIcon} blank />
								<IconButtonLink href={comic.telegram} Icon={TelegramIcon} blank />
								<IconButtonLink href={comic.instagram} Icon={InstagramIcon} blank />
								<IconButtonLink href={comic.tikTok} Icon={TikTokIcon} blank />
								<IconButtonLink href={comic.youTube} Icon={YouTubeIcon} blank />
							</FlexRow>
							<Box width='max-content'>
								{/* TODO: enable this */}
								{/* <Button onClick={toggleBookmark}>+ Add to Library</Button> */}
							</Box>
						</FlexRow>
						<FlexRow className='comic-stats'>
							<InfoList orientation='vertical'>
								<Button>
									⭐&nbsp;<span>{roundNumber(comic.stats.averageRating) || '-'}</span>
								</Button>
								<Button>
									❤️&nbsp;<span>{comic.stats.favouritesCount}</span>
								</Button>
							</InfoList>

							<InfoList orientation='vertical'>
								<CollectionStatusItem
									label='volume'
									value={<PriceTag component='span' maxDecimals={0} price={1030220000000} bold symbol reverse />}
								/>
								<CollectionStatusItem label='issues' value={comic.stats.issuesCount} />
								<CollectionStatusItem label='readers' value={comic.stats.viewersCount} />
								<CollectionStatusItem label='ongoing' value={comic.isCompleted ? 'no ' : 'yes'} />
							</InfoList>
						</FlexRow>
					</Box>
				</Box>

				<Typography className='section-title' variant='h5' component='h2'>
					Issues ( {`${comic.stats.issuesCount}`} )
				</Typography>
				<ComicIssueDiscoverList params={{ comicSlug: comic.slug, sortOrder: SortOrder.ASC }} enabled hideItemsCount />
				{comicIssues.length === 0 && <Box>No issues found for this comic</Box>}
			</Container>
		</ProtectedContent>
	)
}

export default ComicDetails
