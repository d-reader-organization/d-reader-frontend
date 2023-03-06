import { useEffect } from 'react'
import { useQuery } from 'react-query'
import { comicKeys, COMIC_ISSUE_QUERY_KEYS } from 'api/comicIssue'
import { useAuth } from '@open-sauce/solomon'
import { ComicIssue } from 'models/comicIssue'
import { useToaster } from 'providers/ToastProvider'
import { Pagination } from 'models/pagination'
import http from 'api/http'

const { COMIC_ISSUE, GET } = COMIC_ISSUE_QUERY_KEYS

interface Params extends Pagination {
	genreSlugs?: string[]
	creatorSlug?: string
	comicSlug?: string
	titleSubstring?: string
}

const fetchComicIssues = async (params: Params): Promise<ComicIssue[]> => {
	const response = await http.get<ComicIssue[]>(`${COMIC_ISSUE}/${GET}`, { params })
	return response.data
}

export const useFetchComicIssues = (params: Params) => {
	const { isAuthenticated } = useAuth()
	const toaster = useToaster()

	const fetchComicIssuesQuery = useQuery(comicKeys.getComicIssues(), () => fetchComicIssues(params), {
		staleTime: 1000 * 60 * 60 * 1, // Stale for 1 hour
		enabled: isAuthenticated,
		onError: toaster.onQueryError,
		retry: 1,
	})

	const { refetch } = fetchComicIssuesQuery

	useEffect(() => {
		if (isAuthenticated) refetch()
		// TODO: check if we can simply use params
	}, [refetch, params.skip, params.take, isAuthenticated])

	return fetchComicIssuesQuery
}
