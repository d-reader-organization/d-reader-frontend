import Dialog, { DialogProps } from '@mui/material/Dialog'
// import CloseIcon from 'public/assets/vector-icons/close.svg'
import { useFetchNft } from '@/api/nft'
import Image from 'next/image'
import { CircularProgress } from '@mui/material'
import { getRarityIcon } from '../comicIssue/UnwrapIssueDialogItem'
import Link from 'next/link'

interface Props extends DialogProps {
	onClose: VoidFunction
	nftAddress?: string
	comicIssueId?: string
}

const NftMintedDialog: React.FC<Props> = ({ comicIssueId, open, onClose, nftAddress, ...props }) => {
	const { data: nft } = useFetchNft(nftAddress || '')

	return (
		<Dialog
			style={{ backdropFilter: 'blur(4px)' }}
			PaperProps={{
				className: 'minted-nft-dialog',
				style: {
					backgroundColor: 'transparent',
					boxShadow: 'none',
				},
			}}
			onClose={onClose}
			open={open}
			maxWidth='xs'
			{...props}
		>
			{nft ? (
				<>
					<div className={`trait-label trait-label--${nft.rarity.toLowerCase()}`}>
						<div className={`rarity rarity--${nft.rarity.toLowerCase()}`}>
							{getRarityIcon(nft.rarity)} {nft.rarity}
						</div>
						<div className='issue-tag'>#{nft.name.split('#')[1]}</div>
					</div>
					<Image src={nft.image} width={690} height={1000} alt='Comic' className='cover-image' />

					<Link
						href={encodeURI(
							`https://twitter.com/intent/tweet?text=${`I just minted a ${nft.rarity.toLowerCase()} copy of the ${
								nft.name.split('#')[0]
							}!

Mint yours here while the supply lasts.👇
https://dreader.app/mint/${comicIssueId}`}`
						)}
						target='_blank'
						className='twitter-button'
					>
						Share on &#120143;
					</Link>
				</>
			) : (
				<CircularProgress thickness={6} classes={{ svg: 'loader', root: 'loader--root' }} />
			)}
		</Dialog>
	)
}

export default NftMintedDialog
