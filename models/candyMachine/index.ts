import { CandyMachineCoupon } from './candyMachineCoupon'

export interface CandyMachine {
	address: string
	supply: number
	itemsMinted: number
	coupons: CandyMachineCoupon[]
}
