import React, { forwardRef } from 'react'

import PlusIcon from 'public/assets/vector-icons/plus.svg'
import MinusIcon from 'public/assets/vector-icons/minus.svg'
import Button from '../Button'

interface Props {
	value?: number
	min?: number
	max?: number
	onChange?: (step: number) => void
	valueSufix?: string
}

const IntegerInput = forwardRef<HTMLInputElement, Props>(
	({ value = 0, min = 0, max = 1000, onChange, valueSufix }, ref) => {
		const handleChange = (event: React.MouseEvent<HTMLButtonElement>, step: number) => {
			event.preventDefault()
			if (onChange) onChange(step)
		}

		return (
			<div className='number-input-wrapper'>
				<Button
					backgroundColor='transparent'
					borderColor='grey-300'
					className='number-input-button'
					onClick={(event) => handleChange(event, -1)}
					disabled={value === min}
				>
					<MinusIcon />
				</Button>
				<input
					ref={ref}
					onChange={() => {}}
					value={valueSufix ? `${value} ${valueSufix}` : value}
					className='number-input-value'
				/>
				<Button
					backgroundColor='transparent'
					borderColor='grey-300'
					className='number-input-button'
					onClick={(event) => handleChange(event, 1)}
					disabled={value === max}
				>
					<PlusIcon />
				</Button>
			</div>
		)
	}
)

IntegerInput.displayName = 'IntegerInput'

export default IntegerInput
