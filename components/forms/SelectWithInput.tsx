import React, { forwardRef, useState } from 'react'
import { cloneDeep } from 'lodash'

import { SelectOption } from 'models/selectOption'
import { SelectInputField } from 'models/selectInputField'
import CloseIcon from 'public/assets/vector-icons/close.svg'

import Input from './Input'
import Select from './Select'

interface Props {
	options: SelectOption[]
	onChange?: (inputs: SelectInputField[]) => void
}

const SelectWithInput = forwardRef<HTMLInputElement, Props>(({ options, onChange = () => {} }, ref) => {
	const [inputs, setInputs] = useState<SelectInputField[]>([])

	const handleSelect = (selectedOptions: SelectOption[]) => {
		const selectedOption = selectedOptions[0]
		setInputs((currentInputs) => {
			const newAuthor = {
				selectValue: selectedOption.value,
				inputValue: '',
			}
			const deepClonedCurrentInputs = cloneDeep(currentInputs)
			onChange([...deepClonedCurrentInputs, newAuthor])
			return [...deepClonedCurrentInputs, newAuthor]
		})
	}

	const handleRemoveInput = (indexToRemove: number) => {
		setInputs((currentInputs) => {
			const deepClonedCurrentInputs = cloneDeep(currentInputs)
			deepClonedCurrentInputs.splice(indexToRemove, 1)
			onChange(deepClonedCurrentInputs)
			return deepClonedCurrentInputs
		})
	}

	const onInputChange = (event: React.ChangeEvent<HTMLInputElement>, indexToEdit: number) => {
		setInputs((currentInputs) => {
			const deepClonedCurrentInputs = cloneDeep(currentInputs)
			const inputToEdit = deepClonedCurrentInputs[indexToEdit]
			if (inputToEdit) inputToEdit.inputValue = event.target.value
			onChange(deepClonedCurrentInputs)
			return deepClonedCurrentInputs
		})
	}

	return (
		<div className='select-with-input'>
			<Select ref={ref} options={options} onSelect={handleSelect} placeholder='Select a role' />
			<div>
				{inputs.map((input, index) => (
					<div className='input-row' key={index}>
						<span className='input-row-selected-value'>{input.selectValue}</span>
						<Input className='input' onChange={(event) => onInputChange(event, index)} />
						<CloseIcon
							className='close-icon'
							viewBox='0 0 8 8'
							width={14}
							height={14}
							onClick={() => handleRemoveInput(index)}
						/>
					</div>
				))}
			</div>
		</div>
	)
})

SelectWithInput.displayName = 'SelectWithInput'

export default SelectWithInput
