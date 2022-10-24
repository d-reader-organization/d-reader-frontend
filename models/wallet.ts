import { Role } from 'enums/role'

export interface Wallet {
	address: string
	avatar?: string
	label?: string
	role: Role
}
