import { Box, Typography } from '@mui/material'
import { Carousel } from 'react-responsive-carousel'
import 'react-responsive-carousel/lib/styles/carousel.min.css'
import { useFetchComics } from 'api/comic'
import Image from 'next/image'

const ComicCarousel: React.FC = () => {
	const { data: comics = [] } = useFetchComics({ skip: 0, take: 4 })

	return (
		<Carousel
			autoPlay
			infiniteLoop
			interval={10000}
			swipeable
			showIndicators={false}
			showStatus={false}
			showThumbs={false}
			className='comic-carousel'
		>
			{comics.map((comic) => (
				<Box key={comic.slug} className='slide'>
					<Image
						src={comic.cover}
						alt=''
						fill
						sizes='(max-width: 900px) 100vw,900px'
						className='slide-image'
						priority
					/>
					{/* TODO: skeleton */}
					{/* <Skeleton className='slider-image' height='100%' /> */}
					<Box className='slide-text-area'>
						<Typography variant='h2' className='slide-name'>
							{comic.name}
						</Typography>
						<Typography variant='body1' className='slide-description' component='p'>
							{comic.description}
						</Typography>
					</Box>
					<div className='bottom-overlay' />
				</Box>
			))}
		</Carousel>
	)
}

export default ComicCarousel
