import { Box, BoxProps, Grid } from '@mui/material'
import { useFetchCreators } from 'api/creator'
import AnimatedGridItem from './AnimatedGrid'
import useOnScreen from 'hooks/useOnScreen'
import CreatorItem from './CreatorItem'
import clsx from 'clsx'

interface Props extends BoxProps {
	take: number
}

const CreatorList: React.FC<Props> = ({ take, className, ...props }) => {
	const { data: creators = [] } = useFetchCreators({ skip: 0, take })
	const [isVisible, observableRef] = useOnScreen()

	// TODO: add position absolute item at px = props.px and point the ref to it
	return (
		<Box ref={observableRef} className={clsx('creator-list', className)} {...props}>
			<Grid container spacing={2}>
				{creators.map((creator, i) => (
					<AnimatedGridItem key={creator.slug} animate={isVisible} itemOrder={i} xs={12} sm={6} md={4} lg={3}>
						{/* TODO: these are Link-s */}
						<CreatorItem creator={creator} />
					</AnimatedGridItem>
				))}
			</Grid>
		</Box>
	)
}

export default CreatorList
