import { AUTH_QUERY_KEYS } from 'api/auth/authKeys'
import { useToaster } from 'providers/ToastProvider'
import { useMutation, useQueryClient } from 'react-query'
import { USER_QUERY_KEYS } from '@/api/user/userKeys'
import http from 'api/http'
import { COMIC_ISSUE_QUERY_KEYS } from '@/api/comicIssue'

const { AUTH, WALLET, DISCONNECT } = AUTH_QUERY_KEYS

const disconnectUserWallet = async (address: string): Promise<void> => {
	const response = await http.patch<void>(`${AUTH}/${WALLET}/${DISCONNECT}/${address}`)
	return response.data
}

export const useDisconnectUserWallet = () => {
	const toaster = useToaster()
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (address: string) => disconnectUserWallet(address),
		onSuccess: () => {
			toaster.add('Wallet disconnected!', 'success')
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
