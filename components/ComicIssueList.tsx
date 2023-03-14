import { Box, BoxProps, Grid } from '@mui/material'
import { useFetchComicIssues } from 'api/comicIssue'
import AnimatedGridItem from './AnimatedGrid'
import ComicIssueItem from './ComicIssueItem'
import clsx from 'clsx'

interface Props extends BoxProps {
	skip: number
	take: number
	animate: boolean
}

const ComicIssueList: React.FC<Props> = ({ skip, take, animate, className, ...props }) => {
	const { data: comicIssues = [] } = useFetchComicIssues({ skip, take })

	return (
		<Box className={clsx('comic-issue-list', className)} {...props}>
			<Grid container spacing={1}>
				{comicIssues.map((issue, i) => (
					<AnimatedGridItem key={issue.id} animate={animate} itemOrder={i} xs={12} sm={6} md={4} lg={3}>
						{/* TODO: these are Link-s */}
						<ComicIssueItem comicIssue={issue} />
					</AnimatedGridItem>
				))}
			</Grid>
		</Box>
	)
}

export default ComicIssueList
