import { useState } from 'react'
import { Box, BoxProps, Skeleton, Typography } from '@mui/material'
import { ComicIssue } from 'models/comicIssue'
import PriceTag from 'components/tags/PriceTag'
import Overlay from '../ui/Overlay'
import Image from 'next/image'
import clsx from 'clsx'
import { RoutePath } from 'enums/routePath'
import Link from 'next/link'

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
			<Link className='comic-issue-item-link' href={`${RoutePath.ComicIssues}/${comicIssue.id}`}>
				<Overlay borderRadius='1rem' />
				<Image
					sizes='(max-width: 580px) 100vw,(max-width: 900px) 50vw,(max-width: 1200)33vw,25vw'
					className='cover-image'
					src={comicIssue.cover}
					loading='lazy'
					alt=''
					fill
				/>

				<Box className='text-area'>
					{comicIssue.comic && (
						<Typography className='comic-title' variant='body2'>
							{comicIssue.comic.title}
						</Typography>
					)}
					<Typography className='comic-issue-title' variant='body2'>
						{comicIssue.title}
					</Typography>

					<Box display='flex' justifyContent='space-between'>
						{comicIssue.stats && (
							<Box className='episodes-badge'>
								EP {comicIssue.number}/{comicIssue.stats.totalIssuesCount}
							</Box>
						)}
						{comicIssue.stats && <PriceTag from colorfulIcon size={14} price={comicIssue.stats.price} />}
					</Box>
				</Box>
			</Link>
		</Box>
	)
}

export default ComicIssueItem
