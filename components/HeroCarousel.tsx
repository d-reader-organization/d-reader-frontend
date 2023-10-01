import { Box, Container, Theme, Typography, useMediaQuery } from '@mui/material'
import { useFetchCarouselSlides } from 'api/carousel'
import { Carousel } from 'react-responsive-carousel'
import { CarouselSlide } from 'models/carousel/carouselSlide'
import { RoutePath } from 'enums/routePath'
import Image from 'next/image'
import clsx from 'clsx'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import ButtonLink from './ButtonLink'

const getSlideUrl = (slide: CarouselSlide) => {
	if (slide.comicIssueId) return RoutePath.ComicIssue(slide.comicIssueId)
	else if (slide.creatorSlug) return RoutePath.Creator(slide.creatorSlug)
	else if (slide.comicSlug) return RoutePath.Comic(slide.comicSlug)
	else return slide.externalLink || '#'
}

const HeroCarousel: React.FC = () => {
	const { data: carouselSlides = [] } = useFetchCarouselSlides()

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
			{carouselSlides.map((slide, index) => (
				<Box key={slide.id} className='slide'>
					<Image
						src={slide.image}
						alt=''
						fill
						quality={100}
						sizes='100vw'
						className={clsx('slide-image', isDesktop ? 'slide-image--compact' : '')}
						priority={index === 0}
					/>
					<Container className='slide-text-area' maxWidth='xl'>
						<ButtonLink href={getSlideUrl(slide)} blank={!!slide.externalLink} className='slide-button'>
							VISIT
						</ButtonLink>
						<Typography variant='h2' className='slide-title'>
							{slide.title}
						</Typography>
						<Typography variant='body1' className='slide-subtitle' component='p'>
							{slide.subtitle}
						</Typography>
					</Container>
					<div className='bottom-overlay' />
				</Box>
			))}
		</Carousel>
	)
}

export default HeroCarousel
