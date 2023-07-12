import { useMemo } from 'react'
import { useInfiniteQuery } from 'react-query'
import { creatorKeys, CREATOR_QUERY_KEYS } from 'api/creator'
import { useToaster } from 'providers/ToastProvider'
import { CreatorParams } from 'models/creator/creatorParams'
import { Creator } from 'models/creator'
import { useAuth } from '@open-sauce/solomon'
import http from 'api/http'

const { CREATOR, GET } = CREATOR_QUERY_KEYS

const fetchCreators = async (params: CreatorParams): Promise<Creator[]> => {
	const response = await http.get<Creator[]>(`${CREATOR}/${GET}`, { params })
	return response.data
}

export const useFetchCreators = (params: CreatorParams, enabled = true) => {
	const { isAuthenticated } = useAuth()
	const toaster = useToaster()

	const infiniteQuery = useInfiniteQuery({
		queryKey: [...creatorKeys.getCreators(params)],
		queryFn: ({ pageParam = 0 }) => fetchCreators({ ...params, skip: pageParam * params.take }),
		getNextPageParam: (lastPage, allPages) => {
			if (lastPage.length >= params.take) return allPages.length
		},
		staleTime: 1000 * 60 * 60 * 1, // Stale for 1 hour
		enabled: enabled && !!isAuthenticated,
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
