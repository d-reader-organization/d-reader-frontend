import { Role } from 'enums/role'

export interface User {
	id: number
	name: string
	email: string
	avatar: boolean
	isEmailVerified: boolean
	hasBetaAccess: boolean
	referralsRemaining: number
	role: Role
}

export interface UpdateUserData extends Partial<Pick<User, 'email' | 'name'>> {
	referrer?: string
}
