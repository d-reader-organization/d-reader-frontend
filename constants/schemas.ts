import { generateMaxLengthErrorMessage, generateMinLengthErrorMessage } from 'utils/error'
import * as yup from 'yup'

export const updateUserValidationSchema = yup.object().shape({
	email: yup.string().email(),
	name: yup
		.string()
		.min(2, generateMinLengthErrorMessage('name', 2))
		.max(20, generateMaxLengthErrorMessage('name', 20)),
})
