import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import { Theme } from '@mui/material/styles'
import { useFetchCarouselSlides } from 'api/carousel'
import { Carousel } from 'react-responsive-carousel'
import { CarouselSlide } from 'models/carousel/carouselSlide'
import LogoIcon from 'public/assets/vector-icons/logo.svg'
import { CarouselLocation } from '@/enums/carouselLocation'
import { RoutePath } from 'enums/routePath'
import ButtonLink from './ButtonLink'
import Image from 'next/image'
import clsx from 'clsx'
import 'react-responsive-carousel/lib/styles/carousel.min.css'

const getSlideUrl = (slide: CarouselSlide) => {
	if (slide.comicIssueId) return RoutePath.ComicIssue(slide.comicIssueId)
	else if (slide.creatorSlug) return RoutePath.Creator(slide.creatorSlug)
	else if (slide.comicSlug) return RoutePath.Comic(slide.comicSlug)
	else return slide.externalLink
}

const DUMMY_SLIDE: CarouselSlide = {
	id: 0,
	image: '',
	priority: 0,
	title: '',
	subtitle: '',
	isPublished: false,
	isExpired: false,
	location: CarouselLocation.Home,
	comicIssueId: undefined,
	comicSlug: undefined,
	creatorSlug: undefined,
	externalLink: undefined,
}

const HeroCarousel: React.FC = () => {
	const { data: carouselSlides = [DUMMY_SLIDE] } = useFetchCarouselSlides()

	const isDesktop = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'))
	if (carouselSlides.length === 0) return null

	return (
		<Carousel
			autoPlay
			swipeable
			centerMode={isDesktop}
			infiniteLoop
			interval={10000}
			centerSlidePercentage={90}
			showStatus={false}
			showThumbs={false}
			className='hero-carousel'
		>
			{carouselSlides.map((slide, index) => {
				const visitUrl = getSlideUrl(slide)
				return (
					<Box key={slide.id} className='slide'>
						{visitUrl && (
							<Image
								src={slide.image}
								alt=''
								fill
								quality={100} // TODO: do we really need quality 100 here?
								sizes='100vw'
								className={clsx('slide-image', isDesktop ? 'slide-image--compact' : '')}
								priority={index === 0}
							/>
						)}
						<Container className='slide-text-area' maxWidth='xl'>
							{visitUrl && (
								<ButtonLink href={visitUrl} blank={!!slide.externalLink} className='slide-button'>
									<LogoIcon className='mini-logo' /> Visit
								</ButtonLink>
							)}
							<Typography variant='h2' className='slide-title'>
								{slide.title}
							</Typography>
							<Typography variant='body1' className='slide-subtitle' component='p'>
								{slide.subtitle}
							</Typography>
						</Container>
						<div className='bottom-overlay' />
					</Box>
				)
			})}
		</Carousel>
	)
}

export default HeroCarousel
