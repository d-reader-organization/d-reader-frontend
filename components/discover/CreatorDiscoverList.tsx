import { Box, CircularProgress, Grid, GridProps } from '@mui/material'
import { useFetchCreators } from 'api/creator'
import { useEffect, useMemo } from 'react'
import CreatorItem from 'components/CreatorItem'
import { useOnScreen, useBreakpoints } from 'hooks'
import { SortOrder } from 'enums/sortOrder'

interface Props extends GridProps {
	genreSlugs: string[]
	nameSubstring: string
	sortOrder: SortOrder
	enabled: boolean
}

const CreatorDiscoverList: React.FC<Props> = ({ genreSlugs, nameSubstring, sortOrder, enabled, ...props }) => {
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
		flatData: creators,
		fetchNextPage,
		hasNextPage,
		isFetching,
	} = useFetchCreators({ genreSlugs, nameSubstring, skip: 0, take, sortOrder }, enabled)

	useEffect(() => {
		if (showMore && hasNextPage && !isFetching) fetchNextPage()
	}, [fetchNextPage, hasNextPage, isFetching, showMore])

	return (
		<>
			<Grid container spacing={2} {...props}>
				{creators.map((creator) => (
					<Grid key={creator.slug} item xs={6} sm={4} md={3} lg={2}>
						<CreatorItem creator={creator} />
					</Grid>
				))}
			</Grid>
			<Box ref={showMoreRef} display='flex' justifyContent='center' py={12}>
				{isFetching && <CircularProgress />}
				{!hasNextPage && !isFetching && `${creators.length} ${creators.length === 1 ? 'item' : 'items'} found`}
			</Box>
		</>
	)
}

export default CreatorDiscoverList
