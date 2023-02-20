export const GENRE_QUERY_KEYS = Object.freeze({
	GENRE: 'genre',
	GET: 'get',
})

export const genreKeys = Object.freeze({
	genre: [GENRE_QUERY_KEYS.GENRE],
	getGenres: [GENRE_QUERY_KEYS.GENRE, GENRE_QUERY_KEYS.GET],
})
