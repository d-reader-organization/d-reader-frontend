import type { NextPage } from 'next'
import { Box, Button, CircularProgress, Container, Grid, TextField } from '@mui/material'
import { useFetchGenres } from 'api/genre'
import { useAuth } from '@open-sauce/solomon'
import { useFetchComicIssues } from 'api/comicIssue'
import { useEffect, useMemo, useState } from 'react'
import GenreButton from 'components/buttons/GenreButton'
import { useOnScreen, useQueue } from 'hooks'
import ComicIssueItem from 'components/ComicIssueItem'
import Main from 'components/layout/Main'
import useBreakpoints from 'hooks/useBreakpoints'

const Discover: NextPage = () => {
	const genresQueue = useQueue<string>({ size: 1 }) // max 1 selected genre
	const [searchString, setSearchString] = useState('')
	const { data: genres = [] } = useFetchGenres()
	const [, showMore, showMoreRef] = useOnScreen()
	const { isAuthenticated } = useAuth()

	const { xs, sm, md, lg, xl } = useBreakpoints()

	const take = useMemo(() => {
		if (xl) return 18
		else if (lg) return 18
		else if (md) return 12
		else if (sm) return 9
		else if (xs) return 6
		else return 0
	}, [xl, lg, md, sm, xs])

	const {
		flatData: comicIssues,
		fetchNextPage,
		hasNextPage,
		isFetching,
	} = useFetchComicIssues({
		genreSlugs: genresQueue.items,
		titleSubstring: searchString,
		skip: 0,
		take,
	})

	useEffect(() => {
		if (showMore && hasNextPage && !isFetching) fetchNextPage()
	}, [fetchNextPage, hasNextPage, isFetching, showMore])

	if (!isAuthenticated) {
		return (
			<Box py={14} px={4}>
				Please connect your wallet
			</Box>
		)
	}

	return (
		<div className='discover'>
			<Box className='search-box'>
				<Button
					onClick={async () => {
						// setSkip((prev) => prev + 4)
						await fetchNextPage()
					}}
				>
					NEXT
				</Button>
				<TextField
					value={searchString}
					placeholder='Title'
					variant='filled'
					onChange={(e) => {
						setSearchString(e.target.value)
					}}
					size='small'
					color='secondary'
					fullWidth
				/>
				<Box className='genre-button-list'>
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
			</Box>
			<Main className='main'>
				<Container maxWidth={'xl' || false} className='comic-issue-list'>
					<Grid container spacing={2}>
						{comicIssues.map((issue) => (
							<Grid key={issue.id} item xs={6} sm={4} md={3} lg={2}>
								<ComicIssueItem comicIssue={issue} />
							</Grid>
						))}
					</Grid>
				</Container>
			</Main>
			<Box ref={showMoreRef} display='flex' justifyContent='center' pb={6}>
				{isFetching && <CircularProgress />}
				{!hasNextPage && !isFetching && <>{comicIssues.length} items found</>}
			</Box>
		</div>
	)
}

export default Discover
