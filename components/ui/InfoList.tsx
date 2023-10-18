import Box, { BoxProps } from '@mui/material/Box'
import clsx from 'clsx'

interface Props extends BoxProps {
	orientation: 'horizontal' | 'vertical'
}

const InfoList: React.FC<Props> = ({ orientation = 'vertical', className, children, ...props }) => {
	return (
		<Box className={clsx('info-list', `info-list--${orientation}`, className)} {...props}>
			{children}
		</Box>
	)
}

export default InfoList
