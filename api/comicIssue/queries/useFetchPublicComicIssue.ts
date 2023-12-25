import { comicIssueKeys, COMIC_ISSUE_QUERY_KEYS } from 'api/comicIssue/comicIssueKeys'
import { useToaster } from 'providers/ToastProvider'
import { ComicIssue } from 'models/comicIssue'
import { useQuery } from 'react-query'
import { isNil } from 'lodash'
import http from 'api/http'

const { COMIC_ISSUE, GET_PUBLIC } = COMIC_ISSUE_QUERY_KEYS

const fetchPublicComicIssue = async (slug: string): Promise<ComicIssue> => {
	console.log(`${COMIC_ISSUE}/${GET_PUBLIC}/${slug}`)
	const response = await http.get<ComicIssue>(`${COMIC_ISSUE}/${GET_PUBLIC}/${slug}`)
	return response.data
}

export const useFetchPublicComicIssue = (slug: string) => {
	const toaster = useToaster()
	return useQuery({
		queryFn: () => fetchPublicComicIssue(slug),
		queryKey: comicIssueKeys.getPublic(slug),
		staleTime: 1000 * 60 * 60 * 1, // stale for 1 hour
		enabled: !!slug,
		onError: toaster.onQueryError,
	})
}
