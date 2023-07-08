import { Nft } from 'models/nft'
import { Wallet } from 'models/wallet'

export interface CandyMachineReceipt {
	nft: Pick<Nft, 'address' | 'name'>
	buyer: Pick<Wallet, 'address' | 'avatar' | 'name'>
	candyMachineAddress: string
	price: number
	timestamp: string
}
