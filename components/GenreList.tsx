import { Box, BoxProps, Button, Typography } from '@mui/material'
import { useFetchGenres } from 'api/genre'
import clsx from 'clsx'

interface Props extends BoxProps {
	take: number
}

const GenreList: React.FC<Props> = ({ take, className, ...props }) => {
	const { data: genres = [] } = useFetchGenres({ skip: 0, take })

	return (
		<Box className={clsx('genre-list', className)} {...props}>
			{genres.map((genre) => (
				<Button
					key={genre.slug}
					className='genre-list-item'
					variant='contained'
					style={{ backgroundColor: genre.color }}
				>
					<img src={genre.icon} alt='' />
					<Typography variant='body1'>{genre.name}</Typography>
				</Button>
			))}
		</Box>
	)
}

export default GenreList
