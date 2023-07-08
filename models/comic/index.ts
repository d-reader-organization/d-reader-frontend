import { ComicStats } from './comicStats'
import { ComicMyStats } from './comicMyStats'
import { Creator } from '../creator'
import { Genre } from '../genre'
import { AudienceType } from 'enums/audienceType'

export interface Comic {
	title: string
	slug: string
	audienceType: AudienceType
	isDeleted: boolean
	isCompleted: boolean
	isVerified: boolean
	isPublished: boolean
	isPopular: boolean
	cover: string
	banner: string
	pfp: string
	logo: string
	description: string
	flavorText: string
	website: string
	twitter: string
	discord: string
	telegram: string
	instagram: string
	tikTok: string
	youTube: string
	stats?: ComicStats
	myStats?: ComicMyStats
	genres?: Array<Pick<Genre, 'name' | 'slug' | 'color' | 'icon'>>
	creator?: Pick<Creator, 'name' | 'slug' | 'isVerified' | 'avatar'>
}
