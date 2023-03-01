import { Box, Typography } from '@mui/material'
import { useFetchCarouselSlides } from 'api/carousel'
import { Carousel as ResponsiveCarousel } from 'react-responsive-carousel'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import Image from 'next/image'
import Overlay from './Overlay'

const Carousel: React.FC = () => {
	const { data: carouselSlides = [] } = useFetchCarouselSlides()

	return (
		<ResponsiveCarousel
			autoPlay
			infiniteLoop
			interval={8000}
			swipeable
			showStatus={false}
			showThumbs={false}
			className='slider'
		>
			{carouselSlides.map((slide) => (
				<Box key={slide.id} className='slide'>
					<Overlay />
					<Image
						src={slide.image}
						alt={slide.title}
						fill
						sizes='(max-width: 900px) 100vw,900px'
						className='slider-image'
						priority
					/>
					<Box className='slide-text-area'>
						<Typography variant='body2' className='slide-subtitle'>
							{slide.subtitle}
						</Typography>
						<Typography variant='h6' className='slide-title' component='p'>
							{slide.title}
						</Typography>
					</Box>
				</Box>
			))}
		</ResponsiveCarousel>
	)
}

export default Carousel
