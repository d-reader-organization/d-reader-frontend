import Box from '@mui/material/Box'
import Grid, { GridProps } from '@mui/material/Grid'
import { useFetchCreators } from 'api/creator'
import { useEffect, useMemo } from 'react'
import CreatorItem from 'components/creator/CreatorItem'
import { useOnScreen, useBreakpoints } from 'hooks'
import { CreatorParams } from 'models/creator/creatorParams'
import { Loader } from '../Loader'

interface Props extends GridProps {
	params: Partial<CreatorParams>
	enabled: boolean
	narrow: boolean
}

const CreatorDiscoverList: React.FC<Props> = ({ params, enabled, narrow = false, ...props }) => {
	const [, showMore, showMoreRef] = useOnScreen()
	const { xs, sm, md, lg, xl } = useBreakpoints()

	const take = useMemo(() => {
		if (xl) return narrow ? 12 : 18
		else if (lg) return narrow ? 12 : 18
		else if (md) return narrow ? 6 : 12
		else if (sm) return 9
		else if (xs) return 6
		else return 0
	}, [xl, narrow, lg, md, sm, xs])

	const {
		flatData: creators,
		fetchNextPage,
		hasNextPage,
		isFetching,
	} = useFetchCreators({ skip: 0, take, ...params }, enabled)

	useEffect(() => {
		if (showMore && hasNextPage && !isFetching) fetchNextPage()
	}, [fetchNextPage, hasNextPage, isFetching, showMore])

	return (
		<>
			<Grid container spacing={2} {...props}>
				{creators.map((creator) => (
					<Grid key={creator.slug} item xs={6} sm={4} md={narrow ? 6 : 3} lg={narrow ? 3 : 2}>
						<CreatorItem creator={creator} />
					</Grid>
				))}
			</Grid>
			<Box ref={showMoreRef} display='flex' justifyContent='center' py={12}>
				{isFetching && <Loader />}
				{!hasNextPage && !isFetching && `${creators.length} ${creators.length === 1 ? 'item' : 'items'} found`}
			</Box>
		</>
	)
}

export default CreatorDiscoverList
