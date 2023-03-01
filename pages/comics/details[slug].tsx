import { NextPage } from 'next'
import { useRouter } from 'next/router'

const ComicDetails: NextPage = () => {
	const router = useRouter()
	const { slug } = router.query

	return <p>Slug: {slug}</p>
}

export default ComicDetails
