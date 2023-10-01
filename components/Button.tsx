import { ButtonHTMLAttributes, DetailedHTMLProps } from 'react'
import clsx from 'clsx'

export interface ButtonProps extends DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
	backgroundColor?: 'important' | 'transparent' | 'grey-100' | 'grey-300' | 'green-500' | 'yellow-500'
	borderColor?: 'important' | 'transparent' | 'grey-100' | 'grey-300'
	bold?: boolean
}

const Button: React.FC<ButtonProps> = ({
	backgroundColor = 'grey-100',
	borderColor = 'transparent',
	type = 'button',
	bold = true,
	className,
	...props
}) => {
	return (
		<button
			className={clsx(className, 'button', {
				'button--background-color-important': backgroundColor === 'important',
				'button--background-color-transparent': backgroundColor === 'transparent',
				'button--background-color-grey-100': backgroundColor === 'grey-100',
				'button--background-color-grey-300': backgroundColor === 'grey-300',
				'button--background-color-green-500': backgroundColor === 'green-500',
				'button--background-color-yellow-500': backgroundColor === 'yellow-500',
				'button--border-color-important': borderColor === 'important',
				'button--border-color-transparent': borderColor === 'transparent',
				'button--border-color-grey-100': borderColor === 'grey-100',
				'button--border-color-grey-300': borderColor === 'grey-300',
				'button--border-bold': bold,
			})}
			type={type}
			{...props}
		></button>
	)
}

export default Button
