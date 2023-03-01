import { Grid, GridProps } from '@mui/material'
import clsx from 'clsx'

type Props = Omit<GridProps, 'container' | 'item' | 'style'> & { animate?: boolean; itemOrder: number }

const AnimatedGridItem: React.FC<Props> = ({ className, children, animate = false, itemOrder, ...props }) => {
	return (
		<Grid
			item
			className={clsx(className, 'theme-slideX-left', animate ? 'theme-slideX-animate' : '')}
			style={{ transitionDelay: animate ? `${(itemOrder + 1) * 100}ms` : '0ms' }}
			{...props}
		>
			{children}
		</Grid>
	)
}

export default AnimatedGridItem
