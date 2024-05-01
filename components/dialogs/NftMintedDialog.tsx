import Dialog, { DialogProps } from '@mui/material/Dialog'
// import CloseIcon from 'public/assets/vector-icons/close.svg'
import { nftKeys, useFetchNft } from '@/api/nft'
import Image from 'next/image'
import { CircularProgress, DialogContent } from '@mui/material'
import { getRarityIcon } from '../comicIssue/UnwrapIssueDialogItem'
import Link from 'next/link'
import { ComicIssue } from '@/models/comicIssue'
import { RoutePath } from '@/enums/routePath'
import UnwrapWarningDialog from './UnwrapWarningDialog'
import { useLocalStorage, useToggle } from '@/hooks'
import { useToaster } from '@/providers/ToastProvider'
import { useQueryClient } from 'react-query'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { useCallback, useState } from 'react'
import { useFetchMe } from '@/api/user'
import { useFetchUseComicIssueNftTransaction } from '@/api/transaction'
import { sleep } from '@/utils/helpers'
import { comicIssueKeys } from '@/api/comicIssue'
import Button from '../Button'
import { useRouter } from 'next/navigation'

interface Props extends DialogProps {
	onClose: VoidFunction
	nftAddress?: string
	comicIssue: ComicIssue
}

const NftMintedDialog: React.FC<Props> = ({ comicIssue, open, onClose, nftAddress }) => {
	const { data: nft } = useFetchNft(nftAddress || '')
	const [isUnwrapWarningRead] = useLocalStorage('unwrapWarning', false)
	const [unwrapWarningDialog, , closeUnwrapWarningDialog, openUnwrapWarningDialog] = useToggle(false)
	const { push } = useRouter()
	const toaster = useToaster()
	const queryClient = useQueryClient()
	const { signTransaction } = useWallet()
	const { connection } = useConnection()
	const [isLoading, setIsLoading] = useState(false)
	const { data: me } = useFetchMe()
	const myId = me?.id || 0
	const { refetch: fetchUseComicIssueNftTransaction } = useFetchUseComicIssueNftTransaction(
		{
			ownerAddress: nft?.ownerAddress ?? '',
			nftAddress: nft?.address ?? '',
		},
		false
	)

	const goToReader = useCallback(() => {
		push(RoutePath.ReadComicIssue(comicIssue.id), { scroll: false })
	}, [comicIssue.id, push])

	const handleUnwrap = useCallback(async () => {
		try {
			setIsLoading(true)
			const { data: unwrapTransaction } = await fetchUseComicIssueNftTransaction()
			if (unwrapTransaction) {
				if (!signTransaction) return
				const latestBlockhash = await connection.getLatestBlockhash()
				const signedTransaction = await signTransaction(unwrapTransaction)
				toaster.confirmingTransactions()
				const signature = await connection.sendRawTransaction(signedTransaction.serialize())
				const response = await connection.confirmTransaction({ signature, ...latestBlockhash })
				if (!!response.value.err) {
					console.log('Response error log: ', response.value.err)
					toaster.add('Error while unwrapping the comic', 'error')
					throw Error()
				}
				await sleep(1000)
			}
			// TODO: make sure comic pages are also invalidated
			queryClient.invalidateQueries(comicIssueKeys.get(comicIssue.id))
			queryClient.invalidateQueries(comicIssueKeys.getByOwner(myId))
			queryClient.invalidateQueries(nftKeys.getMany({ comicIssueId: comicIssue.id }))
			toaster.add('Comic unwrapped! Lets get to reading 🎉', 'success')
			goToReader()
		} catch (e) {
			console.error('Error while unwrapping the comic', e)
		} finally {
			setIsLoading(false)
			closeUnwrapWarningDialog()
			onClose()
		}
	}, [
		comicIssue.id,
		connection,
		fetchUseComicIssueNftTransaction,
		myId,
		queryClient,
		signTransaction,
		toaster,
		closeUnwrapWarningDialog,
		goToReader,
		onClose,
	])

	return (
		<>
			<Dialog
				open={open}
				onClose={onClose}
				fullWidth
				PaperProps={{
					style: {
						backgroundColor: 'transparent',
						boxShadow: 'none',
						maxHeight: 'calc(100% - 32px)',
						margin: '16px',
						maxWidth: '100%',
					},
				}}
			>
				<DialogContent>
					<div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}>
						<video autoPlay loop muted style={{ width: '100%', height: '100%', objectFit: 'cover' }}>
							<source src='/assets/animations/mint-loop.mp4' type='video/mp4' />
						</video>
					</div>
					<div className='minted-nft-dialog'>
						{nft ? (
							<>
								<span className='issue-title'>
									{comicIssue.title} - EP&nbsp;{comicIssue.number}
								</span>
								<span className='nft-tag'>Congrats! You got #{nft.name.split('#')[1]}</span>
								<div className={`rarity rarity--${nft.rarity.toLowerCase()}`}>
									{getRarityIcon(nft.rarity)} {nft.rarity}
								</div>
								<Image src={nft.image} width={690} height={1000} alt='Comic' className='cover-image' />

								<Link
									href={encodeURI(
										`https://twitter.com/intent/tweet?text=${`I just minted a ${nft.rarity} '${comicIssue.comic?.title}: ${comicIssue.title}' comic on @dReaderApp! 📚

Mint yours here while the supply lasts.👇
https://dreader.app/mint/${comicIssue.comicSlug}_${comicIssue.slug}?utm_source=web`}`
									)}
									target='_blank'
									className='twitter-button'
								>
									Share on &#120143;
								</Link>

								<div className='actions'>
									<Button
										onClick={async () => {
											if (!isUnwrapWarningRead) {
												openUnwrapWarningDialog()
												return
											}
											await handleUnwrap()
										}}
										backgroundColor='important'
									>
										Unwrap & Read
									</Button>
									<Button className='close-button' onClick={onClose} backgroundColor='transparent'>
										Close
									</Button>
								</div>
							</>
						) : (
							<CircularProgress thickness={6} classes={{ svg: 'loader', root: 'loader--root' }} />
						)}
					</div>
				</DialogContent>
			</Dialog>
			<UnwrapWarningDialog
				open={unwrapWarningDialog}
				onClose={closeUnwrapWarningDialog}
				handleUnwrap={handleUnwrap}
				isLoading={isLoading}
			/>
		</>
	)
}

export default NftMintedDialog
