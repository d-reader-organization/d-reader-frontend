import { transactionKeys, TRANSACTION_QUERY_KEYS } from 'api/transaction/transactionKeys'
import { useToaster } from 'providers/ToastProvider'
import { UseComicIssueAssetParams } from '@/models/transaction/useComicIssueAsset'
import { decodeTransaction } from 'utils/transactions'
import { Transaction } from '@solana/web3.js'
import { useQuery } from 'react-query'
import http from 'api/http'

const { TRANSACTION, USE_COMIC_ISSUE_ASSET } = TRANSACTION_QUERY_KEYS

const fetchUseComicIssueNftTransaction = async (params: UseComicIssueAssetParams): Promise<Transaction> => {
	const response = await http.get<string>(`${TRANSACTION}/${USE_COMIC_ISSUE_ASSET}`, { params })
	return decodeTransaction(response.data, 'base64')
}

export const useFetchUseComicIssueNftTransaction = (params: UseComicIssueAssetParams, enabled = true) => {
	const toaster = useToaster()

	return useQuery({
		queryFn: () => fetchUseComicIssueNftTransaction(params),
		queryKey: transactionKeys.useComicIssueNft(params),
		staleTime: 1000 * 60 * 10, // stale for 10 minutes,
		enabled,
		onError: toaster.onQueryError,
	})
}
