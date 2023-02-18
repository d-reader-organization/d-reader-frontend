import { useEffect } from 'react'
import { useQuery } from 'react-query'
import { comicKeys, COMIC_ISSUE_QUERY_KEYS } from 'api/comicIssue'
import { useAuth } from '@open-sauce/solomon'
import { ComicIssue } from 'models/comicIssue'
import { useToaster } from 'providers/ToastProvider'
import { Pagination } from 'models/pagination'
import http from 'api/http'

const { COMIC_ISSUE, GET } = COMIC_ISSUE_QUERY_KEYS

const fetchComicIssues = async (pagination: Pagination): Promise<ComicIssue[]> => {
	const response = await http.get<ComicIssue[]>(`${COMIC_ISSUE}/${GET}`, {
		params: {
			skip: pagination.skip,
			take: pagination.take,
		},
	})
	return response.data
}

export const useFetchComicIssues = (pagination: Pagination) => {
	const { isAuthenticated } = useAuth()
	const toaster = useToaster()

	const fetchComicIssuesQuery = useQuery(comicKeys.getComicIssues(), () => fetchComicIssues(pagination), {
		staleTime: 1000 * 60 * 60 * 1, // Stale for 1 hour
		enabled: isAuthenticated,
		onError: toaster.onQueryError,
		retry: 1,
	})

	const { refetch } = fetchComicIssuesQuery

	useEffect(() => {
		if (isAuthenticated) refetch()
	}, [refetch, pagination.skip, pagination.take, isAuthenticated])

	return fetchComicIssuesQuery
}
