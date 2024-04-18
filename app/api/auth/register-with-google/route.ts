import { getServerSession } from 'next-auth'
import { authOptions } from '../[...nextauth]/route'
import { Authorization } from '@/models/auth'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
	const session = await getServerSession(authOptions)

	if (!session || !session.accessToken) {
		return NextResponse.json({
			message: 'Unauthorized',
			status: 401,
		})
	}
	const { name } = await req.json()
	const response = await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/auth/user/register-with-google`, {
		method: 'POST',
		headers: {
			authorization: `Google ${session.accessToken}`,
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			name,
		}),
	})

	const data = (await response.json()) as Authorization
	return NextResponse.json(data)
}
