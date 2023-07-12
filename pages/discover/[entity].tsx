import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import { Box, Button, Container, Hidden, Tab, Tabs } from '@mui/material'
import ComicIssueDiscoverList from 'components/discover/ComicIssueDiscoverList'
import CreatorDiscoverList from 'components/discover/CreatorDiscoverList'
import ComicDiscoverList from 'components/discover/ComicDiscoverList'
import GenreButton from 'components/buttons/GenreButton'
import { useAuth } from '@open-sauce/solomon'
import { useFetchGenres } from 'api/genre'
import { useQueue, useToggle } from 'hooks'
import { useRouter } from 'next/router'
import { RoutePath } from 'enums/routePath'
import clsx from 'clsx'
import { SortOrder } from 'enums/sortOrder'

const tabs = [
	{ path: RoutePath.DiscoverComics, index: 0 },
	{ path: RoutePath.DiscoverComicIssues, index: 1 },
	{ path: RoutePath.DiscoverCreators, index: 2 },
]

const findPath = (index: number) => tabs.find((tab) => tab.index === index)?.path || ''
const findIndex = (path: string) => tabs.find((tab) => tab.path === path)?.index || 0

const DiscoverComicIssues: NextPage = () => {
	const router = useRouter()
	const [activeTab, setActiveTab] = useState(findIndex(router.asPath))
	const genresQueue = useQueue<string>({ size: 1 }) // max 1 selected genre
	const [searchString, setSearchString] = useState('')
	const [filterDrawer, toggleFilterDrawer] = useToggle()
	const [isAscending, toggleSortOrder] = useToggle()
	const { data: genres = [] } = useFetchGenres()
	const { isAuthenticated } = useAuth()

	const sortOrder = isAscending ? SortOrder.ASC : SortOrder.DESC
	const comicsTab = router.asPath === RoutePath.DiscoverComics
	const comicIssuesTab = router.asPath === RoutePath.DiscoverComicIssues
	const creatorsTab = router.asPath === RoutePath.DiscoverCreators

	useEffect(() => {
		// route to /discover/comics if page is not found
		const pageFound = tabs.find((tab) => tab.path === router.asPath)
		if (!pageFound) {
			router.replace(RoutePath.DiscoverComics, undefined, { shallow: true })
		}
	}, [router])

	const clearFilters = () => {
		setSearchString('')
		genresQueue.clear()
	}

	const handleTabChange = async (_: React.SyntheticEvent, newValue: number) => {
		setActiveTab(newValue)
		router.replace(findPath(newValue), undefined, { shallow: true })
	}

	if (!isAuthenticated) {
		return (
			<Box py={14} px={4}>
				Please connect your wallet
			</Box>
		)
	}

	return (
		<>
			<div className='header-image' />
			<Container className='discover' maxWidth='xl'>
				<Tabs
					indicatorColor='secondary'
					textColor='secondary'
					value={activeTab}
					onChange={handleTabChange}
					aria-label=''
				>
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

				<Box className='search-box'>
					<Button variant='contained' className='search-button' onClick={toggleFilterDrawer}>
						⬅️<Hidden smDown> Filters</Hidden>
					</Button>
					<Button variant='contained' className='search-button' onClick={clearFilters}>
						Clear
					</Button>
					<input
						value={searchString}
						type='text'
						name='search'
						placeholder='Search comics, episodes, games, and creators'
						onChange={(e) => {
							setSearchString(e.target.value)
						}}
						className='search-input'
					/>
					<Button variant='contained' className='search-button' onClick={toggleSortOrder}>
						{isAscending ? '👆' : '👇'}
					</Button>
				</Box>

				<Box className='genre-button-list' pt={1}>
					{genres.map((genre) => (
						<GenreButton
							key={genre.slug}
							genre={genre}
							active={genresQueue.contains(genre.slug)}
							onClick={() => {
								genresQueue.add(genre.slug)
							}}
						/>
					))}
				</Box>

				<Box hidden={!comicsTab} className='discover-content'>
					<ComicDiscoverList
						genreSlugs={genresQueue.items}
						titleSubstring={searchString}
						sortOrder={sortOrder}
						enabled={comicsTab}
					/>
				</Box>
				<Box hidden={!comicIssuesTab} className='discover-content'>
					<ComicIssueDiscoverList
						genreSlugs={genresQueue.items}
						titleSubstring={searchString}
						sortOrder={sortOrder}
						enabled={comicIssuesTab}
					/>
				</Box>
				<Box hidden={!creatorsTab} className='discover-content'>
					<CreatorDiscoverList
						genreSlugs={genresQueue.items}
						nameSubstring={searchString}
						sortOrder={sortOrder}
						enabled={creatorsTab}
					/>
				</Box>
			</Container>
		</>
	)
}

export default DiscoverComicIssues
