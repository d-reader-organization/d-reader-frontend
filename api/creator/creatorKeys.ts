import { Pagination } from 'models/pagination'

export const CREATOR_QUERY_KEYS = Object.freeze({
	CREATOR: 'creator',
	GET: 'get',
})

export const creatorKeys = Object.freeze({
	creator: [CREATOR_QUERY_KEYS.CREATOR],
	getCreators: (pagination: Pagination) => [
		CREATOR_QUERY_KEYS.CREATOR,
		CREATOR_QUERY_KEYS.GET,
		pagination.skip,
		pagination.take,
	],
	getCreator: (slug: string) => [CREATOR_QUERY_KEYS.CREATOR, CREATOR_QUERY_KEYS.GET, slug],
})
