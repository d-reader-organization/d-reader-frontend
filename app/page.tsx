'use client'

import { useMemo } from 'react'
import Container from '@mui/material/Container'
import { RoutePath } from 'enums/routePath'
import ComicList from '@/components/comic/ComicList'
import HeroCarousel from '@/components/HeroCarousel'
import ComicIssueList from '@/components/comicIssue/ComicIssueList'
import CreatorList from '@/components/creator/CreatorList'
import Section from '@/components/layout/Section'
import { useOnScreen, useBreakpoints } from '@/hooks'
import { ComicSortTag, ComicFilterTag } from '@/models/comic/comicParams'
import { ComicIssueSortTag, ComicIssueFilterTag } from '@/models/comicIssue/comicIssueParams'
import useAuthenticatedRoute from '@/hooks/useUserAuthenticatedRoute'
import Navigation from '@/components/layout/Navigation'
// import { useFetchMe } from '@/api/user/queries/useFetchMe'
// import JoinTheBeta from '@/components/JoinTheBeta'

export default function Home() {
	const [showPopularComics, , popularComicsRef] = useOnScreen()
	const [showNewComicIssues, , newComicIssuesRef] = useOnScreen()
	const [showTopCreators, , topCreatorsRef] = useOnScreen()
	const [showNewComics, , newComicsRef] = useOnScreen()
	const [showFreeComicIssues, , freeComicIssuesRef] = useOnScreen()

	// const { data: me } = useFetchMe()

	const { xs, sm, md, lg, xl } = useBreakpoints()

	useAuthenticatedRoute()

	const take = useMemo(() => {
		if (xl) return { genres: 12, comics: 18, comicsPerPage: 6, comicIssues: 18, comicIssuesPerPage: 6, creators: 8 }
		else if (lg) return { genres: 6, comics: 18, comicsPerPage: 6, comicIssues: 18, comicIssuesPerPage: 6, creators: 4 }
		else if (md) return { genres: 4, comics: 15, comicsPerPage: 5, comicIssues: 15, comicIssuesPerPage: 5, creators: 4 }
		else if (sm) return { genres: 4, comics: 12, comicsPerPage: 4, comicIssues: 12, comicIssuesPerPage: 4, creators: 4 }
		else if (xs) return { genres: 4, comics: 12, comicsPerPage: 2, comicIssues: 12, comicIssuesPerPage: 2, creators: 3 }
		else return undefined
	}, [xl, lg, md, sm, xs])

	if (!take) return null

	return (
		<>
			<Navigation />
			<main className='index'>
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
							priority
							fetchPriority='low'
						/>
					</Section>

					<Section
						id='popular-comics'
						title='Popular comics'
						show={showPopularComics}
						ref={popularComicsRef}
						actionProps={{ children: 'See All', href: RoutePath.DiscoverComics }}
					>
						<ComicList
							params={{ skip: 0, take: take.comics, filterTag: ComicFilterTag.Popular }}
							slidesToShow={take.comicsPerPage}
						/>
					</Section>

					<Section
						id='new-episodes'
						title='New episodes'
						show={showNewComicIssues}
						ref={newComicIssuesRef}
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
						ref={freeComicIssuesRef}
						actionProps={{ children: 'See All', href: RoutePath.DiscoverComicIssues }}
					>
						<ComicIssueList
							params={{
								skip: 0,
								take: take.comicIssues,
								filterTag: ComicIssueFilterTag.Free,
								sortTag: ComicIssueSortTag.Likes,
							}}
							slidesToShow={take.comicIssuesPerPage}
						/>
					</Section>

					<Section
						id='top-creators'
						title='Top creators'
						show={showTopCreators}
						ref={topCreatorsRef}
						actionProps={{ children: 'See All', href: RoutePath.DiscoverCreators }}
					>
						<CreatorList skip={0} take={take.creators} animate={showTopCreators} />
					</Section>

					<Section
						id='new-comics'
						title='New comics'
						show={showNewComics}
						ref={newComicsRef}
						actionProps={{ children: 'See All', href: RoutePath.DiscoverComics }}
					>
						<ComicList
							params={{ skip: 0, take: take.comics, sortTag: ComicSortTag.Published }}
							slidesToShow={take.comicsPerPage}
						/>
					</Section>
				</Container>
			</main>
		</>
	)
}
