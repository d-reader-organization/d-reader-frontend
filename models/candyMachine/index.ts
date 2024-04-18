import { CandyMachineGroupWithSource } from './candyMachineGroup'

export interface CandyMachine {
	address: string
	supply: number
	itemsMinted: number
	groups: CandyMachineGroupWithSource[]
}
