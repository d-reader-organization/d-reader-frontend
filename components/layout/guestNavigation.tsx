import React from 'react'
import Toolbar, { ToolbarProps } from '@mui/material/Toolbar'
import Hidden from '@mui/material/Hidden'
import AppBar from '@mui/material/AppBar'
import useScrollTrigger from '@mui/material/useScrollTrigger'
import logoWithTextImage from 'public/assets/logo-with-text-colored.png'
import logoImage from 'public/assets/logo.png'
import { RoutePath } from 'enums/routePath'
import Image from 'next/image'
import Link from 'next/link'
import clsx from 'clsx'
import { useUserAuth } from '@/providers/UserAuthProvider'
import { Theme, useMediaQuery } from '@mui/material'
import dynamic from 'next/dynamic'
import { WALLET_LABELS } from '@/constants/wallets'

const BaseWalletMultiButtonDynamic = dynamic(
	async () => (await import('@solana/wallet-adapter-react-ui')).BaseWalletMultiButton,
	{ ssr: false }
)

const GuestNavigation: React.FC<ToolbarProps> = () => {
	const trigger = useScrollTrigger({ threshold: 20, disableHysteresis: false })
	const { isAuthenticated } = useUserAuth()
	const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))

	return (
		<AppBar className={clsx('header-navigation', trigger && 'header-navigation--blurred', 'guest-navigation')}>
			<Toolbar component='nav' className='guest-navigation'>
				<Link href={isAuthenticated ? RoutePath.Home : RoutePath.Login} className='company-logo-wrapper'>
					<Hidden smDown>
						<Image className='company-logo' src={logoWithTextImage} width={170} height={40} alt='dReader' />
					</Hidden>
					<Hidden smUp>
						<Image className='company-logo' src={logoImage} width={30} height={30} alt='dReader' />
					</Hidden>
				</Link>
				{!isMobile ? <BaseWalletMultiButtonDynamic style={{ fontSize: '17px' }} labels={WALLET_LABELS} /> : null}
			</Toolbar>
		</AppBar>
	)
}

export default GuestNavigation
