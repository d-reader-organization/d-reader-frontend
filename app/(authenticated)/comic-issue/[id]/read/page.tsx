'use client'

import React, { useCallback, useMemo } from 'react'
import Container from '@mui/material/Container'
// import useMediaQuery from '@mui/material/useMediaQuery'
// import { Theme } from '@mui/material/styles'
import { useFetchComicIssue, useFetchComicIssuePages } from 'api/comicIssue'
import EReaderNavigation from '@/components/layout/EReaderNavigation'
import useAuthenticatedRoute from '@/hooks/useUserAuthenticatedRoute'
import PreviewPagesIcon from 'public/assets/vector-icons/preview-pages-icon.svg'
import Image from 'next/image'
import { useToggle } from '@/hooks'
import UnwrapIssueDialog from '@/components/dialogs/UnwrapIssueDialog'
import { useFetchNfts } from '@/api/nft'
import { useWallet } from '@solana/wallet-adapter-react'
import { useFetchMe } from '@/api/user/queries/useFetchMe'
import Button from '@/components/Button'

interface Params {
	id: string
}

const ReadComicIssuePage = ({ params }: { params: Params }) => {
	const [unwrapIssueDialog, , closeUnwrapIssueDialog, openUnwrapIssueDialog] = useToggle()
	const { data: pages = [], isFetched } = useFetchComicIssuePages(params.id)
	const { data: comicIssue } = useFetchComicIssue(params.id)
	const { data: me } = useFetchMe()
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { publicKey } = useWallet()

	// TODO: highlight NFTs owned by this public key and disable "open" buttons on others

	const { data: nfts = [], refetch: fetchNfts } = useFetchNfts({ userId: me?.id, comicIssueId: params.id }, !!me)

	useAuthenticatedRoute()

	const hasUnusedNfts = useMemo(() => nfts.some((nft) => !nft.isUsed), [nfts])

	const handleOpenUnwrapDialog = useCallback(async () => {
		await fetchNfts()
		openUnwrapIssueDialog()
	}, [fetchNfts, openUnwrapIssueDialog])

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
					{isFetched && (!comicIssue.myStats?.canRead || !comicIssue.isFullyUploaded) && (
						<div className='preview-message'>
							<PreviewPagesIcon className='preview-message-icon' />
							<div className='preview-message-content'>
								<p className='preview-message-title'>This is a comic preview!</p>
								{!comicIssue.myStats?.canRead && (
									<p className='preview-message-text'>
										To view all pages you need to own at least one <strong>opened</strong> comic issue NFT.
									</p>
								)}
								{hasUnusedNfts && (
									<Button className='button--unwrap' backgroundColor='yellow-500' onClick={handleOpenUnwrapDialog}>
										Unwrap
									</Button>
								)}
								{!comicIssue.isFullyUploaded && (
									<p className='preview-message-text'>
										This comic is not yet fully uploaded. New chapters/pages might be added weekly or the comic is still
										in a presale phase.
									</p>
								)}
							</div>
						</div>
					)}
					<UnwrapIssueDialog
						nfts={nfts}
						open={unwrapIssueDialog}
						onClose={closeUnwrapIssueDialog}
						comicIssue={comicIssue}
					/>
				</Container>
			</main>
		</>
	)
}

export default ReadComicIssuePage
