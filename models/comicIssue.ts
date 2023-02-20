import { Comic } from './comic'
import { ComicIssueMyStats } from './comicIssueMyStats'
import { ComicIssueStats } from './comicIssueStats'
import { Creator } from './creator'

export interface ComicIssue {
	id: number
	number: number
	suppy: number
	discountMintPrice: number
	mintPrice: number
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
	stats?: ComicIssueStats
	myStats?: ComicIssueMyStats
}
