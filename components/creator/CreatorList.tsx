import Box, { BoxProps } from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import { useFetchCreators } from 'api/creator'
import AnimatedGridItem from '../ui/AnimatedGrid'
import { Pagination } from 'models/pagination'
import CreatorItem from './CreatorItem'
import clsx from 'clsx'

interface Props extends BoxProps, Pagination {
	animate: boolean
}

const CreatorList: React.FC<Props> = ({ skip, take, animate, className, ...props }) => {
	const { flatData: creators = [] } = useFetchCreators({ skip, take })

	return (
		<Box className={clsx('creator-list', className)} {...props}>
			<Grid container spacing={1}>
				{creators.map((creator, i) => (
					<AnimatedGridItem key={creator.slug} animate={animate} itemOrder={i} xs={12} sm={6} md={3} lg={3}>
						<CreatorItem creator={creator} />
					</AnimatedGridItem>
				))}
			</Grid>
		</Box>
	)
}

export default CreatorList
