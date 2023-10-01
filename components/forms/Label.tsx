import { LabelHTMLAttributes } from 'react'
import Tooltip from '@mui/material/Tooltip'
import clsx from 'clsx'

import InfoIcon from 'public/assets/vector-icons/info.svg'

interface Props extends LabelHTMLAttributes<HTMLLabelElement> {
	isRequired?: boolean
	size?: 'small' | 'normal'
	tooltipText?: React.ReactNode
	centered?: boolean
	children: React.ReactNode
}

const Label: React.FC<Props> = ({
	className,
	isRequired = false,
	centered = false,
	size = 'normal',
	tooltipText,
	children,
}) => {
	return (
		<label
			className={clsx('label', className, {
				'label--small': size === 'small',
				'label--centered': centered,
			})}
		>
			{children} {isRequired && '*'}
			{tooltipText && (
				<Tooltip classes={{ tooltip: 'tooltip-text' }} title={tooltipText} arrow={true} placement='top'>
					<div className='icon-wrapper'>
						<InfoIcon />
					</div>
				</Tooltip>
			)}
		</label>
	)
}

export default Label
