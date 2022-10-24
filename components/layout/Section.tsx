import React from 'react'
import { ContainerProps, Typography, Container } from '@mui/material'

interface Props extends ContainerProps {
	title?: string
}

const Section: React.FC<Props> = ({ title, className, children, ...props }) => {
	return (
		<Container maxWidth='lg' component='section' className={`section ${className || ''}`} {...props}>
			{title ? (
				<Typography component='h1' variant='h3' className='section-title'>
					{title}
				</Typography>
			) : null}
			{children}
		</Container>
	)
}

export default Section
