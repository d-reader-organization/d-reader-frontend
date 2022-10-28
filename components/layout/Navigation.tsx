import React from 'react'
import { ToolbarProps, Toolbar, Button, Hidden, Box, Menu, MenuItem } from '@mui/material'
import HomeIcon from 'public/assets/vector-icons/home-icon.svg'
import DiscordIcon from 'public/assets/vector-icons/discord-icon.svg'
import TwitterIcon from 'public/assets/vector-icons/twitter-icon.svg'
import SocialIcon from 'public/assets/vector-icons/social-icon.svg'
import useAnchorElement from 'hooks/useAnchorElement'
import dynamic from 'next/dynamic'

const WalletMultiButtonDynamic = dynamic(
	async () => (await import('@solana/wallet-adapter-material-ui')).WalletMultiButton,
	{ ssr: false }
)

const Navigation: React.FC<ToolbarProps> = (props) => {
	const [menuAnchorEl, setMenuAnchorEl, resetMenuAnchorEl] = useAnchorElement()

	return (
		<Toolbar color='primary' component='nav' className='navigation' {...props}>
			<Box className='navigation-items navigation-items--left'>
				<Button variant='contained' href='https://www.dreader.io/' rel='noreferrer' target='_blank'>
					<HomeIcon />
				</Button>
			</Box>

			<Box className='navigation-items navigation-items--right'>
				{/* Mobile */}
				<Hidden smUp>
					<Button variant='contained' aria-label='social-media' onClick={setMenuAnchorEl}>
						<SocialIcon />
					</Button>
					<Menu
						anchorEl={menuAnchorEl}
						open={Boolean(menuAnchorEl)}
						onClose={resetMenuAnchorEl}
						className='navigation-items navigation-items--right'
						PaperProps={{ className: 'mobile-menu' }}
						keepMounted
					>
						<MenuItem onClick={resetMenuAnchorEl}>
							<Button color='secondary' href='https://twitter.com/dreader' rel='noreferrer' target='_blank'>
								<TwitterIcon />
								Twitter
							</Button>
						</MenuItem>
						<MenuItem onClick={resetMenuAnchorEl}>
							<Button color='secondary' href='https://discord.com/invite/dreader' rel='noreferrer' target='_blank'>
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
						href='https://twitter.com/dreader'
						rel='noreferrer'
						target='_blank'
					>
						<TwitterIcon />
					</Button>
					<Button
						variant='contained'
						aria-label='discord'
						href='https://discord.com/invite/dreader'
						rel='noreferrer'
						target='_blank'
					>
						<DiscordIcon />
					</Button>
				</Hidden>
				<WalletMultiButtonDynamic className='wallet-button' />
			</Box>
		</Toolbar>
	)
}

export default Navigation
