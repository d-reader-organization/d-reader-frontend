import Dialog, { DialogProps } from '@mui/material/Dialog'
import CloseIcon from 'public/assets/vector-icons/close.svg'
import UnwrapIssueDialogItem from '../comicIssue/UnwrapIssueDialogItem'
import { Asset } from '@/models/asset'
import { useMemo } from 'react'
import { ComicIssue } from '@/models/comicIssue'

interface Props extends DialogProps {
	onClose: VoidFunction
	assets: Asset[]
	comicIssue: ComicIssue
}

const UnwrapIssueDialog: React.FC<Props> = ({ assets = [], comicIssue, onClose, open, ...props }) => {
	const unusedAssets = useMemo(() => assets.filter((asset) => !asset.isUsed), [assets])

	return (
		<Dialog
			style={{ backdropFilter: 'blur(4px)' }}
			PaperProps={{ className: 'text-dialog action-dialog unwrap-dialog' }}
			onClose={onClose}
			open={open}
			maxWidth='xs'
			{...props}
		>
			<div className='close-icon-wrapper'>
				<CloseIcon className='close-icon' onClick={onClose} />
			</div>

			<div className='dialog-content'>
				<h3>Choose to open</h3>
				<p>In order to read the full comic issue, at least one Asset should be unwrapped.</p>
				{unusedAssets.map((asset) => (
					<UnwrapIssueDialogItem key={asset.address} asset={asset} comicIssue={comicIssue} onClose={onClose} />
				))}
			</div>
		</Dialog>
	)
}

export default UnwrapIssueDialog
