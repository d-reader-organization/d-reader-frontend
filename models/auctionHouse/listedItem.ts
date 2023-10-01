import { ComicRarity } from 'enums/comicRarity'
import { NftAttribute } from 'models/nft/nftAttribute'
import { WalletIdentity } from 'models/wallet/walletIdentity'

export interface ListedNftItem {
	id: number
	nftAddress: string
	name: string
	cover: string
	seller: WalletIdentity
	tokenAddress: string
	price: number
	attributes: NftAttribute[]
	isUsed: boolean
	isSigned: boolean
	rarity: ComicRarity
}
