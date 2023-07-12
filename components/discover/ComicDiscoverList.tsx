import { Box, CircularProgress, Grid, GridProps } from '@mui/material'
import { useFetchComics } from 'api/comic'
import { useEffect, useMemo } from 'react'
import ComicItem from 'components/ComicItem'
import { useOnScreen, useBreakpoints } from 'hooks'
import { SortOrder } from 'enums/sortOrder'

interface Props extends GridProps {
	genreSlugs: string[]
	titleSubstring: string
	sortOrder: SortOrder
	enabled: boolean
}

const ComicDiscoverList: React.FC<Props> = ({ genreSlugs, titleSubstring, sortOrder, enabled, ...props }) => {
	const [, showMore, showMoreRef] = useOnScreen()
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
		flatData: comics,
		fetchNextPage,
		hasNextPage,
		isFetching,
	} = useFetchComics({ genreSlugs, titleSubstring, skip: 0, take, sortOrder }, enabled)

	useEffect(() => {
		if (showMore && hasNextPage && !isFetching) fetchNextPage()
	}, [fetchNextPage, hasNextPage, isFetching, showMore])

	return (
		<>
			<Grid container spacing={2} {...props}>
				{comics.map((comic) => (
					<Grid key={comic.slug} item xs={6} sm={4} md={3} lg={2}>
						<ComicItem comic={comic} />
					</Grid>
				))}
			</Grid>
			<Box ref={showMoreRef} display='flex' justifyContent='center' py={12}>
				{isFetching && <CircularProgress />}
				{!hasNextPage && !isFetching && `${comics.length} ${comics.length === 1 ? 'item' : 'items'} found`}
			</Box>
		</>
	)
}

export default ComicDiscoverList
