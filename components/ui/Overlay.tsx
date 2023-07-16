import { Box, BoxProps } from '@mui/material'
import clsx from 'clsx'

const Overlay: React.FC<BoxProps> = ({ className, ...props }) => {
	return <Box className={clsx('overlay', className)} {...props} />
}

export default Overlay
