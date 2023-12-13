import Dialog, { DialogProps } from '@mui/material/Dialog'
import CloseIcon from 'public/assets/vector-icons/close.svg'
import { Nft } from '@/models/nft'
import UnwrapIssueDialogItem from '../comicIssue/UnwrapIssueDialogItem'

interface Props extends DialogProps {
	onClose: VoidFunction
	nfts?: Nft[]
}

const UnwrapIssueDialog: React.FC<Props> = ({ nfts, onClose, open, ...props }) => {
	return (
		<Dialog
			style={{ backdropFilter: 'blur(4px)' }}
			PaperProps={{ className: 'unwrap-dialog' }}
			onClose={onClose}
			open={open}
			{...props}
		>
			<div className='close-icon-wrapper'>
				<CloseIcon className='close-icon' onClick={onClose} />
			</div>

			<div className='dialog-content'>
				<strong>Choose to open</strong>
				<p>In order to read comic issue you need to open it from its package.</p>
				{nfts?.map((nft) => <UnwrapIssueDialogItem key={nft.address} nft={nft} />)}
			</div>
		</Dialog>
	)
}

export default UnwrapIssueDialog
