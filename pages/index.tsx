import type { NextPage } from 'next'
import Navigation from 'components/layout/Navigation'
import Footer from 'components/layout/Footer'
import Main from 'components/layout/Main'
import Carousel from 'components/Carousel'
import GenreList from 'components/GenreList'
import Section from 'components/layout/Section'
import ComicList from 'components/ComicList'
import ComicIssueList from 'components/ComicIssueList'
import { Theme, useMediaQuery } from '@mui/material'
import { useMemo } from 'react'

const Home: NextPage = () => {
	const xs = useMediaQuery((theme: Theme) => theme.breakpoints.up('xs'))
	const sm = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'))
	const md = useMediaQuery((theme: Theme) => theme.breakpoints.up('md'))
	const lg = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'))

	const take = useMemo(() => {
		if (lg) return { genres: 8, comics: 8, comicIssues: 8 }
		else if (md) return { genres: 8, comics: 8, comicIssues: 8 }
		else if (sm) return { genres: 6, comics: 6, comicIssues: 6 }
		else if (xs) return { genres: 4, comics: 4, comicIssues: 4 }
		else return undefined
	}, [lg, md, sm, xs])

	if (!take) return null

	return (
		<>
			<Navigation />
			<header className='header'>
				<Carousel />
			</header>

			<Main className='main'>
				<Section id='genres' title='Genres' actionProps={{ children: 'See All', href: '#genres' }}>
					<GenreList take={take.genres} />
				</Section>

				<Section id='new-comics' title='New comics' actionProps={{ children: 'See All', href: '#new-comics' }}>
					<ComicList take={take.comics} />
				</Section>

				<Section
					id='popular-issues'
					title='Popular issues'
					actionProps={{ children: 'See All', href: '#popular-issues' }}
				>
					<ComicIssueList take={take.comicIssues} />
				</Section>
			</Main>

			<Footer />
		</>
	)
}

export default Home
