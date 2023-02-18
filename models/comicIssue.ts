import { Comic } from './comic'
import { Creator } from './creator'

export interface ComicIssue {
	id: number
	number: number
	suppy: number
	discountMintPrice: number
	mintPrice: 0.05
	title: string
	slug: string
	description: string
	flavorText: string
	cover: string
	soundtrack: string
	releaseDate: string
	isFree: boolean
	isPublished: boolean
	isPopular: boolean
	isDeleted: boolean
	isVerified: boolean
	creator?: Pick<Creator, 'name' | 'slug' | 'isVerified' | 'avatar'>
	comic?: Pick<Comic, 'name' | 'slug' | 'isMatureAudience'>
	stats?: unknown // TODO
	myStats?: unknown // TODO
}
