import http from 'api/http'
import { comicKeys, COMIC_QUERY_KEYS } from 'api/comic'
import { useAuth } from '@open-sauce/solomon'
import { useQuery } from 'react-query'
import { Comic } from 'models/comic'
import { useToaster } from 'providers/ToastProvider'
import { Pagination } from 'models/pagination'

const { COMIC, GET } = COMIC_QUERY_KEYS

const fetchComics = async (pagination: Pagination): Promise<Comic[]> => {
	const response = await http.get<Comic[]>(`${COMIC}/${GET}`, {
		params: {
			skip: pagination.skip,
			take: pagination.take,
		},
	})
	return response.data
}

export const useFetchComics = (pagination: Pagination) => {
	const { isAuthenticated } = useAuth()
	const toaster = useToaster()

	return useQuery([...comicKeys.getComics(pagination)], () => fetchComics(pagination), {
		staleTime: 1000 * 60 * 60 * 1, // Stale for 1 hour
		enabled: !!isAuthenticated,
		onError: toaster.onQueryError,
		retry: 1,
	})
}
