import { Box, BoxProps, Grid, Typography } from '@mui/material'
import { useFetchComicIssues } from 'api/comicIssue'
import Image from 'next/image'
import clsx from 'clsx'

interface Props extends BoxProps {
	take: number
}

const ComicIssueList: React.FC<Props> = ({ take, className, ...props }) => {
	const { data: comicIssues = [] } = useFetchComicIssues({ skip: 0, take })

	return (
		<Box className={clsx('comic-issue-list', className)} {...props}>
			<Grid container spacing={2}>
				{comicIssues.map((issue) => (
					<Grid key={issue.slug} item xs={12} sm={6} md={4} lg={3}>
						{/* TODO: these are Link-s */}
						<Box className='comic-issue-list-item'>
							<Image blurDataURL='' src={issue.cover} alt='' fill sizes='100vw' className='cover-image' />
							{/*
							{issue.stats && (
								<Box className='episodes-badge'>
									{issue.stats.issuesCount}
									{issue.stats.issuesCount > 1 ? ' EPs' : ' EP'}
								</Box>
							)} */}

							<Box className='text-area'>
								<Typography className='comic-issue-title'>{issue.title}</Typography>
								{issue.creator && (
									<Typography>
										{issue.creator.name}
										{issue.creator.isVerified ? ' ✅' : ''}
									</Typography>
								)}
							</Box>
						</Box>
					</Grid>
				))}
			</Grid>
		</Box>
	)
}

export default ComicIssueList
