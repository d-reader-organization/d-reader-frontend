import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import { Box, Button, Collapse, Container, Grid, Hidden, Tab, Tabs } from '@mui/material'
import ComicIssueDiscoverList from 'components/comicIssue/ComicIssueDiscoverList'
import CreatorDiscoverList from 'components/creator/CreatorDiscoverList'
import AccordionList, { AccordionItem } from 'components/ui/AccordionList'
import ComicDiscoverList from 'components/comic/ComicDiscoverList'
import ProtectedContent from 'components/ProtectedContent'
import GenreButton from 'components/buttons/GenreButton'
import { useQueue, useToggle } from 'hooks'
import { RoutePath } from 'enums/routePath'
import { SortOrder } from 'enums/sortOrder'
import { useFetchGenres } from 'api/genre'
import { useRouter } from 'next/router'
import clsx from 'clsx'

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
	const genresQueue = useQueue<string>({ size: 3 }) // max 3 selected genres
	const [searchString, setSearchString] = useState('')
	const [filterDrawer, toggleFilterDrawer] = useToggle()
	const [isAscending, toggleSortOrder] = useToggle()
	const { data: genres = [] } = useFetchGenres()

	const sortOrder = isAscending ? SortOrder.ASC : SortOrder.DESC
	const comicsTab = router.asPath === RoutePath.DiscoverComics
	const comicIssuesTab = router.asPath === RoutePath.DiscoverComicIssues
	const creatorsTab = router.asPath === RoutePath.DiscoverCreators

	useEffect(() => {
		if (typeof window !== 'object') return
		if (router.asPath === router.pathname) return

		// route to /discover/comic-issues if page is not found
		const pageFound = tabs.find((tab) => tab.path === router.asPath)
		if (!pageFound) {
			router.replace(RoutePath.DiscoverComicIssues, undefined, { shallow: true })
		} else setActiveTab(findIndex(router.asPath))
	}, [router])

	const clearFilters = () => {
		setSearchString('')
		genresQueue.clear()
	}

	const handleTabChange = async (_: React.SyntheticEvent, newValue: number) => {
		setActiveTab(newValue)
		router.replace(findPath(newValue), undefined, { shallow: true })
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
			details: (
				<>
					----
					{/* <Button
						variant='contained'
						color='primary'
						onClick={() => {
							console.log('all selected')
						}}
					>
						all
					</Button>
					<Button
						variant='contained'
						color='primary'
						onClick={() => {
							console.log('popular selected')
						}}
					>
						Popular
					</Button>
					<Button
						variant='contained'
						onClick={() => {
							console.log('free selected')
						}}
					>
						Free
					</Button> */}
				</>
			),
		},
		{
			summary: 'Sort By',
			details: <>----</>,
		},
	]

	return (
		<ProtectedContent>
			<Container className='discover' maxWidth='xl'>
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
					<Button variant='contained' className='search-button' onClick={toggleFilterDrawer}>
						{filterDrawer ? '➡️' : '⬅️'}
						<Hidden smDown> Filters</Hidden>
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
		</ProtectedContent>
	)
}

export default DiscoverComicIssues
