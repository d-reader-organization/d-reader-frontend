import { AUTH_QUERY_KEYS } from 'api/auth/authKeys'
import { useToaster } from 'providers/ToastProvider'
import { useUserAuth } from 'providers/UserAuthProvider'
import { Authorization } from 'models/auth'
import { LoginData } from 'models/auth/login'
import { useMutation } from 'react-query'
import http from 'api/http'

const { AUTH, USER, LOGIN } = AUTH_QUERY_KEYS

const login = async (request: LoginData): Promise<Authorization> => {
	const response = await http.patch<Authorization>(`${AUTH}/${USER}/${LOGIN}`, request)
	return response.data
}

export const useLoginUser = () => {
	const { addAuthorization } = useUserAuth()
	const toaster = useToaster()

	return useMutation({
		mutationFn: (request: LoginData) => login(request),
		onSuccess: (data) => {
			const user = addAuthorization(data)
			toaster.add(`Welcome back ${user.name}! 🎉`, 'success')
		},
		onError: toaster.onQueryError,
	})
}
