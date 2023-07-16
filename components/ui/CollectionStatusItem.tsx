import { TypographyProps, Typography } from '@mui/material'
import clsx from 'clsx'

interface Props extends TypographyProps<React.ElementType> {
	label: string
	value: React.ReactNode
	orientation?: 'horizontal' | 'vertical'
}

const CollectionStatusItem: React.FC<Props> = ({ label, value, orientation = 'horizontal', className, ...props }) => {
	return (
		<Typography
			className={clsx('collection-status-item', `collection-status-item--${orientation}`, className)}
			{...props}
		>
			<span className='collection-status-label'>{label}</span>
			<span className='collection-status-value'>{value}</span>
		</Typography>
	)
}

export default CollectionStatusItem
