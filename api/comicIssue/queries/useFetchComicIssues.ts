import { useMemo } from 'react'
import { useInfiniteQuery } from 'react-query'
import { comicKeys, COMIC_ISSUE_QUERY_KEYS } from 'api/comicIssue'
import { useToaster } from 'providers/ToastProvider'
import { ComicIssue } from 'models/comicIssue'
import { useAuth } from '@open-sauce/solomon'
import http from 'api/http'
import { ComicIssueParams } from 'models/comicIssue/comicIssueParams'

const { COMIC_ISSUE, GET } = COMIC_ISSUE_QUERY_KEYS

const fetchComicIssues = async (params: ComicIssueParams): Promise<ComicIssue[]> => {
	const response = await http.get<ComicIssue[]>(`${COMIC_ISSUE}/${GET}`, { params })
	return response.data
}

export const useFetchComicIssues = (params: ComicIssueParams, enabled = true) => {
	const { isAuthenticated } = useAuth()
	const toaster = useToaster()

	const infiniteQuery = useInfiniteQuery({
		queryKey: [...comicKeys.getComicIssues(params)],
		queryFn: ({ pageParam = 0 }) => fetchComicIssues({ ...params, skip: pageParam * params.take }),
		getNextPageParam: (lastPage, allPages) => {
			if (lastPage.length >= params.take) return allPages.length
		},
		staleTime: 1000 * 60 * 60 * 1, // Stale for 1 hour
		enabled: enabled && isAuthenticated,
		onError: toaster.onQueryError,

		retry: 1,
	})

	const { data } = infiniteQuery
	const flatData = useMemo(() => {
		if (!data) return []
		return data.pages.flatMap((page) => page)
	}, [data])

	return { ...infiniteQuery, flatData }
}
