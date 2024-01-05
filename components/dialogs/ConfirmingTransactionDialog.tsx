import Dialog, { DialogProps } from '@mui/material/Dialog'

interface Props extends DialogProps {
	onClose: VoidFunction
}

const ConfirmingTransactionDialog: React.FC<Props> = ({ open, onClose, ...props }) => {
	return (
		<Dialog
			style={{ backdropFilter: 'blur(4px)', background: 'radial-gradient(#15171c, rgb(21, 23, 28, 0.75))' }}
			PaperProps={{ className: 'confirm-transaction-dialog' }}
			onClose={onClose}
			open={open}
			{...props}
		>
			<video className='confirming-animation' autoPlay loop muted>
				<source src='/assets/animations/confirm-transaction.mp4' type='video/mp4' />
				Confirming transaction...
			</video>
		</Dialog>
	)
}

export default ConfirmingTransactionDialog
