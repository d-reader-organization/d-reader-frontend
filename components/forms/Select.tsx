import { InputHTMLAttributes, forwardRef, useCallback, useMemo, useState } from 'react'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import Image from 'next/image'
import clsx from 'clsx'

import { SelectOption } from 'models/selectOption'
import DropdownIcon from 'public/assets/vector-icons/dropdown.svg'
import CloseIcon from 'public/assets/vector-icons/close.svg'

import Input from './Input'

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onSelect'> {
	options: SelectOption[]
	defaultSelectedOptions?: SelectOption[]
	onSelect: (selectedOptions: SelectOption[]) => void
	isSearchable?: boolean
	isMultipleSelect?: boolean
	unselectableIfAlreadySelected?: boolean
}

const Select = forwardRef<HTMLInputElement, Props>(
	(
		{
			options,
			defaultSelectedOptions = [],
			onSelect,
			className,
			isSearchable = false,
			isMultipleSelect = false,
			unselectableIfAlreadySelected = false,
			...props
		},
		ref
	) => {
		const [searchTerm, setSearchTerm] = useState(isMultipleSelect ? '' : defaultSelectedOptions[0]?.label ?? '')
		const [selectedOptions, setSelectedOptions] = useState<SelectOption[]>(defaultSelectedOptions)
		const [isDropdownOpen, setIsDropdownOpen] = useState(false)

		const filteredOptions = useMemo(
			() =>
				isSearchable
					? options.filter(
							(option) =>
								option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
								option.value.toLowerCase().includes(searchTerm.toLowerCase())
					  )
					: options,
			[isSearchable, options, searchTerm]
		)

		const handleSearchTermChange = (event: React.ChangeEvent<HTMLInputElement>) => {
			if (!isSearchable) return
			setSearchTerm(event.target.value)
		}

		const unselectOption = useCallback(
			(value: string): SelectOption[] => {
				const filteredOptions = selectedOptions.filter((option) => option.value !== value)
				setSelectedOptions(filteredOptions)
				return filteredOptions
			},
			[selectedOptions]
		)

		const checkIsOptionSelected = (value: string) => {
			return selectedOptions.some((selectedOption) => selectedOption.value === value)
		}

		const handleSelectOption = (value: string) => {
			const isOptionAlreadySelected = checkIsOptionSelected(value)

			const selectedOption = options.find((option) => option.value === value)

			if (!selectedOption) return

			if (!isMultipleSelect) setIsDropdownOpen(false)

			if (isOptionAlreadySelected && !unselectableIfAlreadySelected) {
				const updatedSelectedOptions = unselectOption(value)
				if (updatedSelectedOptions) onSelect(updatedSelectedOptions)
				setSearchTerm('')
				return
			}

			if (!isMultipleSelect && !isOptionAlreadySelected) {
				setSelectedOptions([selectedOption])
				onSelect([selectedOption])

				if (!isSearchable) setSearchTerm(selectedOption.label)

				return
			}

			setSelectedOptions((currentSelectedOptions) => [...currentSelectedOptions, selectedOption])
			onSelect([...selectedOptions, selectedOption])
		}

		const handleUnselectOption = (value: string) => {
			const isOptionAlreadySelected = checkIsOptionSelected(value)

			if (isOptionAlreadySelected) {
				const updatedSelectedOptions = unselectOption(value)
				if (updatedSelectedOptions) onSelect(updatedSelectedOptions)
			}
		}

		return (
			<div className={clsx('select', className)}>
				<ClickAwayListener onClickAway={() => setIsDropdownOpen(false)}>
					<div className='input-wrapper'>
						<div className='input-icon-wrapper'>
							<Input
								{...props}
								className={clsx('select-search', { 'select-search--disabled': !isSearchable })}
								ref={ref}
								onChange={handleSearchTermChange}
								onFocus={() => setIsDropdownOpen(true)}
								value={searchTerm}
							/>
							<DropdownIcon className={clsx('dropdown-icon', { 'dropdown-icon--open': isDropdownOpen })} />
						</div>
						{isDropdownOpen && (
							<div className='dropdown'>
								{filteredOptions.map((option) => (
									<div
										key={option.value}
										className={clsx('option', { 'option--selected': checkIsOptionSelected(option.value) })}
										onClick={() => handleSelectOption(option.value)}
									>
										{option.icon && <Image className='option-icon' src={option.icon} alt='' width='24' height='24' />}
										{option.label}
									</div>
								))}
							</div>
						)}
					</div>
				</ClickAwayListener>

				{isMultipleSelect && (
					<div>
						{selectedOptions.map((selectedOption) => (
							<span
								key={selectedOption.value}
								className='selected-option'
								onClick={() => handleUnselectOption(selectedOption.value)}
							>
								{selectedOption.icon && (
									<Image className='option-icon' src={selectedOption.icon} alt='' width='24' height='24' />
								)}
								{selectedOption.label} <CloseIcon className='selected-option-close-icon' />
							</span>
						))}
					</div>
				)}
			</div>
		)
	}
)

Select.displayName = 'Select'

export default Select
