import React from 'react'
import { Box, BoxProps, Grid, Button, Typography } from '@mui/material'
import DiscordIcon from 'public/assets/vector-icons/discord-icon.svg'
import TwitterIcon from 'public/assets/vector-icons/twitter-icon.svg'
import logoImage from 'public/assets/logo.png'
import Image from 'next/image'

const Footer: React.FC<BoxProps> = (props) => {
	return (
		<Box component='footer' className='footer' {...props}>
			<Grid container maxWidth='lg' margin='0 auto' className='footer-content'>
				<Grid item xs={12} md={4}>
					{/* <a href='https://www.dreader.io' rel='noreferrer' target='_blank'>
							<Image className='company-logo' src={logoImage} width={220} height={64} alt='dReader' />
						</a> */}
					<Typography variant='body2' className='company-name'>
						dReader
					</Typography>
					<Typography variant='body2'>&copy; dReader / {new Date().getFullYear()}</Typography>
				</Grid>

				<Grid item xs={12} md={4} className='footer-links-wrapper'>
					<Typography variant='body2' className='footer-links-title'>
						Join us on social media
					</Typography>
					<Box className='footer-links'>
						<Button aria-label='twitter' href='https://twitter.com/dreader'>
							<TwitterIcon />
						</Button>
						<Button aria-label='discord' href='https://discord.com/invite/dreader'>
							<DiscordIcon />
						</Button>
					</Box>
				</Grid>

				<Grid item xs={12} md={4}>
					<a href='https://www.dreader.io/' rel='noreferrer' target='_blank'>
						<Image className='footer-image' src={logoImage} alt='dReader' width={160} height={64} />{' '}
					</a>
				</Grid>
			</Grid>
		</Box>
	)
}

export default Footer
