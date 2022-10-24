import React from 'react'
import { BoxProps, Box } from '@mui/material'

const Main: React.FC<BoxProps> = ({ children, ...props }) => {
	return (
		<Box component='main' {...props}>
			{children}
		</Box>
	)
}

export default Main
