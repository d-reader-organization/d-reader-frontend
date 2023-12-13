'use client'

import { useState } from 'react'
import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Collapse from '@mui/material/Collapse'
import Grid from '@mui/material/Grid'
import Hidden from '@mui/material/Hidden'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import ComicIssueDiscoverList from 'components/comicIssue/ComicIssueDiscoverList'
import CreatorDiscoverList from 'components/creator/CreatorDiscoverList'
import AccordionList, { AccordionItem } from 'components/ui/AccordionList'
import ComicDiscoverList from 'components/comic/ComicDiscoverList'
import GenreButton from 'components/buttons/GenreButton'
import { useQueue, useToggle } from 'hooks'
import { RoutePath } from 'enums/routePath'
import { SortOrder } from 'enums/sortOrder'
import { useFetchGenres } from 'api/genre'
import clsx from 'clsx'
import Button from '@/components/Button'
import Navigation from '@/components/layout/Navigation'

type TabKey = 'comics' | 'comic-issues' | 'creators'

type TabType = {
	path:
		| (typeof RoutePath)['DiscoverComics']
		| (typeof RoutePath)['DiscoverComicIssues']
		| (typeof RoutePath)['DiscoverCreators']
	key: TabKey
	index: number
	label: string
}

const tabs: TabType[] = [
	{ path: RoutePath.DiscoverComics, key: 'comics', label: 'Comics', index: 0 },
	{ path: RoutePath.DiscoverComicIssues, key: 'comic-issues', label: 'Episodes', index: 1 },
	{ path: RoutePath.DiscoverCreators, key: 'creators', label: 'Creators', index: 2 },
]

const findPathByIndex = (index: number): TabType['path'] => {
	return tabs.find((tab) => tab.index === index)?.path || RoutePath.DiscoverComics
}
const findKeyByIndex = (index: number): TabType['key'] => {
	return tabs.find((tab) => tab.index === index)?.key || 'comics'
}
const findIndexByKey = (key: string): TabType['index'] => tabs.find((tab) => tab.key === key)?.index || 0

interface Params {
	entity: string
}

function DiscoverPage({ params }: { params: Params }) {
	const [activeTab, setActiveTab] = useState(findIndexByKey(params.entity))
	const [searchString, setSearchString] = useState('')
	const [filterDrawer, toggleFilterDrawer] = useToggle()
	const [isAscending, toggleSortOrder] = useToggle()
	const genresQueue = useQueue<string>({ size: 3 }) // max 3 selected genres
	const { data: genres = [] } = useFetchGenres()

	const sortOrder = isAscending ? SortOrder.ASC : SortOrder.DESC
	const comicsTab = findKeyByIndex(activeTab) === 'comics'
	const comicIssuesTab = findKeyByIndex(activeTab) === 'comic-issues'
	const creatorsTab = findKeyByIndex(activeTab) === 'creators'

	const clearFilters = () => {
		setSearchString('')
		genresQueue.clear()
	}

	const handleTabChange = async (_: React.SyntheticEvent, newValue: number) => {
		setActiveTab(newValue)
		// https://github.com/vercel/next.js/discussions/48320
		window.history.pushState({}, '', findPathByIndex(newValue))
	}

	const filterItems: AccordionItem[] = [
		{
			summary: 'Genres',
			details: (
				<Grid container spacing={1}>
					{genres.map((genre) => (
						<Grid item key={genre.slug} xs={4}>
							<GenreButton
								genre={genre}
								active={genresQueue.contains(genre.slug)}
								onClick={() => {
									genresQueue.add(genre.slug)
								}}
							/>
						</Grid>
					))}
				</Grid>
			),
		},
		{
			summary: 'Tags',
			details: <>----</>,
		},
		{
			summary: 'Sort By',
			details: <>----</>,
		},
	]

	return (
		<>
			<Navigation />
			<main className='discover-page'>
				<Container className='discover-page-container' maxWidth='xl'>
					<div className='header-image' />
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
							// href={findPathByIndex(0)}
							id={RoutePath.DiscoverComics}
							className={clsx('tab-button', !comicsTab && 'tab-button--inactive')}
						/>
						<Tab
							label='Issues'
							disableRipple
							// href={findPathByIndex(1)}
							id={RoutePath.DiscoverComicIssues}
							className={clsx('tab-button', !comicIssuesTab && 'tab-button--inactive')}
						/>
						<Tab
							label='Creators'
							disableRipple
							// href={findPathByIndex(2)}
							id={RoutePath.DiscoverCreators}
							className={clsx('tab-button', !creatorsTab && 'tab-button--inactive')}
						/>
					</Tabs>

					<Box className='search-box'>
						<Button backgroundColor='grey-300' className='search-button' onClick={toggleFilterDrawer}>
							{filterDrawer ? '➡️' : '⬅️'}
							<Hidden smDown> Filters</Hidden>
						</Button>
						<Button backgroundColor='grey-300' className='search-button' onClick={clearFilters}>
							Clear
						</Button>
						<input
							value={searchString}
							type='text'
							placeholder='Search comics, episodes, games, and creators'
							onChange={(e) => {
								setSearchString(e.target.value)
							}}
							className='search-input'
						/>
						<Button backgroundColor='grey-300' className='search-button' onClick={toggleSortOrder}>
							{isAscending ? '👆' : '👇'}
						</Button>
					</Box>

					<Box className='discover-body'>
						<Collapse
							className={clsx('filter-box-wrapper', filterDrawer && 'filter-box-wrapper--active')}
							orientation='horizontal'
							in={filterDrawer}
						>
							<Box className='filter-box'>
								<AccordionList items={filterItems} defaultOpened={[0]} />
							</Box>
						</Collapse>

						<Box hidden={!comicsTab} className='discover-content'>
							<ComicDiscoverList
								params={{
									genreSlugs: genresQueue.items,
									titleSubstring: searchString,
									sortOrder: sortOrder,
								}}
								enabled={comicsTab}
								narrow={filterDrawer}
							/>
						</Box>
						<Box hidden={!comicIssuesTab} className='discover-content'>
							<ComicIssueDiscoverList
								params={{
									genreSlugs: genresQueue.items,
									titleSubstring: searchString,
									sortOrder: sortOrder,
								}}
								enabled={comicIssuesTab}
								narrow={filterDrawer}
							/>
						</Box>
						<Box hidden={!creatorsTab} className='discover-content'>
							<CreatorDiscoverList
								params={{
									genreSlugs: genresQueue.items,
									nameSubstring: searchString,
									sortOrder: sortOrder,
								}}
								enabled={creatorsTab}
								narrow={filterDrawer}
							/>
						</Box>
					</Box>
				</Container>
			</main>
		</>
	)
}

export default DiscoverPage
