import { Role } from 'enums/role'

export interface Wallet {
	address: string
	name: string
	avatar: string
	role: Role
	hasBetaAccess: boolean
}
