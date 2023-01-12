import { CreatorStats } from './creatorStats'

export interface Creator {
	id: number
	email: string
	name: string
	slug: string
	isDeleted: boolean
	isVerified: boolean
	avatar: string
	banner: string
	logo: string
	description: string
	flavorText: string
	website: string
	stats?: CreatorStats
}
