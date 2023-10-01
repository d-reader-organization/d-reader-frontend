import { transactionKeys, TRANSACTION_QUERY_KEYS } from 'api/transaction/transactionKeys'
import { useToaster } from 'providers/ToastProvider'
import { PrivateBidParams } from 'models/transaction/privateBid'
import { decodeTransaction } from 'utils/transactions'
import { Transaction } from '@solana/web3.js'
import { useQuery } from 'react-query'
import http from 'api/http'

const { TRANSACTION, PRIVATE_BID } = TRANSACTION_QUERY_KEYS

const fetchPrivateBidTransaction = async (params: PrivateBidParams): Promise<Transaction> => {
	const response = await http.get<string>(`${TRANSACTION}/${PRIVATE_BID}`, { params })
	return decodeTransaction(response.data, 'base64')
}

export const useFetchPrivateBidTransaction = (params: PrivateBidParams) => {
	const toaster = useToaster()

	return useQuery({
		queryFn: () => fetchPrivateBidTransaction(params),
		queryKey: transactionKeys.privateBid(params),
		staleTime: 1000 * 60 * 10, // stale for 10 minutes
		onError: toaster.onQueryError,
	})
}
