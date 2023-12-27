import Dialog, { DialogProps } from '@mui/material/Dialog'

interface Props extends DialogProps {
	onClose: VoidFunction
}

const ConfirmTransactionDialog: React.FC<Props> = ({ open, onClose, ...props }) => {
	return (
		<Dialog
			style={{ backdropFilter: 'blur(4px)' }}
			PaperProps={{ className: 'confirm-transaction-dialog' }}
			onClose={onClose}
			open={open}
			{...props}
		>
			<video className='confirming-animation' autoPlay loop muted>
				<source src='/assets/animations/confirm-transaction.mp4' type='video/mp4' />
				Confirming Transaction ....
			</video>
		</Dialog>
	)
}

export default ConfirmTransactionDialog
