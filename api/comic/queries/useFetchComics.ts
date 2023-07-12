import { useMemo } from 'react'
import { comicKeys, COMIC_QUERY_KEYS } from 'api/comic'
import { ComicParams } from 'models/comic/comicParams'
import { useToaster } from 'providers/ToastProvider'
import { useAuth } from '@open-sauce/solomon'
import { useInfiniteQuery } from 'react-query'
import { Comic } from 'models/comic'
import http from 'api/http'

const { COMIC, GET } = COMIC_QUERY_KEYS

const fetchComics = async (params: ComicParams): Promise<Comic[]> => {
	const response = await http.get<Comic[]>(`${COMIC}/${GET}`, { params })
	return response.data
}

export const useFetchComics = (params: ComicParams, enabled = true) => {
	const { isAuthenticated } = useAuth()
	const toaster = useToaster()

	const infiniteQuery = useInfiniteQuery({
		queryKey: [...comicKeys.getComics(params)],
		queryFn: ({ pageParam = 0 }) => fetchComics({ ...params, skip: pageParam * params.take }),
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
