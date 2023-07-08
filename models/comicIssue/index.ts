import { Comic } from '../comic'
import { ComicIssueMyStats } from './comicIssueMyStats'
import { ComicIssueStats } from './comicIssueStats'
import { Creator } from '../creator'
import { Genre } from '../genre'
import { ComicIssueCollaborator } from './comicIssueCollaborator'
import { StatefulCover } from './statefulCover'

export interface ComicIssue {
	id: number
	number: number
	supply: number
	discountMintPrice: number
	mintPrice: number
	sellerFee: number
	title: string
	slug: string
	description: string
	flavorText: string
	cover: string
	signature: string
	releaseDate: string
	isFree: boolean
	isPublished: boolean
	isPopular: boolean
	isDeleted: boolean
	isVerified: boolean
	candyMachineAddress?: string
	creator?: Pick<Creator, 'name' | 'slug' | 'isVerified' | 'avatar'>
	comic?: Pick<Comic, 'title' | 'slug' | 'audienceType'>
	genres?: Array<Pick<Genre, 'name' | 'slug' | 'color' | 'icon'>>
	collaborators?: ComicIssueCollaborator[]
	statefulCovers?: StatefulCover[]
	statelessCovers?: StatefulCover[]
	stats?: ComicIssueStats
	myStats?: ComicIssueMyStats
}
