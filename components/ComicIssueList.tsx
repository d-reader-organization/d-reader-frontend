import { Box, BoxProps, Grid } from '@mui/material'
import { useFetchComicIssues } from 'api/comicIssue'
import AnimatedGridItem from './AnimatedGrid'
import ComicIssueItem from './ComicIssueItem'
import clsx from 'clsx'

interface Props extends BoxProps {
	take: number
	animate: boolean
}

const ComicIssueList: React.FC<Props> = ({ take, animate, className, ...props }) => {
	const { data: comicIssues = [] } = useFetchComicIssues({ skip: 0, take })

	return (
		<Box className={clsx('comic-issue-list', className)} {...props}>
			<Grid container spacing={1}>
				{comicIssues.map((issue, i) => (
					<AnimatedGridItem key={issue.slug} animate={animate} itemOrder={i} xs={12} sm={6} md={4} lg={3}>
						{/* TODO: these are Link-s */}
						<ComicIssueItem comicIssue={issue} />
					</AnimatedGridItem>
				))}
			</Grid>
		</Box>
	)
}

export default ComicIssueList
