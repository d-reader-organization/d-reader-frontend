import React from 'react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { Box, Container, Grid, Typography } from '@mui/material'
import { useFetchComic } from 'api/comic'
import { useFetchComicIssues } from 'api/comicIssue'
import AvatarImage from 'components/AvatarImage'
import Footer from 'components/layout/Footer'
import Main from 'components/layout/Main'
import Navigation from 'components/layout/Navigation'
import Image from 'next/image'
import PriceTag from 'components/tags/PriceTag'

const ComicDetails: NextPage = () => {
	const router = useRouter()
	const { slug } = router.query
	// TODO: remove slug as string
	const { data: comic, error } = useFetchComic(slug as string)
	const { data: comicIssues = [] } = useFetchComicIssues({
		comicSlug: slug as string,
		// TODO: handle infinite scroll properly
		take: 20,
		skip: 0,
	})

	if (error) return <Box p={2}>{error.message}</Box>
	if (!comic) return null

	return (
		<>
			<header>
				<Navigation />
			</header>

			<Box maxWidth='lg' margin='0 auto'>
				{/* TODO: skeleton */}
				{/* TODO: ongoing, hot */}
				<Main className='main'>
					<Box className='comic-details-wrapper'>
						<Grid container spacing={2}>
							<Grid item xs={12} sm={6} md={4} lg={3} position='relative'>
								<Image
									src={comic.cover}
									alt=''
									fill
									sizes='(max-width: 580px) 100vw,(max-width: 900px) 50vw,(max-width: 1200)33vw,25vw'
									className='cover-image'
									priority
								/>
							</Grid>
							<Grid item xs={12} sm={6} md={8} lg={9}>
								<Box className='comic-details'>
									<Typography component='h1' variant='h5' className='comic-name'>
										{comic.name}
									</Typography>
									{comic.creator && (
										<Box className='comic-creator-wrapper'>
											<AvatarImage src={comic.creator.avatar} size={48} />
											<Box ml={2}>
												<Typography className='text--author'>author</Typography>
												<Typography fontWeight='bold'>{comic.creator.name}</Typography>
											</Box>
										</Box>
									)}
									<Typography variant='body2' className='comic-flavor-text'>
										{comic.flavorText}
									</Typography>
									<Typography variant='body1'>{comic.description}</Typography>
									{comic.genres && (
										<Box className='comic-genre-list'>
											{comic.genres.map((genre) => (
												<React.Fragment key={genre.slug}>
													<Box className='genre-item'>
														<img src={genre.icon} alt='' className='genre-icon' style={{ background: genre.color }} />
														<Typography variant='body1'>{genre.name}</Typography>
													</Box>
												</React.Fragment>
											))}
										</Box>
									)}
									{comic.stats && comic.myStats && (
										<Box className='comic-stats-list'>
											<Box className='stat-item'>
												<PriceTag price={comic.stats.totalVolume} reverse />
												&nbsp;VOLUME
											</Box>
											<Box className='stat-item'>
												<strong>{comic.stats.issuesCount}</strong>&nbsp;EPs
											</Box>
											<Box className='stat-item'>
												<strong>{comic.stats.viewersCount}</strong>&nbsp;👁️‍🗨️
											</Box>
											<Box className='stat-item stat-item--star'>
												<strong>{comic.stats.averageRating || '--'}</strong>&nbsp;{comic.myStats.rating ? '⭐' : '⭐'}
											</Box>
											<Box className='stat-item stat-item--heart'>
												<strong>{comic.stats.favouritesCount}</strong>&nbsp;
												{comic.myStats.isFavourite ? '💖' : '🤍'}
											</Box>
										</Box>
									)}
								</Box>
							</Grid>
						</Grid>
					</Box>

					<br />
					<br />
					<br />
					<br />
					{comicIssues.length > 0 ? (
						<Grid container spacing={2}>
							{comicIssues.map((issue) => (
								<Grid item key={issue.id} xs={12} sm={6} md={4} lg={3}>
									EPISODE {issue.number} of {comic.stats?.issuesCount}
									<br />
									{comic.name}
									<br />
									{issue.title}
									<br />
									{issue.description}
									<br />
									{issue.stats?.price}
									<br />
									{issue.stats?.viewersCount}
									<br />
									{new Date(issue.releaseDate).toLocaleDateString()}
								</Grid>
							))}
						</Grid>
					) : (
						<Box>
							{/* TODO: this thing */}
							No issues found for this comic
						</Box>
					)}
				</Main>
			</Box>
			<Footer />
		</>
	)
}

export default ComicDetails
