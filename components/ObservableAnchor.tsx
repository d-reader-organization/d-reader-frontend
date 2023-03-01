import { Box, BoxProps } from '@mui/material'

interface Props extends BoxProps {
	anchorRef: BoxProps['ref']
}

const ObservableAnchor: React.FC<Props> = ({ anchorRef, ...props }) => {
	return (
		<Box
			position='absolute'
			top={0}
			left={0}
			right={0}
			bottom={0}
			margin='auto'
			width='100%'
			height={{
				xs: `calc(100% - ${80}px)`,
				sm: `calc(100% - ${100}px)`,
				md: `calc(100% - ${120}px)`,
				lg: `calc(100% - ${140}px)`,
			}}
			ref={anchorRef}
			{...props}
		/>
	)
}

export default ObservableAnchor
