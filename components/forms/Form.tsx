import { HTMLAttributes, DetailedHTMLProps } from 'react'
import clsx from 'clsx'

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLFormElement>, HTMLFormElement> {
	centered?: boolean
	padding?: boolean
	fullWidth?: boolean
	minSize?: 'xs' | 'sm' | 'md' | 'lg'
	maxSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

const Form: React.FC<Props> = ({
	centered = false,
	padding = false,
	fullWidth = false,
	minSize,
	maxSize,
	className,
	...props
}) => {
	return (
		<form
			className={clsx(className, 'form', {
				'form--base-padding': padding,
				'form--centered': centered,
				'form--min-xs': minSize === 'xs',
				'form--min-sm': minSize === 'sm',
				'form--min-md': minSize === 'md',
				'form--min-lg': minSize === 'lg',
				'form--max-xs': maxSize === 'xs',
				'form--max-sm': maxSize === 'sm',
				'form--max-md': maxSize === 'md',
				'form--max-lg': maxSize === 'lg',
				'form--max-xl': maxSize === 'xl',
				'form--max-content': !fullWidth,
				'form--width-100': fullWidth,
			})}
			{...props}
		/>
	)
}

export default Form
