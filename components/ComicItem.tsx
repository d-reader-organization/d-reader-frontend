import { useState } from 'react'
import { Box, BoxProps, Skeleton, Typography } from '@mui/material'
import VerifiedIcon from 'public/assets/vector-icons/verified-icon.svg'
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
			<Overlay borderRadius='1rem' />
			<Image
				sizes='(max-width: 580px) 100vw,(max-width: 900px) 50vw,(max-width: 1200)33vw,25vw'
				className='cover-image'
				src={comic.cover}
				loading='lazy'
				alt=''
				fill
			/>
			<div className='blur' />

			{/* TODO: different badge variant if series are completed */}
			{comic.stats && (
				<Box className='episodes-badge'>
					{comic.stats.issuesCount}
					{comic.stats.issuesCount > 1 ? ' EPs' : ' EP'}
				</Box>
			)}
			<Box className='text-area'>
				<Typography className='comic-title' variant='body2'>
					{comic.name}
				</Typography>
				{comic.creator && (
					<Typography className='creator-name' variant='body2'>
						{comic.creator.name}
						{comic.creator.isVerified ? <VerifiedIcon /> : ''}
					</Typography>
				)}
			</Box>
		</Box>
	)
}

export default ComicItem
