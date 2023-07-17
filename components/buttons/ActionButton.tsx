import { Button, ButtonProps } from '@mui/material'
import clsx from 'clsx'

const ActionButton: React.FC<ButtonProps> = ({ className, children, ...props }) => {
	return (
		<Button className={clsx('action-button', className)} variant='contained' {...props}>
			{children}
		</Button>
	)
}

export default ActionButton
