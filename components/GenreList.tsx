import Box, { BoxProps } from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import { Pagination } from 'models/pagination'
import { useFetchGenres } from 'api/genre'
import Grow from '@mui/material/Grow'
import clsx from 'clsx'

interface Props extends BoxProps, Pagination {
	animate: boolean
}

const GenreList: React.FC<Props> = ({ skip, take, animate, className, ...props }) => {
	const { data: genres = [] } = useFetchGenres({ skip, take })

	return (
		<Box className={clsx('genre-list', className)} {...props}>
			<Grow in={animate}>
				<Grid container spacing={1}>
					{genres.map((genre) => (
						<Grid item key={genre.slug} xs={6} sm={3} md={3} lg={2}>
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
