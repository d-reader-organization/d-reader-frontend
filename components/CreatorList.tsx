import { Box, BoxProps, Grid } from '@mui/material'
import { useFetchCreators } from 'api/creator'
import AnimatedGridItem from './AnimatedGrid'
import CreatorItem from './CreatorItem'
import clsx from 'clsx'

interface Props extends BoxProps {
	skip: number
	take: number
	animate: boolean
}

const CreatorList: React.FC<Props> = ({ skip, take, animate, className, ...props }) => {
	const { data: creators = [] } = useFetchCreators({ skip, take })

	return (
		<Box className={clsx('creator-list', className)} {...props}>
			<Grid container spacing={1}>
				{creators.map((creator, i) => (
					<AnimatedGridItem key={creator.slug} animate={animate} itemOrder={i} xs={12} sm={6} md={4} lg={3}>
						{/* TODO: these are Link-s */}
						<CreatorItem creator={creator} />
					</AnimatedGridItem>
				))}
			</Grid>
		</Box>
	)
}

export default CreatorList
