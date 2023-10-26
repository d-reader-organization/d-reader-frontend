'use client'

// import dynamic from 'next/dynamic'

// const DynamicSidebar = dynamic(() => import('components/layout/Sidebar'), { ssr: false })

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
	return (
		<>
			{/* <DynamicSidebar /> */}
			{children}
		</>
	)
}
