import React from 'react'
import Toolbar, { ToolbarProps } from '@mui/material/Toolbar'
import Button from '@mui/material/Button'
import Hidden from '@mui/material/Hidden'
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import AppBar from '@mui/material/AppBar'
import useScrollTrigger from '@mui/material/useScrollTrigger'
import logoImage from 'public/assets/logo.png'
import FullLogo from 'public/assets/vector-icons/full-logo.svg'
import HamburgerMenuIcon from 'public/assets/vector-icons/hamburger-menu.svg'
import DiscoverIcon from 'public/assets/vector-icons/discover-icon.svg'
// import LibraryIcon from 'public/assets/vector-icons/library-icon.svg'
import HomeIcon from 'public/assets/vector-icons/home-icon.svg'
import ProfileIcon from 'public/assets/vector-icons/profile.svg'
import useAnchorElement from 'hooks/useAnchorElement'
import { RoutePath } from 'enums/routePath'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import clsx from 'clsx'
import IconLink from '../IconLink'
import { BottomNavigation, BottomNavigationAction, Theme, useMediaQuery } from '@mui/material'
import { useSessionStorage } from '@/hooks/useSessionStorage'
import { WALLET_LABELS } from '@/constants/wallets'
import dynamic from 'next/dynamic'

const BaseWalletMultiButtonDynamic = dynamic(
	async () => (await import('@solana/wallet-adapter-react-ui')).BaseWalletMultiButton,
	{ ssr: false }
)

enum BottomNavItem {
	home = 'home',
	discover = 'discover',
	profile = 'profile',
}

type BottomNavProps = {
	initialNavItem?: BottomNavItem
}

interface NavProps extends ToolbarProps {
	paramId?:string | number
}

const DBottomNavigation: React.FC<BottomNavProps> = ({ initialNavItem = BottomNavItem.home }) => {
	const bottomNavItemKey = 'bottom_nav_item'
	const [navItemValue, setNavItemValue] = useSessionStorage(bottomNavItemKey, initialNavItem)

	return (
		<BottomNavigation
			className='bottom-navigation bottom-navigation--blurred'
			showLabels
			sx={{
				'& .Mui-selected, .Mui-selected > svg': {
					color: '#fceb54',
				},
			}}
			value={navItemValue}
			onChange={(event, newValue) => {
				if (newValue === navItemValue) {
					event.preventDefault()
					return
				}
				setNavItemValue(newValue)
			}}
		>
			<BottomNavigationAction
				classes={{ label: 'bottom-navigation--label' }}
				icon={<HomeIcon />}
				label='Home'
				value={BottomNavItem.home}
				href={RoutePath.Home}
			/>
			<BottomNavigationAction
				classes={{ label: 'bottom-navigation--label' }}
				icon={<DiscoverIcon />}
				label='Discover'
				value={BottomNavItem.discover}
				href={RoutePath.DiscoverComics}
			/>
			<BottomNavigationAction
				classes={{ label: 'bottom-navigation--label' }}
				icon={<ProfileIcon />}
				label='Profile'
				value={BottomNavItem.profile}
				href={RoutePath.Profile}
			/>
		</BottomNavigation>
	)
}

const Navigation: React.FC<NavProps> = (props) => {
	const [menuAnchorEl, setMenuAnchorEl, resetMenuAnchorEl] = useAnchorElement()
	const trigger = useScrollTrigger({ threshold: 20, disableHysteresis: false })
	const pathname = usePathname()

	const isHome = pathname === RoutePath.Home
	const isDiscover = pathname.startsWith(RoutePath.Discover)
	// const isLibrary = pathname.startsWith(RoutePath.Library)
	const isProfile = pathname.startsWith(RoutePath.Profile)

	const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))
	const isMint = props.paramId ? (pathname === RoutePath.Mint(props.paramId) || RoutePath.ComicIssue(props.paramId)) : false;

	return isMobile ? (
		<DBottomNavigation
			initialNavItem={isDiscover ? BottomNavItem.discover : isProfile ? BottomNavItem.profile : BottomNavItem.home}
		/>
	) : (
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
						<FullLogo className='company-logo' />
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
							{/* <MenuItem onClick={resetMenuAnchorEl}>
								<IconLink className={clsx('navigation-item', isLibrary && 'active')} href={'#' || RoutePath.Library}>
									<LibraryIcon />
									Library
								</IconLink>
							</MenuItem> */}
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
						{/* <Link
							className={clsx('navigation-item', isLibrary && 'active')}
							aria-label='library'
							href={'#' || RoutePath.Library}
						>
							<LibraryIcon />
							Library
						</Link> */}
						<Link
							className={clsx('navigation-item', isProfile && 'active')}
							aria-label='library'
							href={RoutePath.Profile}
						>
							<ProfileIcon />
							Profile
						</Link>
					</Hidden>
					{isMint ? <BaseWalletMultiButtonDynamic style={{ fontSize: '17px' }} labels={WALLET_LABELS} /> : null}
				</Box>
			</Toolbar>
		</AppBar>
	)
}

export default Navigation
