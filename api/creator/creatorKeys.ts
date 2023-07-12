import { CreatorParams } from 'models/creator/creatorParams'

export const CREATOR_QUERY_KEYS = Object.freeze({
	CREATOR: 'creator',
	GET: 'get',
})

export const creatorKeys = Object.freeze({
	creator: [CREATOR_QUERY_KEYS.CREATOR],
	getCreators: (params: CreatorParams) => [
		CREATOR_QUERY_KEYS.CREATOR,
		CREATOR_QUERY_KEYS.GET,
		params.nameSubstring,
		params.genreSlugs,
		params.filterTag,
		params.sortOrder,
		params.sortTag,
		params.skip,
		params.take,
	],
	getCreator: (slug: string) => [CREATOR_QUERY_KEYS.CREATOR, CREATOR_QUERY_KEYS.GET, slug],
})
