import React from 'react'
import { ContainerProps, Typography, Container, ButtonProps, Box, Button, Slide } from '@mui/material'
import clsx from 'clsx'

interface Props extends ContainerProps {
	title?: string
	actionProps?: ButtonProps
	show?: boolean
	observationRef?: ContainerProps['ref']
}

const Section: React.FC<Props> = ({
	title,
	className,
	children,
	actionProps,
	observationRef,
	show = true,
	...props
}) => {
	return (
		<Container maxWidth='lg' component='section' className={clsx('section', className)} {...props}>
			{title || actionProps ? (
				<Box className='section-title-row'>
					{title && (
						<Slide in={show} direction='right'>
							<Typography component='h2' variant='h6' className='section-title'>
								{title}
							</Typography>
						</Slide>
					)}
					{actionProps && (
						<Slide in={show} direction='left'>
							<Button {...actionProps} className={clsx('section-title-button', actionProps.className)} />
						</Slide>
					)}
				</Box>
			) : null}
			{children}

			<Box
				position='absolute'
				top={0}
				left={0}
				right={0}
				bottom={0}
				margin='auto'
				width='100%'
				height={{
					xs: `calc(100% - ${60}px)`,
					sm: `calc(100% - ${80}px)`,
					md: `calc(100% - ${100}px)`,
					lg: `calc(100% - ${120}px)`,
					// xs: `calc(100% - ${80}px)`,
					// sm: `calc(100% - ${100}px)`,
					// md: `calc(100% - ${120}px)`,
					// lg: `calc(100% - ${140}px)`,
				}}
				ref={observationRef}
			/>
		</Container>
	)
}

export default Section
