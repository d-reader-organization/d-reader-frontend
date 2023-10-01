import { generateMaxLengthErrorMessage, generateMinLengthErrorMessage, yupRequiredMessage } from 'utils/error'
import * as yup from 'yup'

export const updateUserValidationSchema = yup.object().shape({
	description: yup.string().max(256, generateMaxLengthErrorMessage('description', 256)),
})

export const loginValidationSchema = yup.object().shape({
	nameOrEmail: yup.string().required(yupRequiredMessage('Email')),
	password: yup.string().required(yupRequiredMessage('Password')),
})

export const registerValidationSchema = yup.object().shape({
	name: yup
		.string()
		.required(yupRequiredMessage('Name'))
		.min(2, generateMinLengthErrorMessage('name', 2))
		.max(20, generateMaxLengthErrorMessage('name', 20)),
	email: yup.string().email().required(yupRequiredMessage('Email')),
	password: yup.string().required(yupRequiredMessage('Password')),
})
