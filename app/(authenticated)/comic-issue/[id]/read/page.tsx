'use client'

import React from 'react'
import Container from '@mui/material/Container'
// import useMediaQuery from '@mui/material/useMediaQuery'
// import { Theme } from '@mui/material/styles'
import { useFetchComicIssue, useFetchComicIssuePages } from 'api/comicIssue'
import EReaderNavigation from '@/components/layout/EReaderNavigation'
import useAuthenticatedRoute from '@/hooks/useUserAuthenticatedRoute'
import PreviewPagesIcon from 'public/assets/vector-icons/preview-pages-icon.svg'
import Image from 'next/image'

interface Params {
	id: string
}

const ReadComicIssuePage = ({ params }: { params: Params }) => {
	const { data: pages = [] } = useFetchComicIssuePages(params.id)
	const { data: comicIssue } = useFetchComicIssue(params.id)

	useAuthenticatedRoute()

	// TODO:
	// - skeleton loading images
	// - if the screen is large, offer the 'zoom' option
	// - page by page reading mode
	// const isLargeScreen = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'))

	if (!pages || !comicIssue) return null

	return (
		<>
			<EReaderNavigation comicIssue={comicIssue} />
			<main className='e-reader-page' style={{ marginBottom: 72 }}>
				<Container className='e-reader-container' maxWidth='md' disableGutters>
					{pages.map((page) => (
						<div key={page.id} style={{ maxWidth: 1200, margin: 'auto', lineHeight: 0 }}>
							<Image
								sizes='(max-width: 1200px) 100vw, 1200px'
								width={1200}
								height={2000}
								src={page.image}
								alt={`Page ${page.pageNumber}`}
								style={{ width: '100%', height: 'auto' }}
								loading='eager'
								className='e-reader-comic-page'
							/>
						</div>
					))}
					{(!comicIssue.myStats?.canRead || !comicIssue.isFullyUploaded) && (
						<div className='preview-message'>
							<PreviewPagesIcon className='preview-message-icon' />
							<div className='preview-message-content'>
								<p className='preview-message-title'>This is a comic preview!</p>
								{!comicIssue.myStats?.canRead && (
									<p>To view all pages buy a full copy or become a monthly subscriber</p>
								)}
								{!comicIssue.isFullyUploaded && (
									<p>
										This comic is not yet fully uploaded. New chapters/pages might be added weekly or the comic is still
										in a presale phase
									</p>
								)}
							</div>
						</div>
					)}
				</Container>
			</main>
		</>
	)
}

export default ReadComicIssuePage
