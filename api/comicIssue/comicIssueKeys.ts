import { FetchComicIssuesParams } from './queries'

export const COMIC_ISSUE_QUERY_KEYS = Object.freeze({
	COMIC_ISSUE: 'comic-issue',
	GET: 'get',
})

export const comicKeys = Object.freeze({
	comic: [COMIC_ISSUE_QUERY_KEYS.COMIC_ISSUE],
	getComicIssues: (params: FetchComicIssuesParams) => [
		COMIC_ISSUE_QUERY_KEYS.COMIC_ISSUE,
		COMIC_ISSUE_QUERY_KEYS.GET,
		params.comicSlug,
		params.creatorSlug,
		params.genreSlugs,
		params.titleSubstring,
		params.skip,
		params.take,
	],
	getComicIssue: (id: number) => [COMIC_ISSUE_QUERY_KEYS.COMIC_ISSUE, COMIC_ISSUE_QUERY_KEYS.GET, `${id}`],
})
