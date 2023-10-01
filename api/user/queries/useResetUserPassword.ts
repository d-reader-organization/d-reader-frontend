import { USER_QUERY_KEYS } from 'api/user/userKeys'
import { useToaster } from 'providers/ToastProvider'
import { useMutation } from 'react-query'
import http from 'api/http'

const { USER, RESET_PASSWORD } = USER_QUERY_KEYS

const resetUserPassword = async (slug: string): Promise<void> => {
	const response = await http.patch<void>(`${USER}/${RESET_PASSWORD}/${slug}`)
	return response.data
}

export const useResetUserPassword = (slug: string) => {
	const toaster = useToaster()

	return useMutation({
		mutationFn: () => resetUserPassword(slug),
		onSuccess: () => {
			toaster.add('Password reset, check your email inbox!', 'success')
		},
		onError: toaster.onQueryError,
	})
}
