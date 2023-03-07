import { useMemo } from 'react'
import type { NextPage } from 'next'
import Navigation from 'components/layout/Navigation'
import Footer from 'components/layout/Footer'
import Main from 'components/layout/Main'
import Carousel from 'components/Carousel'
import GenreList from 'components/GenreList'
import Section from 'components/layout/Section'
import ComicList from 'components/ComicList'
import CreatorList from 'components/CreatorList'
import ComicIssueList from 'components/ComicIssueList'
import { Theme, useMediaQuery } from '@mui/material'
import useOnScreen from 'hooks/useOnScreen'
import { useAuth } from '@open-sauce/solomon'

const Home: NextPage = () => {
	const [showGenres, genresRef] = useOnScreen()
	const [showPopularComics, popularComicsRef] = useOnScreen()
	const [showNewComicIssues, newComicIssuesRef] = useOnScreen()
	const [showTopCreators, topCreatorsRef] = useOnScreen()
	const [showNewComics, newComicsRef] = useOnScreen()
	const [showFreeComics, freeComicsRef] = useOnScreen()
	const { isAuthenticated } = useAuth()

	const xs = useMediaQuery((theme: Theme) => theme.breakpoints.up('xs'))
	const sm = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'))
	const md = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'))
	const lg = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'))

	const take = useMemo(() => {
		if (lg) return { genres: 8, comics: 8, comicIssues: 8, creators: 8 }
		else if (md) return { genres: 6, comics: 8, comicIssues: 8, creators: 8 }
		else if (sm) return { genres: 6, comics: 6, comicIssues: 6, creators: 6 }
		else if (xs) return { genres: 4, comics: 4, comicIssues: 4, creators: 4 }
		else return undefined
	}, [lg, md, sm, xs])

	if (!take) return null

	return (
		<>
			<Navigation />
			<header className='header'>
				<Carousel />
			</header>

			{isAuthenticated ? (
				<Main className='main'>
					<Section
						id='genres'
						title='Genres'
						show={showGenres}
						observationRef={genresRef}
						actionProps={{ children: 'See All', href: '#genres' }}
					>
						<GenreList take={take.genres} animate={showGenres} />
					</Section>

					<Section
						id='popular-comics'
						title='Popular comics'
						show={showPopularComics}
						observationRef={popularComicsRef}
						actionProps={{ children: 'See All', href: '#popular-comics' }}
					>
						<ComicList take={take.comics} animate={showPopularComics} />
					</Section>

					<Section
						id='new-episodes'
						title='New episodes'
						show={showNewComicIssues}
						observationRef={newComicIssuesRef}
						actionProps={{ children: 'See All', href: '#new-episodes' }}
					>
						<ComicIssueList take={take.comicIssues} animate={showNewComicIssues} />
					</Section>

					<Section
						id='top-creators'
						title='Top creators'
						show={showTopCreators}
						observationRef={topCreatorsRef}
						actionProps={{ children: 'See All', href: '#top-creators' }}
					>
						<CreatorList take={take.comicIssues} animate={showTopCreators} />
					</Section>

					<Section
						id='new-comics'
						title='New comics'
						show={showNewComics}
						observationRef={newComicsRef}
						actionProps={{ children: 'See All', href: '#new-comics' }}
					>
						<ComicList take={take.comics} animate={showNewComics} />
					</Section>

					<Section
						id='free-comics'
						title='Free'
						show={showFreeComics}
						observationRef={freeComicsRef}
						actionProps={{ children: 'See All', href: '#free-comics' }}
					>
						<ComicList take={take.comics} animate={showFreeComics} />
					</Section>
				</Main>
			) : (
				<div>Authenticate yo&apos;self</div>
			)}

			<Footer />
		</>
	)
}

export default Home
