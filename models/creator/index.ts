import { Genre } from 'models/genre'
import { CreatorStats } from './creatorStats'
import { CreatorMyStats } from './creatorMyStats'

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
	twitter: string
	instagram: string
	lynkfire: string
	stats?: CreatorStats
	myStats?: CreatorMyStats
	genres?: Array<Pick<Genre, 'name' | 'slug' | 'color' | 'icon'>>
}
