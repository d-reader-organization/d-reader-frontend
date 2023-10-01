import { useFetchComics } from 'api/comic'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { ComicParams } from 'models/comic/comicParams'
import ComicItem from './comic/ComicItem'
import Slider from 'react-slick'
import clsx from 'clsx'

interface Props {
	params: ComicParams
	slidesToShow: number
	className?: string
}

const ComicList: React.FC<Props> = ({ params, slidesToShow, className }) => {
	const { flatData: comics } = useFetchComics(params)

	return (
		<Slider className={clsx('comic-list', className)} slidesToShow={slidesToShow} slidesToScroll={slidesToShow}>
			{comics.map((comic) => (
				<ComicItem key={comic.slug} comic={comic} />
			))}
		</Slider>
	)
}

export default ComicList
