import { Pagination } from 'models/pagination'

export interface CandyMachineReceiptParams extends Pagination {
	candyMachineAddress: string
}
