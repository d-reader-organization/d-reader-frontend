import React from 'react'
import { ToolbarProps, Toolbar, Button, Hidden, Box, Menu, MenuItem, AppBar, useScrollTrigger } from '@mui/material'
import logoWithTextImage from 'public/assets/logo-with-text.png'
import logoImage from 'public/assets/logo.png'
import DiscordIcon from 'public/assets/vector-icons/discord-icon.svg'
import TwitterIcon from 'public/assets/vector-icons/twitter-icon.svg'
import SocialIcon from 'public/assets/vector-icons/social-icon.svg'
import useAnchorElement from 'hooks/useAnchorElement'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import http from 'api/http'
import clsx from 'clsx'

const WalletButtonDynamic = dynamic(async () => (await import('@open-sauce/solomon')).WalletButton, { ssr: false })

const Navigation: React.FC<ToolbarProps> = (props) => {
	const [menuAnchorEl, setMenuAnchorEl, resetMenuAnchorEl] = useAnchorElement()
	const trigger = useScrollTrigger()

	return (
		<AppBar className={clsx('header', trigger ? 'with-background' : '')}>
			<Toolbar component='nav' className='navigation' {...props}>
				<a href='https://www.dreader.app' rel='noreferrer' target='_blank' className='company-logo-wrapper'>
					<Hidden smDown>
						<Image className='company-logo' src={logoWithTextImage} width={170} height={40} alt='dReader' />
					</Hidden>
					<Hidden smUp>
						<Image className='company-logo' src={logoImage} width={96} height={96} alt='dReader' />
					</Hidden>
				</a>

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
							className='navigation-items'
							PaperProps={{ className: 'mobile-menu' }}
							keepMounted
						>
							<MenuItem onClick={resetMenuAnchorEl}>
								<Button color='secondary' href='https://twitter.com/JosipVolarevic2' rel='noreferrer' target='_blank'>
									<TwitterIcon style={{ padding: 3 }} />
									Twitter
								</Button>
							</MenuItem>
							<MenuItem onClick={resetMenuAnchorEl}>
								<Button color='secondary' href='https://discord.gg/BfCqPu63ZX' rel='noreferrer' target='_blank'>
									<DiscordIcon />
									Discord
								</Button>
							</MenuItem>
						</Menu>
					</Hidden>
					{/* Desktop */}
					<Hidden smDown>
						<Button
							variant='contained'
							aria-label='twitter'
							href='https://twitter.com/JosipVolarevic2'
							rel='noreferrer'
							target='_blank'
						>
							<TwitterIcon style={{ padding: 3 }} />
						</Button>
						<Button
							variant='contained'
							aria-label='discord'
							href='https://discord.gg/BfCqPu63ZX'
							rel='noreferrer'
							target='_blank'
						>
							<DiscordIcon />
						</Button>
					</Hidden>
					<WalletButtonDynamic http={http} className='wallet-button' />
				</Box>
			</Toolbar>
		</AppBar>
	)
}

export default Navigation
