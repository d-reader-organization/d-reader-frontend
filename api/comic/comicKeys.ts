import { ComicParams } from 'models/comic/comicParams'

export const COMIC_QUERY_KEYS = Object.freeze({
	COMIC: 'comic',
	GET: 'get',
})

export const comicKeys = Object.freeze({
	comic: [COMIC_QUERY_KEYS.COMIC],
	getComics: (params: ComicParams) => [
		COMIC_QUERY_KEYS.COMIC,
		COMIC_QUERY_KEYS.GET,
		params.titleSubstring,
		params.creatorSlug,
		params.genreSlugs,
		params.filterTag,
		params.sortOrder,
		params.sortTag,
		params.skip,
		params.take,
	],
	getComic: (slug: string) => [COMIC_QUERY_KEYS.COMIC, COMIC_QUERY_KEYS.GET, slug],
})
