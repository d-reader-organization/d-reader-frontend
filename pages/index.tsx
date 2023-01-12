import type { NextPage } from 'next'
import Navigation from 'components/layout/Navigation'
import ComicReader from 'components/ComicReader'
import Footer from 'components/layout/Footer'
import Main from 'components/layout/Main'

const Home: NextPage = () => {
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
