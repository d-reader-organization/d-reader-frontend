import { InputHTMLAttributes, forwardRef } from 'react'
import clsx from 'clsx'

import CloseIcon from 'public/assets/vector-icons/close.svg'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
	checked?: boolean
	onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const Checkbox = forwardRef<HTMLInputElement, Props>(
	({ checked = false, className = '', onChange = () => {}, ...props }, ref) => {
		return (
			<label className={clsx('checkbox', className)}>
				<input {...props} type='checkbox' checked={checked} onChange={onChange} ref={ref} />
				{checked && <CloseIcon className='checked-icon' viewBox='0 0 8 8' width={10} height={10} />}
			</label>
		)
	}
)

Checkbox.displayName = 'Checkbox'

export default Checkbox
