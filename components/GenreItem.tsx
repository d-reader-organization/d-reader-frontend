import Box, { BoxProps } from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { PartialGenre } from '@/models/genre'
import clsx from 'clsx'

interface Props extends BoxProps {
	genre: PartialGenre
	hideIcon?: boolean
}

const GenreItem: React.FC<Props> = ({ genre, hideIcon = false, className, ...props }) => {
	return (
		<Box className={clsx('genre-item', className)} style={{ backgroundColor: genre.color }} {...props}>
			{!hideIcon && <img src={genre.icon} alt='' className='genre-icon' />}
			<Typography variant='body1'>{genre.name}</Typography>
		</Box>
	)
}

export default GenreItem
