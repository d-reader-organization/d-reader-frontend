import React, { useRef } from 'react'
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
	const titleRef = useRef(null)

	return (
		<Container maxWidth='lg' component='section' className={clsx('section', className)} {...props}>
			{title || actionProps ? (
				<Box className='section-title-row' ref={titleRef}>
					{title && (
						<Slide container={titleRef.current} in={show} direction='right'>
							<Typography component='h2' variant='h6' className='section-title'>
								{title}
							</Typography>
						</Slide>
					)}
					{actionProps && (
						<Slide container={titleRef.current} in={show} direction='left'>
							<Button {...actionProps} className={clsx('section-title-button', actionProps.className)} />
						</Slide>
					)}
				</Box>
			) : null}
			{children}

			<Box
				position='absolute'
				zIndex={-100}
				top={0}
				left={0}
				right={0}
				bottom={0}
				margin='auto'
				// width='100%'
				height={{
					xs: `calc(100% - ${60}px)`,
					sm: `calc(100% - ${80}px)`,
					md: `calc(100% - ${100}px)`,
					lg: `calc(100% - ${120}px)`,
				}}
				ref={observationRef}
			/>
		</Container>
	)
}

export default Section
