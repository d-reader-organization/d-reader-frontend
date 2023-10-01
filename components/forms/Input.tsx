import { InputHTMLAttributes, forwardRef } from 'react'
import clsx from 'clsx'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
	prefix?: string
}

const Input = forwardRef<HTMLInputElement, Props>(({ className, prefix, ...props }, ref) => {
	return (
		<div className={clsx('input-wrapper', prefix && 'input-wrapper--prefix', className)}>
			{prefix && <div className='input-prefix'>{prefix}</div>}
			<input {...props} className='input' ref={ref} />
		</div>
	)
})

Input.displayName = 'Input'

export default Input
