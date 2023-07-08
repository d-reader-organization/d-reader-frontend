export interface ComicIssueMyStats {
	rating: number | null
	isFavourite: boolean
	viewedAt: Date | null
	readAt: Date | null
	canRead?: boolean
}
