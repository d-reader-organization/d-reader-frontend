import { useFetchComicIssues } from 'api/comicIssue'
import ComicIssueItem from './ComicIssueItem'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import clsx from 'clsx'

interface Props {
	skip: number
	take: number
	className?: string
}

const ComicIssueList: React.FC<Props> = ({ skip, take, className }) => {
	const { data: comicIssues = [] } = useFetchComicIssues({ skip, take: 20 })

	return (
		<Slider className={clsx('comic-issue-list', className)} slidesToShow={take} slidesToScroll={take}>
			{comicIssues.map((issue) => (
				<ComicIssueItem key={issue.id} comicIssue={issue} />
			))}
		</Slider>
	)
}

export default ComicIssueList
