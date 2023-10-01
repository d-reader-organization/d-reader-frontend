'use client'

import { useState } from 'react'
import { Box, Collapse, Container, Grid, Hidden, Tab, Tabs } from '@mui/material'
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
const findIndexByPath = (path: string): TabType['index'] => tabs.find((tab) => tab.path === path)?.index || 0

interface Params {
	entity: string
}

function DiscoverPage({ params }: { params: Params }) {
	const [activeTab, setActiveTab] = useState(findIndexByPath(params.entity))
	const [searchString, setSearchString] = useState('')
	const [filterDrawer, toggleFilterDrawer] = useToggle()
	const [isAscending, toggleSortOrder] = useToggle()
	const genresQueue = useQueue<string>({ size: 3 }) // max 3 selected genres
	const { data: genres = [] } = useFetchGenres()

	const sortOrder = isAscending ? SortOrder.ASC : SortOrder.DESC
	const comicsTab = params.entity === 'comics'
	const comicIssuesTab = params.entity === 'comic-issues'
	const creatorsTab = params.entity === 'creators'

	console.log(comicsTab, comicIssuesTab, creatorsTab, params, activeTab)
	// route back to discover/comics if page 404

	const clearFilters = () => {
		setSearchString('')
		genresQueue.clear()
	}

	const handleTabChange = async (_: React.SyntheticEvent, newValue: number) => {
		console.log(newValue)
		setActiveTab(newValue)
		// https://github.com/vercel/next.js/discussions/48320
		window.history.pushState({}, '', findPathByIndex(newValue))
		// router.replace(findPathByIndex(newValue), undefined, { shallow: true })
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
						name='search'
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
	)
}

export default DiscoverPage
