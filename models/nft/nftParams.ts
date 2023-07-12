import { Pagination } from 'models/pagination'

export interface nftParams extends Partial<Pagination> {
	owner?: string
}
