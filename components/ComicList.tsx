import { useFetchComics } from 'api/comic'
import ComicItem from './ComicItem'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import clsx from 'clsx'

interface Props {
	skip: number
	take: number
	className?: string
}

const ComicList: React.FC<Props> = ({ skip, take, className }) => {
	const { data: comics = [] } = useFetchComics({ skip, take: 20 })

	return (
		<Slider className={clsx('comic-list', className)} slidesToShow={take} slidesToScroll={take}>
			{comics.map((comic) => (
				<ComicItem key={comic.slug} comic={comic} />
			))}
		</Slider>
	)
}

export default ComicList
