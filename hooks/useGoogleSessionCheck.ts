import { useLoginGoogleUser } from '@/api/auth'
import { RoutePath } from '@/enums/routePath'
import { useUserAuth } from '@/providers/UserAuthProvider'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

export const useGoogleSessionCheck = () => {
	const { push } = useRouter()
	const { data: session } = useSession()
	const { mutateAsync: loginWithGoogle } = useLoginGoogleUser()
	const { isAuthenticated } = useUserAuth()
	const searchParams = useSearchParams()

	useEffect(() => {
		if (session?.accessToken && !isAuthenticated) {
			loginWithGoogle().then((value) => {
				const shouldRegister = typeof value === 'boolean'
				const queryParams = searchParams.size ? searchParams.toString() : ''
				const redirectTo = searchParams.get('redirectTo')
				push(
					shouldRegister
						? `${RoutePath.Register}?${queryParams}&sso=google`
						: redirectTo ?? `${RoutePath.Home}?${queryParams}`
				)
			})
		}
	}, [session?.accessToken, push, isAuthenticated, loginWithGoogle, searchParams])
}
