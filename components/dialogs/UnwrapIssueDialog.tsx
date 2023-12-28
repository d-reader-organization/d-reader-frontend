import Dialog, { DialogProps } from '@mui/material/Dialog'
import CloseIcon from 'public/assets/vector-icons/close.svg'
import UnwrapIssueDialogItem from '../comicIssue/UnwrapIssueDialogItem'
import { Nft } from '@/models/nft'

interface Props extends DialogProps {
	onClose: VoidFunction
	nfts: Nft[]
}

const UnwrapIssueDialog: React.FC<Props> = ({ nfts = [], onClose, open, ...props }) => {
	return (
		<Dialog
			style={{ backdropFilter: 'blur(4px)' }}
			PaperProps={{ className: 'unwrap-dialog' }}
			onClose={onClose}
			open={open}
			maxWidth='xs'
			{...props}
		>
			<div className='close-icon-wrapper'>
				<CloseIcon className='close-icon' onClick={onClose} />
			</div>

			<div className='dialog-content'>
				<strong>Choose to open</strong>
				<p>In order to read comic issue you need to open it from its package.</p>
				{nfts.map((nft) => (!nft.isUsed ? <UnwrapIssueDialogItem key={nft.address} nft={nft} /> : null))}
			</div>
		</Dialog>
	)
}

export default UnwrapIssueDialog
