import React from 'react'
import { ContainerProps, Typography, Container, ButtonProps, Box, Button } from '@mui/material'
import clsx from 'clsx'

interface Props extends ContainerProps {
	title?: string
	actionProps?: ButtonProps
}

const Section: React.FC<Props> = ({ title, className, children, actionProps, ...props }) => {
	return (
		<Container maxWidth='lg' component='section' className={clsx('section', className)} {...props}>
			{title || actionProps ? (
				<Box className='section-title-row'>
					{title && (
						<Typography component='h2' variant='h5' className='section-title'>
							{title}
						</Typography>
					)}
					{actionProps && <Button {...actionProps} className={clsx('section-title-button', actionProps.className)} />}
				</Box>
			) : null}
			{children}
		</Container>
	)
}

export default Section
