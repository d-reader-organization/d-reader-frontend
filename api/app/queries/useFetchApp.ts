import http from 'api/http'
import { appKeys, APP_QUERY_KEYS } from 'api/app'
import { useQuery } from 'react-query'
import { useToaster } from 'providers/ToastProvider'

const { APP, HELLO } = APP_QUERY_KEYS

const fetchApp = async (): Promise<string> => {
	const response = await http.get<string>(`${APP}/${HELLO}`)
	return response.data
}

export const useFetchApp = () => {
	const toaster = useToaster()

	return useQuery(appKeys.app, fetchApp, {
		staleTime: 1000 * 60 * 60 * 24, // Stale for one day
		onError: toaster.onQueryError,
		retry: 1,
	})
}
