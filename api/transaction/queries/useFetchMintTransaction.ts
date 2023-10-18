import { transactionKeys, TRANSACTION_QUERY_KEYS } from 'api/transaction/transactionKeys'
import { useToaster } from 'providers/ToastProvider'
import { MintParams } from 'models/transaction/mint'
import { txFromBs64 } from 'utils/transactions'
import { Transaction } from '@solana/web3.js'
import { useQuery } from 'react-query'
import http from 'api/http'

const { TRANSACTION, MINT } = TRANSACTION_QUERY_KEYS

const fetchMintTransaction = async (params: MintParams): Promise<Transaction[]> => {
	const response = await http.get<string[]>(`${TRANSACTION}/${MINT}`, { params })
	return response.data.map(txFromBs64)
}

export const useFetchMintTransaction = (params: MintParams) => {
	const toaster = useToaster()

	return useQuery({
		queryFn: () => fetchMintTransaction(params),
		queryKey: transactionKeys.mint(params),
		staleTime: 1000 * 60 * 10, // stale for 10 minutes
		onError: toaster.onQueryError,
	})
}
