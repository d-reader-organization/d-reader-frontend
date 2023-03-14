import { useState } from 'react'
import { Box, BoxProps, Skeleton, Typography } from '@mui/material'
import { ComicIssue } from 'models/comicIssue'
import PriceTag from 'components/tags/PriceTag'
import Overlay from './Overlay'
import Image from 'next/image'
import clsx from 'clsx'

interface Props extends BoxProps {
	comicIssue: ComicIssue
}

const ComicIssueItem: React.FC<Props> = ({ comicIssue, className, ...props }) => {
	const [isLoaded, setIsLoaded] = useState(false)

	if (!isLoaded) {
		return (
			<Box className={clsx('comic-issue-item', className)} {...props}>
				<Overlay />
				<Skeleton variant='rectangular' width='100%' height='100%' className='cover-image' />
				<Image
					sizes='(max-width: 580px) 100vw,(max-width: 900px) 50vw,(max-width: 1200)33vw,25vw'
					onLoadingComplete={() => setIsLoaded(true)}
					style={{ visibility: 'hidden' }}
					className='cover-image'
					src={comicIssue.cover}
					loading='lazy'
					alt=''
					fill
				/>
				<Box className='text-area'>
					<Skeleton variant='text' width='50%' />
					<Skeleton variant='text' />
					<Box display='flex' justifyContent='space-between'>
						<Skeleton variant='text' width='65%' />
						<Skeleton variant='text' width='15%' />
					</Box>
				</Box>
			</Box>
		)
	}

	return (
		<Box className={clsx('comic-issue-item', className)} {...props}>
			<Box position='relative' height='100%'>
				<Image
					sizes='(max-width: 580px) 100vw,(max-width: 900px) 50vw,(max-width: 1200)33vw,25vw'
					className='cover-image'
					src={comicIssue.cover}
					loading='lazy'
					alt=''
					fill
				/>

				{/* TODO: different badge variant if series are completed */}
				{comicIssue.stats && (
					<>
						<Box className='episodes-badge'>
							EP {comicIssue.number}/{comicIssue.stats.totalIssuesCount}
						</Box>
						{/* TODO: add "favorite" icon? */}
					</>
				)}
				{comicIssue.myStats && <Box className='favourite-badge'>{comicIssue.myStats.isFavourite ? '💖' : '🤍'}</Box>}
				<div className='blur' />
			</Box>

			<Box className='text-area'>
				{comicIssue.comic && (
					<Typography className='comic-title' variant='body2'>
						{comicIssue.comic.name}
					</Typography>
				)}
				<Typography className='comic-issue-title' variant='body2'>
					{comicIssue.title}
				</Typography>

				<Box display='flex' justifyContent='space-between'>
					{comicIssue.creator && (
						<Typography className='creator-name' variant='body2'>
							{comicIssue.creator.name}
						</Typography>
					)}
					{comicIssue.stats && <PriceTag price={comicIssue.stats.price} />}
				</Box>
			</Box>
		</Box>
	)
}

export default ComicIssueItem
