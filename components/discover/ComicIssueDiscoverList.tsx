import { Box, CircularProgress, Grid, GridProps } from '@mui/material'
import { useFetchComicIssues } from 'api/comicIssue'
import { useEffect, useMemo } from 'react'
import ComicIssueItem from 'components/ComicIssueItem'
import { useOnScreen, useBreakpoints } from 'hooks'
import { SortOrder } from 'enums/sortOrder'

interface Props extends GridProps {
	genreSlugs: string[]
	titleSubstring: string
	sortOrder: SortOrder
	enabled: boolean
	narrow: boolean
}

const ComicIssueDiscoverList: React.FC<Props> = ({
	genreSlugs,
	titleSubstring,
	sortOrder,
	enabled,
	narrow = false,
	...props
}) => {
	const [, showMore, showMoreRef] = useOnScreen()
	const { xs, sm, md, lg, xl } = useBreakpoints()

	const take = useMemo(() => {
		if (xl) return narrow ? 12 : 18
		else if (lg) return narrow ? 12 : 18
		else if (md) return narrow ? 9 : 12
		else if (sm) return 9
		else if (xs) return 6
		else return 0
	}, [xl, narrow, lg, md, sm, xs])

	const {
		flatData: comicIssues,
		fetchNextPage,
		hasNextPage,
		isFetching,
	} = useFetchComicIssues({ genreSlugs, titleSubstring, skip: 0, take, sortOrder }, enabled)

	useEffect(() => {
		if (showMore && hasNextPage && !isFetching) fetchNextPage()
	}, [fetchNextPage, hasNextPage, isFetching, showMore])

	return (
		<>
			<Grid container spacing={2} {...props}>
				{comicIssues.map((issue) => (
					<Grid key={issue.id} item xs={6} sm={4} md={narrow ? 4 : 3} lg={narrow ? 3 : 2}>
						<ComicIssueItem comicIssue={issue} />
					</Grid>
				))}
			</Grid>
			<Box ref={showMoreRef} display='flex' justifyContent='center' py={12}>
				{isFetching && <CircularProgress />}
				{!hasNextPage && !isFetching && `${comicIssues.length} ${comicIssues.length === 1 ? 'item' : 'items'} found`}
			</Box>
		</>
	)
}

export default ComicIssueDiscoverList
