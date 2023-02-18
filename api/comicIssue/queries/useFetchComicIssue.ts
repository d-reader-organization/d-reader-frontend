import http from 'api/http'
import { comicKeys, COMIC_ISSUE_QUERY_KEYS } from 'api/comicIssue'
import { useAuth } from '@open-sauce/solomon'
import { useQuery } from 'react-query'
import { ComicIssue } from 'models/comicIssue'
import { useToaster } from 'providers/ToastProvider'

const { COMIC_ISSUE, GET } = COMIC_ISSUE_QUERY_KEYS

const fetchComicIssue = async (id: number): Promise<ComicIssue> => {
	const response = await http.get<ComicIssue>(`${COMIC_ISSUE}/${GET}/${id}`)
	return response.data
}

export const useFetchComicIssue = (id: number | undefined) => {
	const { isAuthenticated } = useAuth()
	const toaster = useToaster()

	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	return useQuery(comicKeys.getComicIssue(id!), () => fetchComicIssue(id!), {
		staleTime: 1000 * 60 * 60 * 1, // Stale for 1 hour
		enabled: isAuthenticated && id !== undefined && id !== null,
		onError: toaster.onQueryError,
		retry: 1,
	})
}
