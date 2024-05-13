'use client'

import { useCallback, useState } from 'react'
import { Asset } from '@/models/asset'
import { useFetchUseComicIssueAssetTransaction } from '@/api/transaction'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { useToaster } from '@/providers/ToastProvider'
import MintIcon from 'public/assets/vector-icons/mint-attribute-icon.svg'
import SignedIcon from 'public/assets/vector-icons/signed-attribute-icon.svg'
import RareRarityIcon from 'public/assets/vector-icons/rare-rarity-icon.svg'
import LegendaryRarityIcon from 'public/assets/vector-icons/legendary-rarity-icon.svg'
import EpicRarityIcon from 'public/assets/vector-icons/epic-rarity-icon.svg'
import CommonRarityIcon from 'public/assets/vector-icons/common-rarity-icon.svg'
import UncommonRarityIcon from 'public/assets/vector-icons/uncommon-rarity-icon.svg'
import CircularProgress from '@mui/material/CircularProgress'
import ConnectButton from '../buttons/ConnectButton'
import { useQueryClient } from 'react-query'
import { comicIssueKeys } from '@/api/comicIssue'
import { ComicIssue } from '@/models/comicIssue'
import { useFetchMe } from '@/api/user'
import { assetKeys } from '@/api/asset'
import { sleep } from '@/utils/helpers'
import { useLocalStorage, useToggle } from '@/hooks'
import { Button } from '@mui/material'
import UnwrapWarningDialog from '../dialogs/UnwrapWarningDialog'
import { RoutePath } from '@/enums/routePath'
import { useRouter } from 'next/navigation'

interface Props {
	asset: Asset
	comicIssue: ComicIssue
	onClose: () => void
}

export const getRarityIcon = (rarity: string) => {
	switch (rarity.toLowerCase()) {
		case 'common':
			return <CommonRarityIcon />
		case 'uncommon':
			return <UncommonRarityIcon />
		case 'rare':
			return <RareRarityIcon />
		case 'epic':
			return <EpicRarityIcon />
		case 'legendary':
			return <LegendaryRarityIcon />
		default:
			return <CommonRarityIcon />
	}
}

const UnwrapIssueDialogItem: React.FC<Props> = ({ asset, comicIssue, onClose }) => {
	const [isUnwrapWarningRead] = useLocalStorage('unwrapWarning', false)
	const [unwrapWarningDialog, , closeUnwrapWarningDialog, openUnwrapWarningDialog] = useToggle(false)

	const toaster = useToaster()
	const queryClient = useQueryClient()
	const { signTransaction } = useWallet()
	const { connection } = useConnection()
	const [isLoading, setIsLoading] = useState(false)
	const { data: me } = useFetchMe()
	const myId = me?.id || 0
	const { push } = useRouter()

	const { refetch: fetchUseComicIssueAssetTransaction } = useFetchUseComicIssueAssetTransaction(
		{
			ownerAddress: asset.ownerAddress,
			assetAddress: asset.address,
		},
		false
	)

	const handleUnwrap = useCallback(async () => {
		try {
			setIsLoading(true)
			const { data: unwrapTransaction } = await fetchUseComicIssueAssetTransaction()
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
			queryClient.invalidateQueries(assetKeys.getMany({ comicIssueId: comicIssue.id }))
			toaster.add('Comic unwrapped! Lets get to reading 🎉', 'success')
			push(RoutePath.ReadComicIssue(comicIssue.id), { scroll: false })
		} catch (e) {
			console.error('Error while unwrapping the comic', e)
		} finally {
			setIsLoading(false)
			closeUnwrapWarningDialog()
			onClose()
		}
	}, [
		closeUnwrapWarningDialog,
		comicIssue.id,
		connection,
		fetchUseComicIssueAssetTransaction,
		myId,
		onClose,
		push,
		queryClient,
		signTransaction,
		toaster,
	])

	return (
		<div className='comic-issue-unwrap-item'>
			<div>
				<p className='title'>{asset.name}</p>
				<div className='trait-label-list'>
					{asset.rarity && (
						<div className={`trait-label trait-label--${asset.rarity.toLowerCase()}`}>
							{getRarityIcon(asset.rarity)} {asset.rarity}
						</div>
					)}
					{!asset.isUsed && (
						<div className='trait-label trait-label--mint'>
							<MintIcon /> Mint
						</div>
					)}
					{asset.isSigned && (
						<div className='trait-label trait-label--signed'>
							<SignedIcon /> Signed
						</div>
					)}
				</div>
			</div>
			{isUnwrapWarningRead ? (
				<ConnectButton className='button--unwrap' noMinWidth onClick={handleUnwrap}>
					{isLoading ? <CircularProgress className='loading-spinner' size={24} /> : 'Open'}
				</ConnectButton>
			) : (
				<Button className='button--unwrap' onClick={openUnwrapWarningDialog}>
					{isLoading ? <CircularProgress className='loading-spinner' size={24} /> : 'Open'}
				</Button>
			)}
			<UnwrapWarningDialog
				open={unwrapWarningDialog}
				onClose={closeUnwrapWarningDialog}
				handleUnwrap={handleUnwrap}
				isLoading={isLoading}
			/>
		</div>
	)
}

export default UnwrapIssueDialogItem
