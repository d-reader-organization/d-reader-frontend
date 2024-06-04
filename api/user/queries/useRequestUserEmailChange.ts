import { USER_QUERY_KEYS } from 'api/user/userKeys'
import { useToaster } from 'providers/ToastProvider'
import { useMutation } from 'react-query'
import http from 'api/http'
import { ReuqestEmailChangeParams } from '@/models/user/requestEmailChangeParams'

const { USER, REQUEST_EMAIL_CHANGE } = USER_QUERY_KEYS

const requestUserEmailChange = async (data: ReuqestEmailChangeParams): Promise<void> => {
	const response = await http.patch<void>(`${USER}/${REQUEST_EMAIL_CHANGE}`, data)
	return response.data
}

export const useRequestUserEmailChange = () => {
	const toaster = useToaster()

	return useMutation({
		mutationFn: (data: ReuqestEmailChangeParams) => requestUserEmailChange(data),
		onSuccess: () => {
			toaster.add('Verification mail sent to your new email address. Check your inbox!', 'success')
		},
		onError: toaster.onQueryError,
	})
}
