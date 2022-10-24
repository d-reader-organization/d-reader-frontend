import { ComicPage } from './comicPage'

export interface ComicIssue {
	id: number
	number: number
	title: string
	slug: string
	description: string
	flavorText: string
	cover: string
	soundtrack: string
	magicEden: string
	openSea: string
	releaseDate: string
	isPublished: boolean
	isDeleted: boolean
	isVerified: boolean
	hashlist: string[]
	pages: ComicPage[]
}
