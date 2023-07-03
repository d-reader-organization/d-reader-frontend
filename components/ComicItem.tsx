import { useState } from 'react'
import { Box, BoxProps, Skeleton } from '@mui/material'
import { Comic } from 'models/comic'
import Overlay from './Overlay'
import Image from 'next/image'
import clsx from 'clsx'

interface Props extends BoxProps {
	comic: Comic
}

const ComicItem: React.FC<Props> = ({ comic, className, ...props }) => {
	const [isLoaded, setIsLoaded] = useState(false)

	if (!isLoaded) {
		return (
			<Box className={clsx('comic-item', className)} {...props}>
				<Overlay />
				<Skeleton variant='rectangular' width='100%' height='100%' className='cover-image' />
				<Image
					sizes='(max-width: 580px) 100vw,(max-width: 900px) 50vw,(max-width: 1200)33vw,25vw'
					onLoadingComplete={() => setIsLoaded(true)}
					style={{ visibility: 'hidden' }}
					className='cover-image'
					src={comic.cover}
					loading='lazy'
					alt=''
					fill
				/>
				<Box className='text-area'>
					<Skeleton variant='text' />
					<Skeleton variant='text' width='50%' />
				</Box>
			</Box>
		)
	}

	return (
		<Box className={clsx('comic-item', className)} {...props}>
			<Image
				sizes='(max-width: 580px) 100vw,(max-width: 900px) 50vw,(max-width: 1200)33vw,25vw'
				className='cover-image'
				src={comic.cover}
				loading='lazy'
				alt=''
				fill
			/>
			<Image
				sizes='(max-width: 580px) 100vw,(max-width: 900px) 50vw,(max-width: 1200)33vw,25vw'
				className='cover-logo'
				src={comic.logo}
				loading='lazy'
				alt=''
				width={250}
				height={250}
			/>

			{/* <Box className='text-area'>
				<Typography className='comic-title' variant='body2'>
					{comic.name}
				</Typography>
				{comic.creator && (
					<Box className='creator-name-wrapper'>
						<Typography className='creator-name' variant='body2'>
							{comic.creator.name}
						</Typography>
						{comic.creator.isVerified ? <VerifiedIcon /> : ''}
					</Box>
				)}
			</Box> */}
		</Box>
	)
}

export default ComicItem
