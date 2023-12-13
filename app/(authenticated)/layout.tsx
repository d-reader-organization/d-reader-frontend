'use client'

import { useFetchMe } from '@/api/user/queries/useFetchMe'
import JoinTheBeta from '@/components/JoinTheBeta'

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
	const { data: me } = useFetchMe()

	if (me && !me.hasBetaAccess) return <JoinTheBeta />
	return children
}
