'use client'

import { useCallback, useState } from 'react'
import { Nft } from '@/models/nft'
import { useFetchUseComicIssueNftTransaction } from '@/api/transaction'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { useToaster } from '@/providers/ToastProvider'
import MintIcon from 'public/assets/vector-icons/mint-attribute-icon.svg'
import SignedIcon from 'public/assets/vector-icons/signed-attribute-icon.svg'
import RareRarityIcon from 'public/assets/vector-icons/rare-rarity-icon.svg'
import LegendaryRarityIcon from 'public/assets/vector-icons/legendary-rarity-icon.svg'
import EpicRarityIcon from 'public/assets/vector-icons/epic-rarity-icon.svg'
import CommonRarityIcon from 'public/assets/vector-icons/common-rarity-icon.svg'
import UncommonRarityIcon from 'public/assets/vector-icons/uncommon-rarity-icon.svg'
import { CircularProgress } from '@mui/material'
import ConnectButton from '../buttons/ConnectButton'

interface Props {
	nft: Nft
}

const getRarityIcon = (rarity: string) => {
	switch (rarity) {
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

const UnwrapIssueDialogItem: React.FC<Props> = ({ nft }) => {
	const { signTransaction } = useWallet()
	const { connection } = useConnection()
	const toaster = useToaster()
	const [isLoading, setIsLoading] = useState(false)

	const { refetch: fetchUseComicIssueNftTransaction } = useFetchUseComicIssueNftTransaction(
		{
			ownerAddress: nft.ownerAddress,
			nftAddress: nft.address,
		},
		false
	)

	const handleUnwrap = useCallback(async () => {
		if (signTransaction) {
			try {
				setIsLoading(true)
				const { data: unwrapTransaction } = await fetchUseComicIssueNftTransaction()
				if (unwrapTransaction) {
					const latestBlockhash = await connection.getLatestBlockhash()
					const signedTransaction = await signTransaction(unwrapTransaction)
					const signature = await connection.sendRawTransaction(signedTransaction.serialize())
					const response = await connection.confirmTransaction({ signature, ...latestBlockhash })
					if (!!response.value.err) {
						console.log('Response error log: ', response.value.err)
						toaster.add('Error while unwrapping the comic', 'error')
						throw Error()
					}
					// TODO: sleep & invalidate specific queries + close the dialog
					toaster.add('Comic used! Lets get to reading 🎉', 'success')
				}
			} catch (e) {
				console.error('Error while unwrapping the comic', e)
			} finally {
				setIsLoading(false)
			}
		}
	}, [connection, fetchUseComicIssueNftTransaction, signTransaction, toaster])

	return (
		<div className='comic-issue-unwrap-item'>
			<div>
				<p className='title'>{nft.name}</p>
				<div className='trait-label-list'>
					{nft.rarity && (
						<div className={`trait-label trait-label--${nft.rarity}`}>
							{getRarityIcon(nft.rarity)} {nft.rarity}
						</div>
					)}
					{!nft.isUsed && (
						<div className='trait-label trait-label--mint'>
							<MintIcon /> Mint
						</div>
					)}
					{nft.isSigned && (
						<div className='trait-label trait-label--signed'>
							<SignedIcon /> Signed
						</div>
					)}
				</div>
			</div>
			<ConnectButton className='button--unwrap' noMinWidth onClick={handleUnwrap}>
				{isLoading ? <CircularProgress className='loading-spinner' size={24} /> : 'Open'}
			</ConnectButton>
		</div>
	)
}

export default UnwrapIssueDialogItem
