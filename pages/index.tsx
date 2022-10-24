import type { NextPage } from 'next'
import Navigation from 'components/layout/Navigation'
import Footer from 'components/layout/Footer'
import Main from 'components/layout/Main'
import { useFetchApp } from 'api/app'
import ComicReader from 'components/ComicReader'

const Home: NextPage = () => {
	const { data } = useFetchApp()

	console.log('data: ', data)

	return (
		<>
			<Navigation />

			<Main className='main'>
				<ComicReader />
			</Main>

			<Footer />
		</>
	)
}

export default Home
