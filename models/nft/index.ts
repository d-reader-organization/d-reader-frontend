import { ComicRarity } from 'enums/comicRarity'
import { NftAttribute } from './nftAttribute'

export interface Nft {
	address: string
	uri: string
	image: string
	name: string
	description: string
	ownerAddress: string
	royalties: number
	isUsed: boolean
	isSigned: boolean
	comicName: string
	comicIssueName: string
	comicIssueId: number
	isListed: boolean
	attributes: NftAttribute[]
	rarity: ComicRarity
}
