import React from 'react'
import Toolbar, { ToolbarProps } from '@mui/material/Toolbar'
import Button from '@mui/material/Button'
import Hidden from '@mui/material/Hidden'
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import AppBar from '@mui/material/AppBar'
import useScrollTrigger from '@mui/material/useScrollTrigger'
import logoWithTextImage from 'public/assets/logo-with-text.png'
import logoImage from 'public/assets/logo.png'
import DiscoverIcon from 'public/assets/vector-icons/discover-icon.svg'
import LibraryIcon from 'public/assets/vector-icons/library-icon.svg'
import SocialIcon from 'public/assets/vector-icons/social-icon.svg'
import useAnchorElement from 'hooks/useAnchorElement'
import { RoutePath } from 'enums/routePath'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
// import http from 'api/http'
import clsx from 'clsx'
import IconLink from '../IconLink'

const Navigation: React.FC<ToolbarProps> = (props) => {
	const [menuAnchorEl, setMenuAnchorEl, resetMenuAnchorEl] = useAnchorElement()
	const trigger = useScrollTrigger({ threshold: 20, disableHysteresis: true })
	const pathname = usePathname()

	const isDiscover = pathname.startsWith(RoutePath.Discover)
	const isLibrary = pathname.startsWith(RoutePath.Library)

	return (
		<AppBar
			className={clsx(
				'header',
				trigger && 'header--with-background',
				pathname.includes(RoutePath.Discover) && 'header--fixed'
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
							className='navigation-social-button'
							onClick={setMenuAnchorEl}
						>
							<SocialIcon />
						</Button>
						<Menu
							anchorEl={menuAnchorEl}
							open={Boolean(menuAnchorEl)}
							onClose={resetMenuAnchorEl}
							slotProps={{ paper: { className: 'mobile-menu' } }}
							keepMounted
						>
							<MenuItem onClick={resetMenuAnchorEl}>
								<IconLink className={isDiscover ? 'active' : ''} href={RoutePath.DiscoverComics}>
									<DiscoverIcon />
									Discover
								</IconLink>
							</MenuItem>
							<MenuItem onClick={resetMenuAnchorEl}>
								<IconLink className={isLibrary ? 'active' : ''} href={RoutePath.Library}>
									<LibraryIcon />
									Library
								</IconLink>
							</MenuItem>
						</Menu>
					</Hidden>
					{/* Desktop */}
					<Hidden smDown>
						<IconLink className={isDiscover ? 'active' : ''} aria-label='discover' href={RoutePath.DiscoverComics}>
							<DiscoverIcon />
							Discover
						</IconLink>
						<IconLink className={isLibrary ? 'active' : ''} aria-label='library' href={RoutePath.Library}>
							<LibraryIcon />
							Library
						</IconLink>
					</Hidden>
					{/* <WalletButtonDynamic http={http} className='wallet-button' /> */}
				</Box>
			</Toolbar>
		</AppBar>
	)
}

export default Navigation
