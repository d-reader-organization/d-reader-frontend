import { Box, BoxProps, Grid } from '@mui/material'
import { useFetchComics } from 'api/comic'
import AnimatedGridItem from './AnimatedGrid'
import ComicItem from './ComicItem'
import clsx from 'clsx'

interface Props extends BoxProps {
	take: number
	animate: boolean
}

const ComicList: React.FC<Props> = ({ take, animate, className, ...props }) => {
	const { data: comics = [] } = useFetchComics({ skip: 0, take })

	return (
		<Box className={clsx('comic-list', className)} {...props}>
			<Grid container spacing={2}>
				{comics.map((comic, i) => (
					<AnimatedGridItem key={comic.slug} animate={animate} itemOrder={i} xs={12} sm={6} md={4} lg={3}>
						{/* TODO: these are Link-s */}
						<ComicItem comic={comic} />
					</AnimatedGridItem>
				))}
			</Grid>
		</Box>
	)
}

export default ComicList
