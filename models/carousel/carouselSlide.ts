import { CarouselLocation } from 'enums/carouselLocation'

export interface CarouselSlide {
	id: number
	image: string
	priority: number
	title?: string
	subtitle?: string
	isPublished: boolean
	isExpired: boolean
	location: CarouselLocation
	comicIssueId?: number
	comicSlug?: string
	creatorSlug?: string
	externalLink?: string
}
