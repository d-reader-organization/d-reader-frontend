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

const GuestNavigation: React.FC<ToolbarProps> = (props) => {
	const trigger = useScrollTrigger({ threshold: 20, disableHysteresis: false })
	const { isAuthenticated } = useUserAuth()

	return (
		<AppBar className={clsx('header-navigation', trigger && 'header-navigation--blurred')}>
			<Toolbar component='nav'>
				<Link href={isAuthenticated ? RoutePath.Home : RoutePath.Login} className='company-logo-wrapper'>
					<Hidden smDown>
						<Image className='company-logo' src={logoWithTextImage} width={170} height={40} alt='dReader' />
					</Hidden>
					<Hidden smUp>
						<Image className='company-logo' src={logoImage} width={30} height={30} alt='dReader' />
					</Hidden>
				</Link>
			</Toolbar>
		</AppBar>
	)
}

export default GuestNavigation
