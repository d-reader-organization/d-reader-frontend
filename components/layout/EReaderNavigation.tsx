'use client'

import React from 'react'
import Toolbar, { ToolbarProps } from '@mui/material/Toolbar'
import Hidden from '@mui/material/Hidden'
import Box from '@mui/material/Box'
import AppBar from '@mui/material/AppBar'
import useScrollTrigger from '@mui/material/useScrollTrigger'
import ArrowRightIcon from 'public/assets/vector-icons/arrow-right.svg'
// import PageByPageIcon from 'public/assets/vector-icons/page-by-page-icon.svg'
// import SwapIcon from 'public/assets/vector-icons/swap-icon.svg'
// import { useLocalStorage } from '@/hooks/useLocalStorage'
import { ComicIssue } from '@/models/comicIssue'
import { RoutePath } from 'enums/routePath'
// import Switch from '@mui/material/Switch'
import Link from 'next/link'
import clsx from 'clsx'
import FlexRow from '../ui/FlexRow'
import HeartIcon from '../icons/HeartIcon'
import StarIcon from '../icons/StarIcon'
import { isNil } from 'lodash'
import Button from '../Button'
import { useOnScreen, useToggle } from '@/hooks'
import StarRatingDialog from '../dialogs/StarRatingDialog'
import { useFavouritiseComicIssue, useRateComicIssue } from '@/api/comicIssue'

interface Props extends ToolbarProps {
	comicIssue: ComicIssue
}

const EReaderNavigation: React.FC<Props> = ({ comicIssue, ...props }) => {
	const trigger = useScrollTrigger({ threshold: 20, disableHysteresis: false })
	const [, touchingPageBottom, pageBottomRef] = useOnScreen()
	const hideNavigation = trigger && !touchingPageBottom

	// const [isInfiniteScrollView, setIsInfiniteScrollView] = useLocalStorage('isInfiniteScrollView', true)
	const [starRatingDialog, , closeStarRatingDialog, openStarRatingDialog] = useToggle()

	const { mutateAsync: toggleFavoriteComicIssue, isLoading: loadingToggleFavoriteComicIssue } =
		useFavouritiseComicIssue(comicIssue.id)
	const { mutateAsync: rateComicIssue } = useRateComicIssue(comicIssue.id)

	const commands = (
		<FlexRow className='e-reader-navigation--right'>
			{/* <FlexRow centered>
				<SwapIcon className={clsx('switch-icon', isInfiniteScrollView && 'switch-icon--active')} />
				<Switch
					defaultChecked={!isInfiniteScrollView}
					classes={{ root: 'switch-root', switchBase: 'switch-base' }}
					onChange={() => {
						setIsInfiniteScrollView((prevState) => !prevState)
					}}
					color='secondary'
				/>
				<PageByPageIcon className={clsx('switch-icon', !isInfiniteScrollView && 'switch-icon--active')} />
			</FlexRow> */}

			<FlexRow centered sx={{ mx: { xs: 2, xl: 3 } }}>
				<Button
					naked
					disabled={loadingToggleFavoriteComicIssue}
					onClick={async () => {
						await toggleFavoriteComicIssue()
					}}
				>
					<HeartIcon size='lg' solid={comicIssue.myStats?.isFavourite} />
				</Button>
				{comicIssue.stats?.favouritesCount}
			</FlexRow>
			<FlexRow centered>
				<Button naked onClick={openStarRatingDialog}>
					<StarIcon size='lg' solid={!isNil(comicIssue.myStats?.rating)} />
				</Button>
				<StarRatingDialog
					title='Rate the episode'
					open={starRatingDialog}
					onClose={closeStarRatingDialog}
					onSubmit={async (rating: number) => {
						await rateComicIssue({ rating })
						closeStarRatingDialog()
					}}
				/>
				{comicIssue.stats?.averageRating || '-'}
			</FlexRow>
		</FlexRow>
	)

	return (
		<>
			<AppBar
				className={clsx(
					'header-navigation',
					'header-navigation--reader',
					hideNavigation && 'header-navigation--hidden'
				)}
			>
				<Toolbar component='nav' className='navigation' {...props}>
					<Box className='e-reader-navigation-items'>
						<Hidden mdUp>
							<Link href={RoutePath.ComicIssue(comicIssue.id)} className='e-reader-navigation-item navigation-link'>
								<ArrowRightIcon className='arrow-right--reversed' />
								<Hidden only='sm'>
									<strong>EP {comicIssue.number}</strong>&nbsp;&nbsp;
								</Hidden>
								<span className='grey-100'>{comicIssue.title}</span>
							</Link>
						</Hidden>
						<Hidden mdDown>
							<Link
								href={RoutePath.ComicIssue(comicIssue.id)}
								className='e-reader-navigation-item navigation-link e-reader-navigation--left'
							>
								<ArrowRightIcon className='arrow-right--reversed' />
								{'Back' || comicIssue.comic?.title}
							</Link>

							<Link href={RoutePath.ComicIssue(comicIssue.id)} className='e-reader-navigation-item navigation-link'>
								<strong>EP {comicIssue.number}</strong>&nbsp;&nbsp;<span className='grey-100'>{comicIssue.title}</span>
							</Link>
						</Hidden>
						<Hidden smDown>{commands}</Hidden>
					</Box>
				</Toolbar>
			</AppBar>

			<Hidden smUp>
				<AppBar
					component='footer'
					className={clsx('footer-navigation footer-navigation--reader', hideNavigation && 'footer-navigation--hidden')}
				>
					<Toolbar component='nav' className='navigation' {...props}>
						<Box className='e-reader-navigation-items'>{commands}</Box>
					</Toolbar>
				</AppBar>
			</Hidden>

			<div ref={pageBottomRef} className='end-of-page-anchor' />
		</>
	)
}

export default EReaderNavigation
