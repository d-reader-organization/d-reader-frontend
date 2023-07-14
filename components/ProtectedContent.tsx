import { useAuth } from '@open-sauce/solomon'
import { Box, BoxProps } from '@mui/material'

const ProtectedContent: React.FC<BoxProps> = ({ children, ...props }) => {
	const { isAuthenticated } = useAuth()

	if (!isAuthenticated) {
		return (
			<Box maxWidth='xl' {...props}>
				<Box py={14} px={4}>
					Please connect your wallet
				</Box>
			</Box>
		)
	} else return <Box {...props}>{children}</Box>
}

export default ProtectedContent
