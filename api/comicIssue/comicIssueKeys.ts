export const COMIC_ISSUE_QUERY_KEYS = Object.freeze({
	COMIC_ISSUE: 'comic-issue',
	GET: 'get',
})

export const comicKeys = Object.freeze({
	comic: [COMIC_ISSUE_QUERY_KEYS.COMIC_ISSUE],
	getComicIssues: () => [COMIC_ISSUE_QUERY_KEYS.COMIC_ISSUE, COMIC_ISSUE_QUERY_KEYS.GET],
	getComicIssue: (id: number) => [COMIC_ISSUE_QUERY_KEYS.COMIC_ISSUE, COMIC_ISSUE_QUERY_KEYS.GET, `${id}`],
})
