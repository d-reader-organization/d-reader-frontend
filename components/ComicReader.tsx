// import { Box } from '@mui/material'
// import { useFetchComicIssue } from 'api/comicIssue'
// import Image from 'next/image'

const ComicReader: React.FC = () => {
	// const { data: comicIssue } = useFetchComicIssue(1)

	// if (!comicIssue) return null

	// return (
	// 	<Box
	// 		onContextMenu={(e) => {
	// 			e.preventDefault()
	// 		}}
	// 		className='comic'
	// 	>
	// 		{comicIssue.pages?.map((page, i) => (
	// 			<Image
	// 				key={page.id}
	// 				src={page.image}
	// 				alt={`Page ${page.pageNumber}`}
	// 				width={900}
	// 				height={1200}
	// 				priority={i === 0}
	// 				className='comic-page'
	// 			/>
	// 		))}
	// 	</Box>
	// )

	return null
}

export default ComicReader
