import { useMemo } from 'react'
import type { NextPage } from 'next'
import GenreList from 'components/GenreList'
import Section from 'components/layout/Section'
import ComicList from 'components/ComicList'
import CreatorList from 'components/CreatorList'
import HeroCarousel from 'components/HeroCarousel'
import ComicIssueList from 'components/ComicIssueList'
import useBreakpoints from 'hooks/useBreakpoints'
import useOnScreen from 'hooks/useOnScreen'
import { useAuth } from '@open-sauce/solomon'
import { Box, Container } from '@mui/material'
import { ComicFilterTag, ComicSortTag } from 'models/comic/comicParams'
import { ComicIssueFilterTag, ComicIssueSortTag } from 'models/comicIssue/comicIssueParams'
import { RoutePath } from 'enums/routePath'

const Home: NextPage = () => {
	const [showGenres, , genresRef] = useOnScreen()
	const [showPopularComics, , popularComicsRef] = useOnScreen()
	const [showNewComicIssues, , newComicIssuesRef] = useOnScreen()
	const [showTopCreators, , topCreatorsRef] = useOnScreen()
	const [showNewComics, , newComicsRef] = useOnScreen()
	const [showFreeComicIssues, , freeComicIssuesRef] = useOnScreen()
	const { isAuthenticated } = useAuth()

	const { xs, sm, md, lg, xl } = useBreakpoints()

	const take = useMemo(() => {
		if (xl) return { genres: 12, comics: 18, comicsPerPage: 6, comicIssues: 18, comicIssuesPerPage: 6, creators: 8 }
		else if (lg) return { genres: 6, comics: 18, comicsPerPage: 6, comicIssues: 18, comicIssuesPerPage: 6, creators: 4 }
		else if (md) return { genres: 4, comics: 15, comicsPerPage: 5, comicIssues: 15, comicIssuesPerPage: 5, creators: 4 }
		else if (sm) return { genres: 4, comics: 12, comicsPerPage: 4, comicIssues: 12, comicIssuesPerPage: 4, creators: 4 }
		else if (xs) return { genres: 4, comics: 12, comicsPerPage: 2, comicIssues: 12, comicIssuesPerPage: 2, creators: 3 }
		else return undefined
	}, [xl, lg, md, sm, xs])

	if (!take) return null
	if (!isAuthenticated) {
		return (
			<Container className='home-container' maxWidth='xl'>
				<Box py={14} px={4}>
					Please connect your wallet
				</Box>
			</Container>
		)
	}

	return (
		<div className='home'>
			<HeroCarousel />

			<Container className='home-container' maxWidth='xl'>
				<Section
					id='promoted-comics'
					title='Get started'
					actionProps={{ children: 'See All', href: RoutePath.DiscoverComics }}
				>
					<ComicList
						params={{ skip: 0, take: take.comics, sortTag: ComicSortTag.Rating }}
						slidesToShow={take.comicsPerPage}
					/>
				</Section>

				<Section
					id='popular-comics'
					title='Popular comics'
					show={showPopularComics}
					observationRef={popularComicsRef}
					actionProps={{ children: 'See All', href: RoutePath.DiscoverComics }}
				>
					<ComicList
						params={{ skip: 0, take: take.comics, filterTag: ComicFilterTag.Popular }}
						slidesToShow={take.comicsPerPage}
					/>
				</Section>

				<Section
					id='genres'
					title='Genres'
					show={showGenres}
					observationRef={genresRef}
					actionProps={{ children: 'See All', href: RoutePath.DiscoverComics }}
				>
					<GenreList skip={0} take={take.genres} animate={showGenres} />
				</Section>

				<Section
					id='new-episodes'
					title='New episodes'
					show={showNewComicIssues}
					observationRef={newComicIssuesRef}
					actionProps={{ children: 'See All', href: RoutePath.DiscoverComicIssues }}
				>
					<ComicIssueList
						params={{ skip: 0, take: take.comicIssues, sortTag: ComicIssueSortTag.Latest }}
						slidesToShow={take.comicIssuesPerPage}
					/>
				</Section>

				<Section
					id='free-comic-issues'
					title='Free episodes'
					show={showFreeComicIssues}
					observationRef={freeComicIssuesRef}
					actionProps={{ children: 'See All', href: RoutePath.DiscoverComicIssues }}
				>
					<ComicIssueList
						params={{ skip: 0, take: take.comicIssues, filterTag: ComicIssueFilterTag.Free }}
						slidesToShow={take.comicIssuesPerPage}
					/>
				</Section>

				<Section
					id='top-creators'
					title='Top creators'
					show={showTopCreators}
					observationRef={topCreatorsRef}
					actionProps={{ children: 'See All', href: RoutePath.DiscoverCreators }}
				>
					<CreatorList skip={0} take={take.creators} animate={showTopCreators} />
				</Section>

				<Section
					id='new-comics'
					title='New comics'
					show={showNewComics}
					observationRef={newComicsRef}
					actionProps={{ children: 'See All', href: RoutePath.DiscoverComics }}
				>
					<ComicList
						params={{ skip: 0, take: take.comics, sortTag: ComicSortTag.Published }}
						slidesToShow={take.comicsPerPage}
					/>
				</Section>
			</Container>
		</div>
	)
}

export default Home
