'use client'

import PageBanner from 'public/assets/page-banner.png'
import VerifiedIcon from 'public/assets/vector-icons/verified-icon.svg'
import WebsiteIcon from 'public/assets/vector-icons/web-icon.svg'
import TwitterIcon from 'public/assets/vector-icons/twitter-icon.svg'
import DiscordIcon from 'public/assets/vector-icons/discord-icon.svg'
import TelegramIcon from 'public/assets/vector-icons/telegram-icon.svg'
import InstagramIcon from 'public/assets/vector-icons/instagram-icon.svg'
import TikTokIcon from 'public/assets/vector-icons/tiktok-icon.svg'
import YouTubeIcon from 'public/assets/vector-icons/youtube-icon.svg'
import useAuthenticatedRoute from '@/hooks/useUserAuthenticatedRoute'
import { useFetchComicIssues } from '@/api/comicIssue'
import { useFavouritiseComic, useFetchComic, useRateComic } from '@/api/comic'
import FlexRow from '@/components/FlexRow'
import AvatarImage from '@/components/AvatarImage'
import ComicIssueDiscoverList from '@/components/comicIssue/ComicIssueDiscoverList'
import PriceTag from '@/components/tags/PriceTag'
import CollectionStatusItem from '@/components/ui/CollectionStatusItem'
import InfoList from '@/components/ui/InfoList'
import { SortOrder } from '@/enums/sortOrder'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import { Theme } from '@mui/material/styles'
import IconLink from '@/components/IconLink'
import { roundNumber } from '@/utils/numbers'
import Button from '@/components/Button'
import Image from 'next/image'
import clsx from 'clsx'
import Navigation from '@/components/layout/Navigation'
import HeartIcon from '@/components/icons/HeartIcon'
import { isNil } from 'lodash'
import StarIcon from '@/components/icons/StarIcon'
import StarRatingDialog from '@/components/dialogs/StarRatingDialog'
import useToggle from '@/hooks/useToggle'

interface Params {
	slug: string
}

export default function ComicPage({ params }: { params: Params }) {
	const [starRatingDialog, , closeStarRatingDialog, openStarRatingDialog] = useToggle()

	const { data: comic } = useFetchComic(params.slug)
	const { flatData: comicIssues } = useFetchComicIssues({
		comicSlug: params.slug,
		skip: 0,
		take: 20,
	})

	const { mutateAsync: toggleFavoriteComic, isLoading: loadingToggleFavoriteComic } = useFavouritiseComic(params.slug)
	const { mutateAsync: rateComic } = useRateComic(params.slug)

	const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))

	useAuthenticatedRoute()

	if (!comic || !comic.stats || !comic.myStats) return null

	const hasHeroImage = isMobile ? !!comic.cover : !!comic.banner
	const heroImage = isMobile ? comic.cover : comic.banner
	const heroImageWithFallback = heroImage || PageBanner.src

	return (
		<>
			<Navigation />
			<main className='comic-page'>
				<div className='comic-banner-image' style={{ backgroundImage: `url('${heroImageWithFallback}')` }}>
					<div className={clsx('bottom-overlay', `bottom-overlay--${hasHeroImage ? 'standard' : 'simpler'}`)} />
					{comic.logo && <Image src={comic.logo} priority width={600} height={300} className='comic-logo' alt='' />}
				</div>

				<Container className='comic' maxWidth='xl'>
					<Box className='comic-header'>
						<Box className='comic-page--left'>
							<FlexRow>
								<Typography variant='h4' component='h1'>
									{comic.title}
								</Typography>
							</FlexRow>
							{comic.genres && (
								<FlexRow>
									<Box className='comic-genre-list'>
										{comic.genres.map((genre) => (
											<Box className='genre-item' key={genre.slug}>
												<img src={genre.icon} alt='' className='genre-icon' />
												<Typography variant='body1'>{genre.name}</Typography>
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
						<Box className='comic-page--right'>
							<FlexRow className='comic-links-wrapper'>
								<FlexRow className='comic-links'>
									<IconLink href={comic.website} Icon={WebsiteIcon} blank />
									<IconLink href={comic.twitter} Icon={TwitterIcon} blank />
									<IconLink href={comic.discord} Icon={DiscordIcon} blank />
									<IconLink href={comic.telegram} Icon={TelegramIcon} blank />
									<IconLink href={comic.instagram} Icon={InstagramIcon} blank />
									<IconLink href={comic.tikTok} Icon={TikTokIcon} blank />
									<IconLink href={comic.youTube} Icon={YouTubeIcon} blank />
								</FlexRow>
								<Box width='max-content'>{/* <Button onClick={toggleBookmark}>+ Add to Library</Button> */}</Box>
							</FlexRow>
							<FlexRow className='comic-stats'>
								<InfoList orientation='vertical'>
									<Button naked onClick={openStarRatingDialog}>
										<StarIcon size='lg' solid={!isNil(comic.myStats?.rating)} />
										&nbsp;<span>{roundNumber(comic.stats.averageRating) || '-'}</span>
									</Button>
									<Button
										naked
										disabled={loadingToggleFavoriteComic}
										onClick={async () => {
											await toggleFavoriteComic()
										}}
									>
										<HeartIcon solid={comic.myStats?.isFavourite} />
										&nbsp;<span>{comic.stats.favouritesCount}</span>
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

				<StarRatingDialog
					title='Rate this comic series'
					open={starRatingDialog}
					onClose={closeStarRatingDialog}
					onSubmit={async (rating: number) => {
						await rateComic({ rating })
						closeStarRatingDialog()
					}}
				/>
			</main>
		</>
	)
}
