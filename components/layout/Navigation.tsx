import React from 'react'
import Toolbar, { ToolbarProps } from '@mui/material/Toolbar'
import Button from '@mui/material/Button'
import Hidden from '@mui/material/Hidden'
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import AppBar from '@mui/material/AppBar'
import useScrollTrigger from '@mui/material/useScrollTrigger'
import logoWithTextImage from 'public/assets/logo-with-text-colored.png'
import logoImage from 'public/assets/logo.png'
import HamburgerMenuIcon from 'public/assets/vector-icons/hamburger-menu.svg'
import DiscoverIcon from 'public/assets/vector-icons/discover-icon.svg'
import LibraryIcon from 'public/assets/vector-icons/library-icon.svg'
import ProfileIcon from 'public/assets/vector-icons/profile.svg'
import useAnchorElement from 'hooks/useAnchorElement'
import { RoutePath } from 'enums/routePath'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import clsx from 'clsx'
import IconLink from '../IconLink'

const Navigation: React.FC<ToolbarProps> = (props) => {
	const [menuAnchorEl, setMenuAnchorEl, resetMenuAnchorEl] = useAnchorElement()
	const trigger = useScrollTrigger({ threshold: 20, disableHysteresis: false })
	const pathname = usePathname()

	const isHome = pathname === RoutePath.Home
	const isDiscover = pathname.startsWith(RoutePath.Discover)
	const isLibrary = pathname.startsWith(RoutePath.Library)
	const isProfile = pathname.startsWith(RoutePath.Profile)

	return (
		<AppBar
			className={clsx(
				'header-navigation',
				trigger && 'header-navigation--blurred',
				(isDiscover || isHome) && 'header--fixed'
			)}
		>
			<Toolbar component='nav' className='navigation' {...props}>
				<Link href={RoutePath.Home} className='company-logo-wrapper'>
					<Hidden smDown>
						<Image className='company-logo' src={logoWithTextImage} width={170} height={40} alt='dReader' />
					</Hidden>
					<Hidden smUp>
						<Image className='company-logo' src={logoImage} width={96} height={96} alt='dReader' />
					</Hidden>
				</Link>

				<Box className='navigation-items'>
					{/* Mobile */}
					<Hidden smUp>
						<Button
							variant='contained'
							aria-label='social-media'
							className='navigation-hamburger-button'
							onClick={setMenuAnchorEl}
						>
							<HamburgerMenuIcon />
						</Button>
						<Menu
							anchorEl={menuAnchorEl}
							open={Boolean(menuAnchorEl)}
							onClose={resetMenuAnchorEl}
							slotProps={{ paper: { className: 'mobile-menu' } }}
							keepMounted
						>
							<MenuItem onClick={resetMenuAnchorEl}>
								<IconLink className={clsx('navigation-item', isDiscover && 'active')} href={RoutePath.DiscoverComics}>
									<DiscoverIcon />
									Discover
								</IconLink>
							</MenuItem>
							<MenuItem onClick={resetMenuAnchorEl}>
								<IconLink className={clsx('navigation-item', isLibrary && 'active')} href={'#' || RoutePath.Library}>
									<LibraryIcon />
									Library
								</IconLink>
							</MenuItem>
							<MenuItem onClick={resetMenuAnchorEl}>
								<IconLink className={clsx('navigation-item', isProfile && 'active')} href={RoutePath.Profile}>
									<ProfileIcon />
									Profile
								</IconLink>
							</MenuItem>
						</Menu>
					</Hidden>
					{/* Desktop */}
					<Hidden smDown>
						<Link
							className={clsx('navigation-item', isDiscover && 'active')}
							aria-label='discover'
							href={RoutePath.DiscoverComics}
						>
							<DiscoverIcon />
							Discover
						</Link>
						<Link
							className={clsx('navigation-item', isLibrary && 'active')}
							aria-label='library'
							href={'#' || RoutePath.Library}
						>
							<LibraryIcon />
							Library
						</Link>
						<Link
							className={clsx('navigation-item', isProfile && 'active')}
							aria-label='library'
							href={RoutePath.Profile}
						>
							<ProfileIcon />
							Profile
						</Link>
					</Hidden>
				</Box>
			</Toolbar>
		</AppBar>
	)
}

export default Navigation
