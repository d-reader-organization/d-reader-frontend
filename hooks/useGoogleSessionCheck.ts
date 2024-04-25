import { useLoginGoogleUser } from '@/api/auth'
import { RoutePath } from '@/enums/routePath'
import { useUserAuth } from '@/providers/UserAuthProvider'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export const useGoogleSessionCheck = () => {
	const { push } = useRouter()
	const { data: session } = useSession()
	const { mutateAsync: loginWithGoogle } = useLoginGoogleUser()
	const { isAuthenticated } = useUserAuth()

	useEffect(() => {
		if (session?.accessToken && !isAuthenticated) {
			loginWithGoogle().then((value) => {
				const shouldRegister = typeof value === 'boolean'
				push(shouldRegister ? `${RoutePath.Register}?sso=google` : RoutePath.Home)
			})
		}
	}, [session?.accessToken, push])
}
