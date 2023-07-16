import { useState } from 'react'
import { Box, BoxProps, Skeleton } from '@mui/material'
import { Comic } from 'models/comic'
import Image from 'next/image'
import clsx from 'clsx'
import Link from 'next/link'
import { RoutePath } from 'enums/routePath'

interface Props extends BoxProps {
	comic: Comic
}

const ComicItem: React.FC<Props> = ({ comic, className, ...props }) => {
	const [isLoaded, setIsLoaded] = useState(false)

	return (
		<Box className={clsx('comic-item', className)} {...props}>
			<Link className='comic-item-link' href={`${RoutePath.Comics}/${comic.slug}`}>
				{!isLoaded && <Skeleton variant='rectangular' width='100%' height='100%' className='cover-image' />}
				<Image
					sizes='(max-width: 580px) 100vw,(max-width: 900px) 50vw,(max-width: 1200)33vw,25vw'
					onLoadingComplete={() => setIsLoaded(true)}
					style={{ visibility: isLoaded ? 'visible' : 'hidden' }}
					className='cover-image'
					src={comic.cover}
					loading='lazy'
					alt=''
					fill
				/>
				<Image
					sizes='(max-width: 580px) 100vw,(max-width: 900px) 50vw,(max-width: 1200)33vw,25vw'
					style={{ visibility: isLoaded ? 'visible' : 'hidden' }}
					className='cover-logo'
					src={comic.logo}
					loading='lazy'
					alt=''
					width={250}
					height={250}
				/>
				{!isLoaded && (
					<Box className='text-area'>
						<Skeleton variant='text' />
						<Skeleton variant='text' width='50%' />
					</Box>
				)}
			</Link>
		</Box>
	)
}

export default ComicItem
