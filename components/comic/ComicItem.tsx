import Box, { BoxProps } from '@mui/material/Box'
import { Comic } from 'models/comic'
import clsx from 'clsx'
import Link from 'next/link'
import { RoutePath } from 'enums/routePath'
import SkeletonImage from '../SkeletonImage'

interface Props extends BoxProps {
	comic: Comic
	priority?: boolean
	fetchPriority?: 'auto' | 'high' | 'low'
}

const ComicItem: React.FC<Props> = ({ comic, className, priority, fetchPriority, ...props }) => {
	const nextPage = RoutePath.Comic(comic.slug)

	return (
		<Box className={clsx('comic-item', className)} {...props}>
			<Link className='comic-item-link' href={nextPage}>
				<SkeletonImage
					sizes='1000px'
					className='cover-image'
					src={comic.cover}
					loading='eager'
					alt=''
					fill
					priority={priority}
					fetchPriority={fetchPriority}
				/>
				<SkeletonImage
					sizes='450px'
					className='cover-logo'
					src={comic.logo}
					loading='eager'
					alt=''
					fill
					priority={priority}
				/>
			</Link>
		</Box>
	)
}

export default ComicItem
