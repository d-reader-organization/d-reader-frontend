import { walletKeys, WALLET_QUERY_KEYS } from 'api/wallet/walletKeys'
import { useToaster } from 'providers/ToastProvider'
import { Wallet } from 'models/wallet'
import { useQuery } from 'react-query'
import http from 'api/http'

const { WALLET, GET } = WALLET_QUERY_KEYS

const fetchWallets = async (): Promise<Wallet[]> => {
	const response = await http.get<Wallet[]>(`${WALLET}/${GET}`)
	return response.data
}

export const useFetchWallets = () => {
	const toaster = useToaster()

	return useQuery({
		queryFn: () => fetchWallets(),
		queryKey: walletKeys.getMany,
		staleTime: 1000 * 60 * 60 * 1, // stale for 1 hour
		onError: toaster.onQueryError,
	})
}
