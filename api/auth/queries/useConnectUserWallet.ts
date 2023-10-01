import { AUTH_QUERY_KEYS } from 'api/auth/authKeys'
import { useToaster } from 'providers/ToastProvider'
import { useMutation, useQueryClient } from 'react-query'
import { USER_QUERY_KEYS } from '@/api/user/userKeys'
import http from 'api/http'

const { AUTH, WALLET, CONNECT } = AUTH_QUERY_KEYS

type ConnectRequest = { address: string; encoding: string }

const connectUserWallet = async (address: string, encoding: string): Promise<void> => {
	const response = await http.patch<void>(`${AUTH}/${WALLET}/${CONNECT}/${address}/${encoding}`)
	return response.data
}

export const useConnectUserWallet = () => {
	const toaster = useToaster()
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ address, encoding }: ConnectRequest) => connectUserWallet(address, encoding),
		onSuccess: () => {
			toaster.add('Wallet connected!', 'success')
			// queryClient.invalidateQueries(userKeys.getWallets(me?.id || 0))
			queryClient.invalidateQueries({
				predicate: (query) => {
					return (
						query.queryKey[0] === USER_QUERY_KEYS.USER &&
						query.queryKey[1] === USER_QUERY_KEYS.GET &&
						query.queryKey[3] === USER_QUERY_KEYS.WALLETS
					)
				},
			})
		},
		onError: toaster.onQueryError,
	})
}
