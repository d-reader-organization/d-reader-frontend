import http from 'api/http'
import { useAuth } from '@open-sauce/solomon'
import { playgroundKeys, PLAYGROUND_QUERY_KEYS } from 'api/playground'
import { useEffect } from 'react'
import { useQuery } from 'react-query'
import { useToaster } from 'providers/ToastProvider'

const { PLAYGROUND, TRANSACTION, CONSTRUCT, CREATE_NFT } = PLAYGROUND_QUERY_KEYS

const fetchMintTransaction = async (): Promise<string> => {
	const response = await http.get<string>(`${PLAYGROUND}/${TRANSACTION}/${CONSTRUCT}/${CREATE_NFT}`)
	return response.data
}

export const useFetchMintTransaction = () => {
	const { isAuthenticated } = useAuth()
	const toaster = useToaster()

	const fetchMintTransactionQuery = useQuery(playgroundKeys.getMintTransaction, fetchMintTransaction, {
		staleTime: 1000 * 60 * 1, // Stale for one minute
		enabled: isAuthenticated,
		onError: toaster.onQueryError,
	})

	const { refetch } = fetchMintTransactionQuery

	useEffect(() => {
		if (isAuthenticated) refetch()
	}, [isAuthenticated, refetch])

	return fetchMintTransactionQuery
}
