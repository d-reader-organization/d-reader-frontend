import { useLoginGoogleUser } from '@/api/auth'
import { RoutePath } from '@/enums/routePath'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export const useGoogleSessionCheck = () => {
	const { push } = useRouter()
	const { data: session } = useSession()
	const { mutateAsync: loginWithGoogle } = useLoginGoogleUser()

	useEffect(() => {
		if (session?.accessToken) {
			loginWithGoogle().then((value) => {
				const shouldRegister = typeof value === 'boolean'
				push(shouldRegister ? `${RoutePath.Register}?sso=google` : RoutePath.Home)
			})
		}
	}, [session?.accessToken, push])
}
