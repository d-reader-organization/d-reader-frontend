import { Nft } from 'models/nft'
import { WalletIdentity } from 'models/wallet/walletIdentity'

export interface CandyMachineReceipt {
	nft: Pick<Nft, 'address' | 'name'>
	buyer: WalletIdentity
	candyMachineAddress: string
	price: number
	timestamp: string
	splTokenAddress: string
}
