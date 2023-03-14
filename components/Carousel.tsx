import { Box, Button, Typography } from '@mui/material'
import { useFetchCarouselSlides } from 'api/carousel'
import { Carousel as ResponsiveCarousel } from 'react-responsive-carousel'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import Image from 'next/image'

const Carousel: React.FC = () => {
	const { data: carouselSlides = [] } = useFetchCarouselSlides()

	return (
		<ResponsiveCarousel
			autoPlay
			infiniteLoop
			interval={8000}
			swipeable
			showIndicators={false}
			showStatus={false}
			showThumbs={false}
			className='carousel'
		>
			{carouselSlides.map((slide) => (
				<Box key={slide.id} className='slide'>
					<Image
						src={slide.image}
						alt=''
						fill
						sizes='(max-width: 900px) 100vw,900px'
						className='slide-image'
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
		</ResponsiveCarousel>
	)
}

export default Carousel
