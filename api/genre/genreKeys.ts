import { Pagination } from 'models/pagination'

export const GENRE_QUERY_KEYS = Object.freeze({
	GENRE: 'genre',
	GET: 'get',
})

export const genreKeys = Object.freeze({
	genre: [GENRE_QUERY_KEYS.GENRE],
	getGenres: (pagination: Pagination) => [
		GENRE_QUERY_KEYS.GENRE,
		GENRE_QUERY_KEYS.GET,
		pagination.skip,
		pagination.take,
	],
})
