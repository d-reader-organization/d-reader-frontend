import { Box, BoxProps, Grid } from '@mui/material'
import { useFetchComicIssues } from 'api/comicIssue'
import AnimatedGridItem from './AnimatedGrid'
import useOnScreen from 'hooks/useOnScreen'
import ComicIssueItem from './ComicIssueItem'
import clsx from 'clsx'

interface Props extends BoxProps {
	take: number
}

const ComicIssueList: React.FC<Props> = ({ take, className, ...props }) => {
	const { data: comicIssues = [] } = useFetchComicIssues({ skip: 0, take })
	const [isVisible, observableRef] = useOnScreen()

	// TODO: add position absolute item at px = props.px and point the ref to it
	return (
		<Box ref={observableRef} className={clsx('comic-issue-list', className)} {...props}>
			<Grid container spacing={2}>
				{comicIssues.map((issue, i) => (
					<AnimatedGridItem key={issue.slug} animate={isVisible} itemOrder={i} xs={12} sm={6} md={4} lg={3}>
						{/* TODO: these are Link-s */}
						<ComicIssueItem comicIssue={issue} />
					</AnimatedGridItem>
				))}
			</Grid>
		</Box>
	)
}

export default ComicIssueList
