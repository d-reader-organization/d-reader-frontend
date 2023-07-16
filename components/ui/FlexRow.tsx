import { Box, BoxProps } from '@mui/material'
import clsx from 'clsx'

interface Props extends BoxProps {
	centered?: boolean
}

const FlexRow: React.FC<Props> = ({ className, centered, ...props }) => {
	return <Box className={clsx('row', className)} alignItems={centered ? 'center' : undefined} {...props} />
}

export default FlexRow
