import { Comic } from './comic'
import { ComicPage } from './comicPage'
import { Creator } from './creator'

export interface ComicIssue {
	id: number
	number: number
	title: string
	slug: string
	description: string
	flavorText: string
	cover: string
	soundtrack: string
	releaseDate: string
	isPublished: boolean
	isPopular: boolean
	isDeleted: boolean
	isVerified: boolean
	creator?: Pick<Creator, 'name' | 'slug' | 'isVerified' | 'avatar'>
	comic?: Pick<Comic, 'name' | 'slug' | 'isMatureAudience'>
	pages?: ComicPage[]
	hashlist?: string[]
}
