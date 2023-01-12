import React from 'react'
import { Box, BoxProps, Typography } from '@mui/material'
import logoImage from 'public/assets/logo.png'
import Image from 'next/image'

const Footer: React.FC<BoxProps> = (props) => {
	return (
		<Box component='footer' className='footer' {...props}>
			<Box className='footer-copyright'>
				<Image className='company-logo' src={logoImage} width={96} height={96} alt='dReader' />
				<Typography variant='body2'>&copy; dReader / {new Date().getFullYear()}</Typography>
			</Box>
		</Box>
	)
}

export default Footer
