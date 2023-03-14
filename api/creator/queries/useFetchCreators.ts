import http from 'api/http'
import { creatorKeys, CREATOR_QUERY_KEYS } from 'api/creator'
import { useAuth } from '@open-sauce/solomon'
import { useQuery } from 'react-query'
import { Creator } from 'models/creator'
import { Pagination } from 'models/pagination'
import { useToaster } from 'providers/ToastProvider'

const { CREATOR, GET } = CREATOR_QUERY_KEYS

const fetchCreators = async (pagination: Pagination): Promise<Creator[]> => {
	const response = await http.get<Creator[]>(`${CREATOR}/${GET}`, {
		params: {
			skip: pagination.skip,
			take: pagination.take,
		},
	})
	return response.data
}

export const useFetchCreators = (pagination: Pagination) => {
	const { isAuthenticated } = useAuth()
	const toaster = useToaster()

	return useQuery([...creatorKeys.getCreators(pagination)], () => fetchCreators(pagination), {
		staleTime: 1000 * 60 * 60 * 1, // Stale for 1 hour
		enabled: isAuthenticated,
		onError: toaster.onQueryError,
		retry: 1,
	})
}
