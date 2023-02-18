import { Box, BoxProps, Grid, Typography } from '@mui/material'
import { useFetchComics } from 'api/comic'
import Image from 'next/image'
import clsx from 'clsx'

interface Props extends BoxProps {
	take: number
}

const ComicList: React.FC<Props> = ({ take, className, ...props }) => {
	const { data: comics = [] } = useFetchComics({ skip: 0, take })

	return (
		<Box className={clsx('comic-list', className)} {...props}>
			<Grid container spacing={2}>
				{comics.map((comic) => (
					<Grid key={comic.slug} item xs={12} sm={6} md={4} lg={3}>
						{/* TODO: these are Link-s */}
						<Box className='comic-list-item'>
							<Image blurDataURL='' src={comic.cover} alt='' fill sizes='100vw' className='cover-image' />

							{comic.stats && (
								<Box className='episodes-badge'>
									{comic.stats.issuesCount}
									{comic.stats.issuesCount > 1 ? ' EPs' : ' EP'}
								</Box>
							)}
							{comic.myStats && <Box className='favourite-badge'>{comic.myStats.isFavourite ? '💖' : '🤍'}</Box>}

							<Box className='text-area'>
								<Typography className='comic-title'>{comic.name}</Typography>
								{comic.creator && (
									<Typography>
										{comic.creator.name}
										{comic.creator.isVerified ? ' ✅' : ''}
									</Typography>
								)}
							</Box>
						</Box>
					</Grid>
				))}
			</Grid>
		</Box>
	)
}

export default ComicList
