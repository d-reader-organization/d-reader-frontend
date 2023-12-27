import Dialog, { DialogProps } from '@mui/material/Dialog'
import CloseIcon from 'public/assets/vector-icons/close.svg'
import { Nft } from '@/models/nft'

interface Props extends Omit<DialogProps, 'onSubmit'> {
	onClose: VoidFunction
	onSubmit: (rating: number) => void
	nft?: Nft
}

const MintTransactionDialog: React.FC<Props> = ({ title, onClose, onSubmit, open, nft, ...props }) => {
	const handleClose = () => {
		onClose()
	}

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

			<div className='dialog-content'>{nft ? 'Nft' : 'Confriming Transaction'}</div>
		</Dialog>
	)
}

export default MintTransactionDialog
