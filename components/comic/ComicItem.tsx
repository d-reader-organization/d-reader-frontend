import Box, { BoxProps } from '@mui/material/Box'
import { Comic } from 'models/comic'
import clsx from 'clsx'
import Link from 'next/link'
import { RoutePath } from 'enums/routePath'
import SkeletonImage from '../SkeletonImage'

interface Props extends BoxProps {
	comic: Comic
}

const ComicItem: React.FC<Props> = ({ comic, className, ...props }) => {
	const nextPage = RoutePath.Comic(comic.slug)

	return (
		<Box className={clsx('comic-item', className)} {...props}>
			<Link className='comic-item-link' href={nextPage}>
				<SkeletonImage sizes='1000px' className='cover-image' src={comic.cover} loading='lazy' alt='' fill />
				<SkeletonImage sizes='450px' className='cover-logo' src={comic.logo} loading='lazy' alt='' fill />
			</Link>
		</Box>
	)
}

export default ComicItem
