import { Box, BoxProps, Grid, Typography } from '@mui/material'
import { useFetchComicIssues } from 'api/comicIssue'
import useOnScreen from 'hooks/useOnScreen'
import Image from 'next/image'
import clsx from 'clsx'

interface Props extends BoxProps {
	take: number
}

const ComicIssueList: React.FC<Props> = ({ take, className, ...props }) => {
	const { data: comicIssues = [] } = useFetchComicIssues({ skip: 0, take })
	const [isVisible, endOfListRef] = useOnScreen()

	return (
		<Box ref={endOfListRef} className={clsx('comic-issue-list', className)} {...props}>
			<Grid container spacing={2}>
				{comicIssues.map((issue, i) => (
					<Grid key={issue.slug} item xs={12} sm={6} md={4} lg={3}>
						{/* TODO: these are Link-s */}
						<Box
							className={clsx('comic-issue-list-item', 'theme-slideX-left', isVisible ? 'theme-slideX-animate' : '')}
							style={{ transitionDelay: `${(i + 1) * 100}ms` }}
						>
							<Image
								src={issue.cover}
								alt=''
								fill
								loading='lazy'
								sizes='(max-width: 580px) 100vw,(max-width: 900px) 50vw,(max-width: 1200)33vw,25vw'
								className='cover-image'
							/>
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
