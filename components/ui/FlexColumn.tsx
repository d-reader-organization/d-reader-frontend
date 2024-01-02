import Box, { BoxProps } from '@mui/material/Box'
import clsx from 'clsx'

interface Props extends BoxProps {
	centered?: boolean
}

const FlexColumn: React.FC<Props> = ({ className, centered, ...props }) => {
	return <Box className={clsx('column', className)} alignItems={centered ? 'center' : undefined} {...props} />
}

export default FlexColumn
