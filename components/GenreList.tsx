import { Box, BoxProps, Button, Grid, Typography } from '@mui/material'
import { useFetchGenres } from 'api/genre'
import Grow from '@mui/material/Grow'
import clsx from 'clsx'

interface Props extends BoxProps {
	skip: number
	take: number
	animate: boolean
}

const GenreList: React.FC<Props> = ({ skip, take, animate, className, ...props }) => {
	const { data: genres = [] } = useFetchGenres({ skip, take })

	return (
		<Box className={clsx('genre-list', className)} {...props}>
			<Grow in={animate}>
				<Grid container spacing={1}>
					{genres.map((genre) => (
						<Grid item key={genre.slug} xs={6} sm={4} md={4} lg={3}>
							<Button className='genre-item' variant='contained' style={{ backgroundColor: genre.color }}>
								<img src={genre.icon} alt='' className='genre-icon' />
								<Typography variant='body1'>{genre.name}</Typography>
							</Button>
						</Grid>
					))}
				</Grid>
			</Grow>
		</Box>
	)
}

export default GenreList
