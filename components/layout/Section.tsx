import React, { useRef } from 'react'
import { BoxProps, Typography, Box, Slide, ButtonProps, Button } from '@mui/material'
import Link from 'next/link'
import clsx from 'clsx'

interface Props extends BoxProps {
	title?: string
	actionProps?: ButtonProps<'a'>
	// actionProps?: LinkProps
	show?: boolean
	observationRef?: BoxProps['ref']
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
		<Box component='section' className={clsx('section', className)} {...props}>
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
							<Button
								component={Link}
								{...actionProps}
								className={clsx('section-title-button', actionProps.className)}
							/>
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
		</Box>
	)
}

export default Section
