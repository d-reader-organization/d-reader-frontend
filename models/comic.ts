import { ComicStats } from './comicStats'
import { ComicMyStats } from './comicMyStats'
import { Creator } from './creator'
import { Genre } from './genre'
import { AudienceType } from 'enums/audienceType'

export interface Comic {
	name: string
	slug: string
	description: string
	flavorText: string
	audienceType: AudienceType
	isCompleted: boolean
	isDeleted: boolean
	isVerified: boolean
	isPublished: boolean
	isPopular: boolean
	cover: string
	banner: string
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
	myStats?: ComicMyStats
	genres?: Array<Pick<Genre, 'name' | 'slug' | 'color' | 'icon'>>
	creator?: Pick<Creator, 'name' | 'slug' | 'isVerified' | 'avatar'>
}
