import { AUTH_QUERY_KEYS } from 'api/auth/authKeys'
import { useToaster } from 'providers/ToastProvider'
import { useMutation } from 'react-query'
import http from 'api/http'

const { AUTH, WALLET, REQUEST_PASSWORD } = AUTH_QUERY_KEYS

const requestPassword = async (address: string): Promise<string> => {
	const response = await http.patch<string>(`${AUTH}/${WALLET}/${REQUEST_PASSWORD}/${address}`)
	return response.data
}

export const useRequestPassword = () => {
	const toaster = useToaster()

	return useMutation({
		mutationFn: (address: string) => requestPassword(address),
		onError: toaster.onQueryError,
	})
}
