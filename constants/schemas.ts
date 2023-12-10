import { generateMaxLengthErrorMessage, generateMinLengthErrorMessage, yupRequiredMessage } from 'utils/error'
import * as yup from 'yup'

export const updateUserValidationSchema = yup.object().shape({
	email: yup.string().email(),
	name: yup
		.string()
		.min(2, generateMinLengthErrorMessage('name', 2))
		.max(20, generateMaxLengthErrorMessage('name', 20)),
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

export const updateUserAvatarValidationSchema = yup.object().shape({
	avatar: yup.mixed(),
})
