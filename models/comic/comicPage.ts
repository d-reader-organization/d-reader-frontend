export interface ComicPage {
	id: number
	pageNumber: number
	isPreviewable: boolean
	image: string
}

export type CreateComicPageData = Pick<ComicPage, 'pageNumber' | 'isPreviewable' | 'image'>
