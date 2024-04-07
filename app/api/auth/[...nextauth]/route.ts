import { Authorization } from '@/models/auth'
import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

declare module 'next-auth' {
	/**
	 * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
	 */
	interface Session {
		authTokens?: Authorization
	}
}

declare module 'next-auth/jwt' {
	interface JWT {
		accessToken?: string
	}
}

const handler = NextAuth({
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_AUTH_CLIENT_ID ?? '',
			clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET ?? '',
		}),
	],
	session: { strategy: 'jwt' },
	callbacks: {
		jwt: async ({ account, token }) => {
			if (account) {
				token.accessToken = account.access_token
			}
			return token
		},
		session: async ({ session, token }) => {
			if (!token.accessToken) {
				return session
			}
			const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/auth/user/google-login`, {
				method: 'PATCH',
				headers: {
					Authorization: `Google ${token.accessToken}`,
				},
			})

			return response.status === 200 ? { ...session, authTokens: await response.json() } : session
		},
	},
})

export { handler as GET, handler as POST }
