import { genreKeys, GENRE_QUERY_KEYS } from 'api/genre'
import { useToaster } from 'providers/ToastProvider'
import { useAuth } from '@open-sauce/solomon'
import { Pagination } from 'models/pagination'
import { useQuery } from 'react-query'
import { Genre } from 'models/genre'
import http from 'api/http'

const { GENRE, GET } = GENRE_QUERY_KEYS

const fetchGenres = async (pagination: Pagination): Promise<Genre[]> => {
	const response = await http.get<Genre[]>(`${GENRE}/${GET}`, {
		params: {
			skip: pagination.skip,
			take: pagination.take,
		},
	})
	return response.data
}

export const useFetchGenres = (pagination: Pagination) => {
	const { isAuthenticated } = useAuth()
	const toaster = useToaster()

	return useQuery([...genreKeys.getGenres(pagination)], () => fetchGenres(pagination), {
		staleTime: 1000 * 60 * 60 * 1, // Stale for 1 hour
		enabled: isAuthenticated,
		onError: toaster.onQueryError,
		retry: 1,
	})
}
