import { useFetchComicIssues } from 'api/comicIssue'
import ComicIssueItem from './ComicIssueItem'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import clsx from 'clsx'
import { ComicIssueParams } from 'models/comicIssue/comicIssueParams'

interface Props {
	params: ComicIssueParams
	slidesToShow: number
	className?: string
}

const ComicIssueList: React.FC<Props> = ({ params, slidesToShow, className }) => {
	const { flatData: comicIssues = [] } = useFetchComicIssues(params)

	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	const SliderComponent = typeof window === 'undefined' ? Slider.default : Slider

	return (
		<SliderComponent
			className={clsx('comic-issue-list', className)}
			slidesToShow={slidesToShow}
			slidesToScroll={slidesToShow}
			lazyLoad='anticipated'
		>
			{comicIssues.map((issue) => (
				<ComicIssueItem key={issue.id} comicIssue={issue} />
			))}
		</SliderComponent>
	)
}

export default ComicIssueList
