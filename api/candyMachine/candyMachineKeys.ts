import { CandyMachineReceiptParams } from 'models/candyMachine/candyMachineParams'

export const CANDY_MACHINE_QUERY_KEYS = Object.freeze({
	CANDY_MACHINE: 'candy-machine',
	GET: 'get',
	RECEIPTS: 'receipts',
})

export const candyMachineKeys = Object.freeze({
	comic: [CANDY_MACHINE_QUERY_KEYS.CANDY_MACHINE],
	getCandyMachine: (address: string) => [CANDY_MACHINE_QUERY_KEYS.CANDY_MACHINE, CANDY_MACHINE_QUERY_KEYS.GET, address],
	getCandyMachineReceipts: (params: CandyMachineReceiptParams) => [
		CANDY_MACHINE_QUERY_KEYS.CANDY_MACHINE,
		CANDY_MACHINE_QUERY_KEYS.GET,
		CANDY_MACHINE_QUERY_KEYS.RECEIPTS,
		params.candyMachineAddress,
	],
})
