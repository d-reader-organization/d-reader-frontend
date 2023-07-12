import { useState } from 'react'
import { Container, ContainerProps, Tab, Tabs } from '@mui/material'
import { RoutePath } from 'enums/routePath'
import { useRouter } from 'next/router'
import clsx from 'clsx'

const tabs = [
	{ path: RoutePath.DiscoverComics, index: 0 },
	{ path: RoutePath.DiscoverComicIssues, index: 1 },
	{ path: RoutePath.DiscoverCreators, index: 2 },
]

const findPath = (index: number) => tabs.find((tab) => tab.index === index)?.path || ''
const findIndex = (path: string) => tabs.find((tab) => tab.path === path)?.index || 0

const DiscoverLayout: React.FC<ContainerProps> = ({ children }) => {
	const router = useRouter()
	const [activeTab, setActiveTab] = useState(findIndex(router.asPath))

	const comicsTab = router.asPath === RoutePath.DiscoverComics
	const comicIssuesTab = router.asPath === RoutePath.DiscoverComicIssues
	const creatorsTab = router.asPath === RoutePath.DiscoverCreators

	const handleTabChange = async (_: React.SyntheticEvent, newValue: number) => {
		setActiveTab(newValue)
		router.replace(findPath(newValue), undefined, { shallow: true })
	}

	return (
		<Container className='discover' maxWidth='xl'>
			<Tabs textColor='secondary' value={activeTab} onChange={handleTabChange} aria-label='basic tabs example'>
				<Tab
					label='Comics'
					disableRipple
					id={RoutePath.DiscoverComics}
					className={clsx('tab-button', !comicsTab && 'tab-button--inactive')}
				/>
				<Tab
					label='Issues'
					disableRipple
					id={RoutePath.DiscoverComicIssues}
					className={clsx('tab-button', !comicIssuesTab && 'tab-button--inactive')}
				/>
				<Tab
					label='Creators'
					disableRipple
					id={RoutePath.DiscoverCreators}
					className={clsx('tab-button', !creatorsTab && 'tab-button--inactive')}
				/>
			</Tabs>

			{children}
		</Container>
	)
}

export default DiscoverLayout
