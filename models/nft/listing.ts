import { Wallet } from 'models/wallet'
import { NftAttribute } from './nftAttribute'

export interface NftListing {
	id: number
	nftAddress: string
	name: string
	cover: string
	seller: Pick<Wallet, 'address' | 'avatar' | 'name'>
	tokenAddress: string
	price: number
	attributes: NftAttribute[]
	isUsed: boolean
	isSigned: boolean
}
