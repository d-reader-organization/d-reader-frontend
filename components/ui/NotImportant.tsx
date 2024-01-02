import { DetailedHTMLProps, HTMLAttributes } from 'react'

const NotImportant: React.FC<DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>> = ({
	children,
	...props
}) => {
	return (
		<span className='text--not-important' {...props}>
			{children}
		</span>
	)
}

export default NotImportant
