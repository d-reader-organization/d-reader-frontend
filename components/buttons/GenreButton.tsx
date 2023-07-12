import { Button, ButtonProps, Typography } from '@mui/material'
import { Genre } from 'models/genre'
import clsx from 'clsx'

interface Props extends ButtonProps {
	active?: boolean
	genre: Genre
}

const GenreButton: React.FC<Props> = ({ genre, active = false, className, ...props }) => {
	return (
		<Button
			className={clsx('genre-button', className)}
			variant='outlined'
			style={{
				backgroundColor: active ? genre.color : 'transparent',
				borderColor: genre.color,
			}}
			{...props}
		>
			<img src={genre.icon} alt='' className='genre-icon' />
			<Typography variant='body1'>{genre.name}</Typography>
		</Button>
	)
}

export default GenreButton
