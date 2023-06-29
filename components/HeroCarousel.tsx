import { Box, Button, Theme, Typography, useMediaQuery } from '@mui/material'
import { useFetchCarouselSlides } from 'api/carousel'
import { Carousel } from 'react-responsive-carousel'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import Image from 'next/image'
import clsx from 'clsx'

const HeroCarousel: React.FC = () => {
	const { data: carouselSlides = [] } = useFetchCarouselSlides()

	const isDesktop = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'))

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
			{carouselSlides.map((slide) => (
				<Box key={slide.id} className='slide'>
					<Image
						src={slide.image}
						alt=''
						fill
						quality={100}
						sizes='100vw'
						className={clsx('slide-image', isDesktop ? 'slide-image--compact' : '')}
						priority
					/>
					{/* TODO: skeleton */}
					{/* <Skeleton className='slider-image' height='100%' /> */}
					<Box className='slide-text-area'>
						<Button href='#' variant='contained' className='slide-button' size='large'>
							VISIT COMIC
						</Button>
						<Typography variant='h2' className='slide-title'>
							{slide.title}
						</Typography>
						<Typography variant='body1' className='slide-subtitle' component='p'>
							{slide.subtitle}
						</Typography>
					</Box>
					<div className='bottom-overlay' />
				</Box>
			))}
		</Carousel>
	)
}

export default HeroCarousel
