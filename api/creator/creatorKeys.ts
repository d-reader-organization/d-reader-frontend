export const CREATOR_QUERY_KEYS = Object.freeze({
	CREATOR: 'creator',
	GET: 'get',
})

export const creatorKeys = Object.freeze({
	creator: [CREATOR_QUERY_KEYS.CREATOR],
	getCreators: () => [CREATOR_QUERY_KEYS.CREATOR, CREATOR_QUERY_KEYS.GET],
	getCreator: (slug: string) => [CREATOR_QUERY_KEYS.CREATOR, CREATOR_QUERY_KEYS.GET, slug],
})
