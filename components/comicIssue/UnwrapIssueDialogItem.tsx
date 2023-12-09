import { Nft } from '@/models/nft'
import Button from '@/components/Button'
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

interface Props {
	nft: Nft
}

const UnwrapIssueDialogItem: React.FC<Props> = ({ nft }) => {
	const { signTransaction } = useWallet()
	const { connection } = useConnection()
	const toaster = useToaster()

	const { refetch: fetchUseComicIssueNftTransaction } = useFetchUseComicIssueNftTransaction(
		{
			ownerAddress: nft.ownerAddress,
			nftAddress: nft.address,
		},
		false
	)

	const handleUnwrap = async () => {
		if (signTransaction) {
			const { data: unwrapTransaction } = await fetchUseComicIssueNftTransaction()
			if (unwrapTransaction) {
				const latestBlockhash = await connection.getLatestBlockhash()
				const signedTransaction = await signTransaction(unwrapTransaction)
				const signature = await connection.sendRawTransaction(signedTransaction.serialize())
				const response = await connection.confirmTransaction({ signature, ...latestBlockhash })
				if (!!response.value.err) {
					console.log('Response error log: ', response.value.err)
					toaster.add('Error unwrapping comic', 'error')
				}
			}
		}
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

	return (
		<div className='comic-issue-unwrap-item'>
			<div>
				<p>
					<strong>{nft.name}</strong>
				</p>
				<div className='icon'>
					{nft.attributes.map((attribute) => {
						const conditionMappings: { [key: string]: string } = {
							'used-false': 'Mint',
							'signed-true': 'Signed',
						}

						const conditionKey = `${attribute.trait}-${attribute.value}`
						const condition = conditionMappings[conditionKey]

						if (condition) {
							return (
								<div key={condition} className={condition.toLowerCase()}>
									{condition === 'Mint' ? <MintIcon /> : <SignedIcon />} {condition}
								</div>
							)
						} else if (attribute.trait === 'rarity') {
							return (
								<div key='rarity' className={`rarity ${attribute.value.toLowerCase()}`}>
									{getRarityIcon(attribute.value)} {attribute.value}
								</div>
							)
						} else {
							return null
						}
					})}
				</div>
			</div>
			<Button className='button--unwrap' noMinWidth onClick={handleUnwrap}>
				Open
			</Button>
		</div>
	)
}

export default UnwrapIssueDialogItem
