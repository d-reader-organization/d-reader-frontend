import { Genre } from 'models/genre'
import clsx from 'clsx'
import Button, { ButtonProps } from '../Button'

interface Props extends ButtonProps {
	active?: boolean
	genre: Genre
}

const GenreButton: React.FC<Props> = ({ genre, active = false, className, ...props }) => {
	return (
		<Button
			className={clsx('genre-button', className)}
			bold={false}
			style={{
				backgroundColor: active ? genre.color : 'transparent',
				borderColor: genre.color,
				borderWidth: 1,
				borderStyle: 'solid',
			}}
			{...props}
		>
			<img src={genre.icon} alt='' className='genre-icon' />
			<p>{genre.name}</p>
		</Button>
	)
}

export default GenreButton
