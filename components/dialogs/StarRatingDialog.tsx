import { useEffect, useState } from 'react'
import Dialog, { DialogProps } from '@mui/material/Dialog'
import CloseIcon from 'public/assets/vector-icons/close.svg'
import Button from '../Button'
import StarIcon from '../icons/StarIcon'
import FlexRow from '../FlexRow'

interface Props extends Omit<DialogProps, 'onSubmit'> {
	onClose: VoidFunction
	onSubmit: (rating: number) => void
	title: string
}

const StarRatingDialog: React.FC<Props> = ({ title, onClose, onSubmit, open, ...props }) => {
	const [rating, setRating] = useState<number | null>(null)

	const handleStarClick = (selectedRating: number) => {
		setRating(selectedRating)
	}

	const handleClose = () => {
		setRating(null)
		onClose()
	}

	useEffect(() => {
		if (open) setRating(null)
	}, [open])

	return (
		<Dialog
			style={{ backdropFilter: 'blur(4px)' }}
			PaperProps={{ className: 'action-dialog' }}
			onClose={handleClose}
			open={open}
			{...props}
		>
			<div className='close-icon-wrapper'>
				<CloseIcon className='close-icon' onClick={handleClose} />
			</div>

			<div className='dialog-content'>
				<strong>{title}</strong>
				Tap a star to give a rating!
				<FlexRow className='stars-row'>
					{[1, 2, 3, 4, 5].map((star) => (
						<StarIcon
							style={{ cursor: 'pointer' }}
							size='xl'
							key={star}
							onClick={() => handleStarClick(star)}
							solid={!!(rating && rating >= star)}
						/>
					))}
				</FlexRow>
			</div>

			<div className='dialog-actions'>
				<Button naked onClick={handleClose}>
					Cancel
				</Button>
				<Button
					naked
					onClick={() => {
						if (rating) onSubmit(rating)
					}}
				>
					OK
				</Button>
			</div>
		</Dialog>
	)
}

export default StarRatingDialog
