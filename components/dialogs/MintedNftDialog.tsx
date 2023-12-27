import Dialog, { DialogProps } from '@mui/material/Dialog'
import CloseIcon from 'public/assets/vector-icons/close.svg'
import { useFetchNft } from '@/api/nft'
import Image from 'next/image'
import { CircularProgress } from '@mui/material'

interface Props extends DialogProps {
	onClose: VoidFunction
	nftAddress?: string
}

const MintedNftDialog: React.FC<Props> = ({ open, onClose, nftAddress, ...props }) => {
	const { data: nft } = useFetchNft(nftAddress || '')
	return (
		<Dialog
			style={{ backdropFilter: 'blur(4px)' }}
			PaperProps={{ className: 'minted-nft-dialog' }}
			onClose={onClose}
			open={open}
			{...props}
		>
			<div className='close-icon-wrapper'>
				<CloseIcon className='close-icon' onClick={onClose} />
			</div>
			{nft ? (
				<Image src={nft.uri} width={400} height={500} alt='Comic' />
			) : (
				<CircularProgress thickness={6} classes={{ svg: 'loader', root: 'loader--root' }} />
			)}
		</Dialog>
	)
}

export default MintedNftDialog
