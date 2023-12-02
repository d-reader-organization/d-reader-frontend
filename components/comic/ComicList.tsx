import { useFetchComics } from 'api/comic'
import ComicItem from './ComicItem'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { ComicParams } from 'models/comic/comicParams'
import clsx from 'clsx'

interface Props {
	params: ComicParams
	slidesToShow: number
	className?: string
}

const ComicList: React.FC<Props> = ({ params, slidesToShow, className }) => {
	const { flatData: comics } = useFetchComics(params)

	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	const SliderComponent = typeof window === 'undefined' ? Slider.default : Slider

	return (
		<SliderComponent
			className={clsx('comic-list', className)}
			slidesToShow={slidesToShow}
			slidesToScroll={slidesToShow}
		>
			{comics.map((comic) => (
				<ComicItem key={comic.slug} comic={comic} />
			))}
		</SliderComponent>
	)
}

export default ComicList
