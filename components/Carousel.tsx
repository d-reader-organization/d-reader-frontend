import { Box } from '@mui/material'
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
			interval={5000}
			swipeable
			showStatus={false}
			showThumbs={false}
			className='slider'
		>
			{carouselSlides.map((slide) => (
				<Box key={slide.id} height={500} position='relative'>
					<Image
						src={slide.image}
						alt={slide.title}
						fill
						sizes='(max-width: 900px) 100vw,900px'
						className='slider-image'
						priority
					/>
				</Box>
			))}
		</ResponsiveCarousel>
	)
}

export default Carousel
