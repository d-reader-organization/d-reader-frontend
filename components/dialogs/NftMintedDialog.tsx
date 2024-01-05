import Dialog, { DialogProps } from '@mui/material/Dialog'
import CloseIcon from 'public/assets/vector-icons/close.svg'
import { useFetchNft } from '@/api/nft'
import Image from 'next/image'
import { CircularProgress } from '@mui/material'
import { getRarityIcon } from '../comicIssue/UnwrapIssueDialogItem'

interface Props extends DialogProps {
	onClose: VoidFunction
	nftAddress?: string
}

const NftMintedDialog: React.FC<Props> = ({ open, onClose, nftAddress, ...props }) => {
	const { data: nft } = useFetchNft(nftAddress || '')

	return (
		<Dialog
			style={{ backdropFilter: 'blur(4px)' }}
			PaperProps={{ className: 'minted-nft-dialog' }}
			onClose={onClose}
			open={open}
			maxWidth='xs'
			{...props}
		>
			{nft ? (
				<>
					<div className={`trait-label trait-label--left trait-label--${nft.rarity}`}>
						{getRarityIcon(nft.rarity)} {nft.rarity}
					</div>
					<div className={`trait-label trait-label--right trait-label--${nft.rarity}`}>{nft.name}</div>
					<Image src={nft.image} width={690} height={1000} alt='Comic' className='cover-image' />
				</>
			) : (
				<CircularProgress thickness={6} classes={{ svg: 'loader', root: 'loader--root' }} />
			)}
		</Dialog>
	)
}

export default NftMintedDialog
