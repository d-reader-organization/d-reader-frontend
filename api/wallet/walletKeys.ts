export const WALLET_QUERY_KEYS = Object.freeze({
	WALLET: 'wallet',
	GET: 'get',
	ME: 'me',
})

export const walletKeys = Object.freeze({
	wallet: [WALLET_QUERY_KEYS.WALLET],
	get: [WALLET_QUERY_KEYS.WALLET, WALLET_QUERY_KEYS.GET],
	getMe: () => [WALLET_QUERY_KEYS.WALLET, WALLET_QUERY_KEYS.GET, WALLET_QUERY_KEYS.ME],
})
