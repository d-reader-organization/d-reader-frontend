import { Authorization } from '@/models/auth'
import NextAuth, { AuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

declare module 'next-auth' {
	/**
	 * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
	 */
	interface Session {
		authTokens?: Authorization
		accessToken?: string
	}
}

declare module 'next-auth/jwt' {
	interface JWT {
		accessToken?: string
	}
}
export const authOptions = {
	providers: [
		GoogleProvider({
			clientId: process.env.GOOGLE_AUTH_CLIENT_ID ?? '',
			clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET ?? '',
			authorization: {
				params: {
					prompt: 'consent',
					access_type: 'offline',
					response_type: 'code',
				},
			},
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
			session.accessToken = token.accessToken

			return session
		},
	},
} satisfies AuthOptions

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
