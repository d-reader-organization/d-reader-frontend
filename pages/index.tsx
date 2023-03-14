import { useMemo } from 'react'
import type { NextPage } from 'next'
import Navigation from 'components/layout/Navigation'
import Footer from 'components/layout/Footer'
import Main from 'components/layout/Main'
import GenreList from 'components/GenreList'
import Section from 'components/layout/Section'
import ComicList from 'components/ComicList'
import CreatorList from 'components/CreatorList'
import Carousel from 'components/Carousel'
import ComicIssueList from 'components/ComicIssueList'
import { Box, Theme, useMediaQuery } from '@mui/material'
import { useAuth } from '@open-sauce/solomon'
import useOnScreen from 'hooks/useOnScreen'

const Home: NextPage = () => {
	const [showGenres, genresRef] = useOnScreen()
	const [showPopularComics, popularComicsRef] = useOnScreen()
	const [showNewComicIssues, newComicIssuesRef] = useOnScreen()
	const [showTopCreators, topCreatorsRef] = useOnScreen()
	const [showNewComics, newComicsRef] = useOnScreen()
	const [showFreeComicIssues, freeComicIssuesRef] = useOnScreen()
	const { isAuthenticated } = useAuth()

	const xs = useMediaQuery((theme: Theme) => theme.breakpoints.up('xs'))
	const sm = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'))
	const md = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'))
	const lg = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'))

	const take = useMemo(() => {
		if (lg) return { genres: 8, comics: 4, comicIssues: 4, creators: 4 }
		else if (md) return { genres: 6, comics: 6, comicIssues: 6, creators: 4 }
		else if (sm) return { genres: 6, comics: 6, comicIssues: 6, creators: 6 }
		else if (xs) return { genres: 4, comics: 4, comicIssues: 4, creators: 4 }
		else return undefined
	}, [lg, md, sm, xs])

	if (!take) return null

	return (
		<div className='home'>
			<Navigation />

			<Carousel />

			{isAuthenticated ? (
				<Main className='main'>
					<Section
						id='promoted-comics'
						title='Get started'
						actionProps={{ children: 'See All', href: '#promoted-comics' }}
					>
						<ComicList skip={0} take={take.comics} animate />
					</Section>

					<Section
						id='genres'
						title='Genres'
						show={showGenres}
						observationRef={genresRef}
						actionProps={{ children: 'See All', href: '#genres' }}
					>
						<GenreList skip={0} take={take.genres} animate={showGenres} />
					</Section>

					<Section
						id='popular-comics'
						title='Popular comics'
						show={showPopularComics}
						observationRef={popularComicsRef}
						actionProps={{ children: 'See All', href: '#popular-comics' }}
					>
						<ComicList skip={take.comics} take={take.comics} animate={showPopularComics} />
					</Section>

					<Section
						id='new-episodes'
						title='New episodes'
						show={showNewComicIssues}
						observationRef={newComicIssuesRef}
						actionProps={{ children: 'See All', href: '#new-episodes' }}
					>
						<ComicIssueList skip={0} take={take.comicIssues} animate={showNewComicIssues} />
					</Section>

					<Section
						id='top-creators'
						title='Top creators'
						show={showTopCreators}
						observationRef={topCreatorsRef}
						actionProps={{ children: 'See All', href: '#top-creators' }}
					>
						<CreatorList skip={0} take={take.creators} animate={showTopCreators} />
					</Section>

					<Section
						id='new-comics'
						title='New comics'
						show={showNewComics}
						observationRef={newComicsRef}
						actionProps={{ children: 'See All', href: '#new-comics' }}
					>
						<ComicList skip={take.comics * 2} take={take.comics} animate={showNewComics} />
					</Section>

					<Section
						id='free-comic-issues'
						title='Free episodes'
						show={showFreeComicIssues}
						observationRef={freeComicIssuesRef}
						actionProps={{ children: 'See All', href: '#free-episodes' }}
					>
						<ComicIssueList skip={take.comicIssues} take={take.comicIssues} animate={showFreeComicIssues} />
					</Section>
				</Main>
			) : (
				<Box py={14} px={4}>
					Authenticate yo&apos;self
				</Box>
			)}

			<Footer />
		</div>
	)
}

export default Home
