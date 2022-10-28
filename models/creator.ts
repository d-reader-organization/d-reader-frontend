import { Comic } from './comic'

export interface Creator {
	id: number
	email: string
	name: string
	slug: string
	isDeleted: boolean
	isVerified: boolean
	thumbnail: string
	avatar: string
	banner: string
	logo: string
	description: string
	flavorText: string
	website: string
	comics: Comic[]
}
