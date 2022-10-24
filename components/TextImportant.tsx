import React from 'react'
import { Typography, TypographyProps } from '@mui/material'

const TextImportant: React.FC<TypographyProps> = ({ children, className, ...props }) => {
	return (
		<Typography component='span' className={`text--important ${className || ''}`} {...props}>
			{children}
		</Typography>
	)
}

export default TextImportant
