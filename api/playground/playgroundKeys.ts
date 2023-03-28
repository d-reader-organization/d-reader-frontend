export const PLAYGROUND_QUERY_KEYS = Object.freeze({
	PLAYGROUND: 'playground',
	TRANSACTION: 'transactions',
	CREATE_NFT: 'create-nft',
})

export const playgroundKeys = Object.freeze({
	playground: [PLAYGROUND_QUERY_KEYS.PLAYGROUND],
	getMintTransaction: [
		PLAYGROUND_QUERY_KEYS.PLAYGROUND,
		PLAYGROUND_QUERY_KEYS.TRANSACTION,
		PLAYGROUND_QUERY_KEYS.CREATE_NFT,
	],
})
