'use client'

import dynamic from 'next/dynamic'
import 'app/styles/app.scss'

// const DynamicSidebar = dynamic(() => import('components/layout/Sidebar'), { ssr: false })

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
	return (
		<>
			{/* <DynamicSidebar /> */}
			<div className='container'>{children}</div>
		</>
	)
}
