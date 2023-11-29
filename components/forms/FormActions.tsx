import { HTMLAttributes, DetailedHTMLProps } from 'react'
import clsx from 'clsx'

interface Props extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
	centered?: boolean
	column?: boolean
	mobileColumn?: boolean
	marginTop?: boolean
}

const FormActions: React.FC<Props> = ({
	centered = false,
	column = false,
	mobileColumn = false,
	marginTop = false,
	className,
	...props
}) => {
	return (
		<div
			className={clsx(className, 'form-actions', {
				'form-actions--centered': centered,
				'form-actions--column': column,
				'form-actions--mobile-column': mobileColumn,
				'form-actions--margin-top': marginTop,
			})}
			{...props}
		/>
	)
}

export default FormActions
