import { NftParams } from 'models/nft/nftParams'

export const NFT_QUERY_KEYS = Object.freeze({
	NFT: 'nft',
	GET: 'get',
})

export const nftKeys = Object.freeze({
	get: (address: string) => [NFT_QUERY_KEYS.NFT, NFT_QUERY_KEYS.GET, address],
	getMany: (params: NftParams) => [
		NFT_QUERY_KEYS.NFT,
		NFT_QUERY_KEYS.GET,
		params.ownerAddress,
		params.comicSlug,
		params.userId,
		params.comicIssueId,
		params.skip,
		params.take,
	],
})
