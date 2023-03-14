import { Pagination } from 'models/pagination'

export const COMIC_QUERY_KEYS = Object.freeze({
	COMIC: 'comic',
	GET: 'get',
})

export const comicKeys = Object.freeze({
	comic: [COMIC_QUERY_KEYS.COMIC],
	getComics: (pagination: Pagination) => [
		COMIC_QUERY_KEYS.COMIC,
		COMIC_QUERY_KEYS.GET,
		pagination.skip,
		pagination.take,
	],
	getComic: (slug: string) => [COMIC_QUERY_KEYS.COMIC, COMIC_QUERY_KEYS.GET, slug],
})
