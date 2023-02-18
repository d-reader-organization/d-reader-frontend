import http from 'api/http'
import { creatorKeys, CREATOR_QUERY_KEYS } from 'api/creator'
import { useAuth } from '@open-sauce/solomon'
import { useQuery } from 'react-query'
import { Creator } from 'models/creator'
import { useToaster } from 'providers/ToastProvider'

const { CREATOR, GET } = CREATOR_QUERY_KEYS

const fetchCreator = async (slug: string): Promise<Creator> => {
	const response = await http.get<Creator>(`${CREATOR}/${GET}/${slug}`)
	return response.data
}

export const useFetchCreator = (slug: string) => {
	const { isAuthenticated } = useAuth()
	const toaster = useToaster()

	return useQuery(creatorKeys.getCreator(slug), () => fetchCreator(slug), {
		staleTime: 1000 * 60 * 60 * 1, // Stale for 1 hour
		enabled: isAuthenticated,
		onError: toaster.onQueryError,
		retry: 1,
	})
}
