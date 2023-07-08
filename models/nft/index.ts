import { NftAttribute } from './nftAttribute'

export interface Nft {
	address: string
	uri: string
	image: string
	name: string
	description: string
	owner: string
	royalties: number
	isUsed: boolean
	isSigned: boolean
	comicName: string
	comicIssueName: string
	comicIssueId: number
	attributes: NftAttribute[]
	isListed: boolean
}
