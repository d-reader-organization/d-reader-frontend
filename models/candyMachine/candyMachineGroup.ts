export interface CandyMachineGroup {
	label: string
	startDate: string
	endDate: string
	displayLabel: string
	splTokenAddress: string
	mintPrice: number
	itemsMinted: number
	mintLimit: number
	supply: number
	isActive: boolean
}

export interface CandyMachineGroupWallet {
	isEligible: boolean
	itemsMinted: number
	supply?: number
}

export interface CandyMachineGroupWithWallet extends CandyMachineGroup {
	wallet: CandyMachineGroupWallet
}
