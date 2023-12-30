import Dialog, { DialogProps } from '@mui/material/Dialog'
import CloseIcon from 'public/assets/vector-icons/close.svg'
import UnwrapIssueDialogItem from '../comicIssue/UnwrapIssueDialogItem'
import { Nft } from '@/models/nft'
import { useMemo } from 'react'

interface Props extends DialogProps {
	onClose: VoidFunction
	nfts: Nft[]
}

const UnwrapIssueDialog: React.FC<Props> = ({ nfts = [], onClose, open, ...props }) => {
	const unusedNfts = useMemo(() => nfts.filter((nft) => !nft.isUsed), [nfts])

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
				<p>In order to read the full comic issue, at least one NFT should be unwrapped.</p>
				{unusedNfts.map((nft) => (
					<UnwrapIssueDialogItem key={nft.address} nft={nft} />
				))}
			</div>
		</Dialog>
	)
}

export default UnwrapIssueDialog
