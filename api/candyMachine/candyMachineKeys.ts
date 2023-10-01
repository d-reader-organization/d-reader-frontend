import { CandyMachineParams, CandyMachineReceiptParams } from 'models/candyMachine/candyMachineParams'

export const CANDY_MACHINE_QUERY_KEYS = Object.freeze({
	CANDY_MACHINE: 'candy-machine',
	GET: 'get',
	RECEIPTS: 'receipts',
	MINTED_NFTS: 'minted-nfts',
	ELIGIBLE_GROUPS: 'eligible-groups',
	GROUPS: 'groups',
})

export const candyMachineKeys = Object.freeze({
	get: (params: CandyMachineParams) => [
		CANDY_MACHINE_QUERY_KEYS.CANDY_MACHINE,
		CANDY_MACHINE_QUERY_KEYS.GET,
		params.candyMachineAddress,
		params.walletAddress,
	],
	getReceipts: (params: CandyMachineReceiptParams) => [
		CANDY_MACHINE_QUERY_KEYS.CANDY_MACHINE,
		CANDY_MACHINE_QUERY_KEYS.GET,
		CANDY_MACHINE_QUERY_KEYS.RECEIPTS,
		params.candyMachineAddress,
		params.skip,
		params.take,
	],
	getMintedNfts: (candyMachineAddress: string) => [
		CANDY_MACHINE_QUERY_KEYS.CANDY_MACHINE,
		CANDY_MACHINE_QUERY_KEYS.GET,
		candyMachineAddress,
		CANDY_MACHINE_QUERY_KEYS.MINTED_NFTS,
	],
})
