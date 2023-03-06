import http from 'api/http'
import { comicKeys, COMIC_QUERY_KEYS } from 'api/comic'
import { useAuth } from '@open-sauce/solomon'
import { useQuery } from 'react-query'
import { Comic } from 'models/comic'
import { useToaster } from 'providers/ToastProvider'

const { COMIC, GET } = COMIC_QUERY_KEYS

const fetchComic = async (slug: string): Promise<Comic> => {
	const response = await http.get<Comic>(`${COMIC}/${GET}/${slug}`)
	return response.data
}

export const useFetchComic = (slug: string) => {
	const { isAuthenticated } = useAuth()
	const toaster = useToaster()

	return useQuery(comicKeys.getComic(slug), () => fetchComic(slug), {
		staleTime: 1000 * 60 * 60 * 1, // Stale for 1 hour
		enabled: isAuthenticated && !!slug,
		onError: toaster.onQueryError,
		retry: 1,
	})
}
