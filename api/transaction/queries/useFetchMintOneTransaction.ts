import { transactionKeys, TRANSACTION_QUERY_KEYS } from 'api/transaction/transactionKeys'
import { useToaster } from 'providers/ToastProvider'
import { MintOneParams } from 'models/transaction/mintOne'
import { versionedTransactionFromBs64 } from 'utils/transactions'
import { VersionedTransaction } from '@solana/web3.js'
import { useQuery } from 'react-query'
import http from 'api/http'

const { TRANSACTION, MINT_ONE } = TRANSACTION_QUERY_KEYS

// TODO: update in dPublisher, and update other transactions as well
/** @deprecated */
const fetchMintOneTransaction = async (params: MintOneParams): Promise<VersionedTransaction[]> => {
	const response = await http.get<string[]>(`${TRANSACTION}/${MINT_ONE}`, { params })
	return response.data.map(versionedTransactionFromBs64)
}

export const useFetchMintOneTransaction = (params: MintOneParams) => {
	const toaster = useToaster()

	return useQuery({
		queryFn: () => fetchMintOneTransaction(params),
		queryKey: transactionKeys.mintOne(params),
		staleTime: 1000 * 60 * 10, // stale for 10 minutes
		enabled: !!params.candyMachineAddress && !!params.minterAddress && !!params.label,
		onError: toaster.onQueryError,
	})
}
