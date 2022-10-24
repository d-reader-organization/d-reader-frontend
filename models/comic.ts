import { ComicIssue } from './comicIssue'

export interface Comic {
	id: number
	name: string
	slug: string
	description: string
	flavorText: string
	isDeleted: boolean
	isVerified: boolean
	isPublished: boolean
	thumbnail: string
	pfp: string
	logo: string
	website: string
	twitter: string
	discord: string
	telegram: string
	instagram: string
	medium: string
	tikTok: string
	youTube: string
	magicEden: string
	openSea: string
	issues: ComicIssue[]
}
