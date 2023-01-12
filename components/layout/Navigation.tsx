import React from 'react'
import { ToolbarProps, Toolbar, Button, Hidden, Box, Menu, MenuItem } from '@mui/material'
import logoWithTextImage from 'public/assets/logo-with-text.png'
import logoImage from 'public/assets/logo.png'
import DiscordIcon from 'public/assets/vector-icons/discord-icon.svg'
import TwitterIcon from 'public/assets/vector-icons/twitter-icon.svg'
import SocialIcon from 'public/assets/vector-icons/social-icon.svg'
import useAnchorElement from 'hooks/useAnchorElement'
import { Web3MobileWallet } from '@solana-mobile/mobile-wallet-adapter-protocol-web3js'
import { useAuth, useServerAuthorization, Account, removeAuthHeaders, lsRemoveWalletAuth } from '@open-sauce/solomon'
import { SolanaMobileWalletAdapterWalletName } from '@solana-mobile/wallet-adapter-mobile'
import { useWallet } from '@solana/wallet-adapter-react'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import http from 'api/http'

const WalletMultiButtonDynamic = dynamic(
	async () => (await import('@solana/wallet-adapter-material-ui')).WalletMultiButton,
	{ ssr: false }
)

const MobileWalletMultiButtonDynamic = dynamic(
	async () => await (await import('@open-sauce/solomon')).MobileWalletMultiButton,
	{ ssr: false }
)

const Navigation: React.FC<ToolbarProps> = (props) => {
	const { setIsAuthenticated } = useAuth()
	const [menuAnchorEl, setMenuAnchorEl, resetMenuAnchorEl] = useAnchorElement()
	const { mobileConnect } = useServerAuthorization(http)
	const { wallet } = useWallet()
	const isMobileWallet = wallet?.adapter.name === SolanaMobileWalletAdapterWalletName

	const onAuthorize = async (mobileWallet: Web3MobileWallet, account: Account) => {
		// TODO: deprecate setIsAuthenticated(true)
		setIsAuthenticated(true)
		return await mobileConnect(mobileWallet, account)
	}

	const onDeauthorize = (account: Account) => {
		removeAuthHeaders(http)
		if (account?.address) lsRemoveWalletAuth(account.address)
		// TODO: setIsAuthenticated(false)
	}

	return (
		<Toolbar
			component='nav'
			className='navigation'
			sx={{
				padding: {
					xs: '1rem',
					sm: '2rem 2rem 3rem 2rem',
					md: '2rem 3rem',
					lg: '3rem 4rem',
				},
			}}
			{...props}
		>
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
					<Button variant='contained' aria-label='social-media' onClick={setMenuAnchorEl}>
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
				{isMobileWallet ? (
					<MobileWalletMultiButtonDynamic
						className='wallet-button'
						onAuthorize={onAuthorize}
						onDeauthorize={onDeauthorize}
					/>
				) : (
					<WalletMultiButtonDynamic variant='contained' className='wallet-button' />
				)}
			</Box>
		</Toolbar>
	)
}

export default Navigation
