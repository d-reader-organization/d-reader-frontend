import React from 'react'
import { ToolbarProps, Toolbar, Button, Hidden, Box, Menu, MenuItem, AppBar, useScrollTrigger } from '@mui/material'
import logoWithTextImage from 'public/assets/logo-with-text.png'
import logoImage from 'public/assets/logo.png'
import DiscoverIcon from 'public/assets/vector-icons/discover-icon.svg'
import LibraryIcon from 'public/assets/vector-icons/library-icon.svg'
import SocialIcon from 'public/assets/vector-icons/social-icon.svg'
import useAnchorElement from 'hooks/useAnchorElement'
import { RoutePath } from 'enums/routePath'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import http from 'api/http'
import clsx from 'clsx'

const WalletButtonDynamic = dynamic(async () => (await import('@open-sauce/solomon')).WalletButton, { ssr: false })

const Navigation: React.FC<ToolbarProps> = (props) => {
	const [menuAnchorEl, setMenuAnchorEl, resetMenuAnchorEl] = useAnchorElement()
	const trigger = useScrollTrigger({ threshold: 20 })
	const router = useRouter()

	return (
		<AppBar
			className={clsx(
				'header',
				trigger && 'header--with-background',
				router.pathname !== RoutePath.Home && 'header--fixed'
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
							PaperProps={{ className: 'mobile-menu' }}
							keepMounted
						>
							<MenuItem onClick={resetMenuAnchorEl}>
								<Button
									LinkComponent={Link}
									className={router.pathname.startsWith(RoutePath.Discover) ? 'active' : ''}
									href={RoutePath.DiscoverComics}
								>
									<DiscoverIcon />
									Discover
								</Button>
							</MenuItem>
							<MenuItem onClick={resetMenuAnchorEl}>
								<Button
									LinkComponent={Link}
									className={router.pathname.startsWith(RoutePath.Library) ? 'active' : ''}
									href={RoutePath.Library}
								>
									<LibraryIcon />
									Library
								</Button>
							</MenuItem>
						</Menu>
					</Hidden>
					{/* Desktop */}
					<Hidden smDown>
						<Button
							LinkComponent={Link}
							className={router.pathname.startsWith(RoutePath.Discover) ? 'active' : ''}
							aria-label='discover'
							href={RoutePath.DiscoverComics}
						>
							<DiscoverIcon />
							Discover
						</Button>
						<Button
							LinkComponent={Link}
							className={router.pathname.startsWith(RoutePath.Library) ? 'active' : ''}
							aria-label='library'
							href={RoutePath.Library}
						>
							<LibraryIcon />
							Library
						</Button>
					</Hidden>
					<WalletButtonDynamic http={http} className='wallet-button' />
				</Box>
			</Toolbar>
		</AppBar>
	)
}

export default Navigation
