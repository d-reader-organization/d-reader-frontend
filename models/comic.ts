import { ComicStats } from './comicStats'
import { MyComicStats } from './myComicStats'
import { Creator } from './creator'
import { Genre } from './genre'

export interface Comic {
	id: number
	name: string
	slug: string
	isMatureAudience: boolean
	description: string
	flavorText: string
	isDeleted: boolean
	isCompleted: boolean
	isVerified: boolean
	isPublished: boolean
	isPopular: boolean
	cover: string
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
	stats?: ComicStats
	myStats?: MyComicStats
	genres?: Array<Pick<Genre, 'name' | 'slug' | 'color'>>
	creator?: Pick<Creator, 'name' | 'slug' | 'isVerified' | 'avatar'>
}
