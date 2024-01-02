import { DetailedHTMLProps, HTMLAttributes } from 'react'

const Important: React.FC<DetailedHTMLProps<HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>> = ({
	children,
	...props
}) => {
	return (
		<span className='text--important' {...props}>
			{children}
		</span>
	)
}

export default Important
