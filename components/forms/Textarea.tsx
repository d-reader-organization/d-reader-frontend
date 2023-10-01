import { TextareaHTMLAttributes, forwardRef, useState } from 'react'
import clsx from 'clsx'

interface Props extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'defaultValue'> {
	maxCharacters?: number
	defaultValue?: string
}

const Textarea = forwardRef<HTMLTextAreaElement, Props>(
	({ className, onChange, maxCharacters = 200, defaultValue = '', ...props }, ref) => {
		const [value, setValue] = useState(defaultValue)

		const remainingCharactersCount = maxCharacters - value.split('').filter((character) => character !== ' ').length

		const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
			const hasFreeCharacters = remainingCharactersCount > 0 || event.target.value.length < value.length

			if (hasFreeCharacters) setValue(hasFreeCharacters ? event.target.value : value)
			if (onChange) onChange(event)
		}

		return (
			<div className='textarea-wrapper'>
				<textarea {...props} className={clsx('textarea', className)} onChange={handleChange} ref={ref} />
				<div className='remaining-characters'>{remainingCharactersCount} characters remaining</div>
			</div>
		)
	}
)

Textarea.displayName = 'Textarea'

export default Textarea
