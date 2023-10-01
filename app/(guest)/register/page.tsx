'use client'

import Header from 'components/layout/Header'
import Button from 'components/Button'
import Input from '@/components/forms/Input'
import LogoIcon from 'public/assets/vector-icons/logo-with-text.svg'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { RegisterData } from 'models/auth/register'
import { yupResolver } from '@hookform/resolvers/yup'
import { useRegisterUser } from 'api/auth'
import { RoutePath } from 'enums/routePath'
import { registerValidationSchema } from '@/components/forms/schemas'
import Form from '@/components/forms/Form'
import usePrefetchRoute from '@/hooks/usePrefetchRoute'
import FormActions from '@/components/forms/FormActions'
import Label from '@/components/forms/Label'
import { usernameTooltip } from '@/constants/tooltips'

export default function RegisterUserPage() {
	const router = useRouter()
	const nextPage = RoutePath.Home

	const { mutateAsync: registerUser } = useRegisterUser()
	const { register, handleSubmit } = useForm<RegisterData>({
		defaultValues: {
			name: '',
			email: '',
			password: '',
		},
		resolver: yupResolver(registerValidationSchema),
	})

	usePrefetchRoute(nextPage)

	const onSubmitClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault()

		handleSubmit(async (data) => {
			await registerUser(data)
			router.push(nextPage)
		})()
	}

	return (
		<>
			<Header image={<LogoIcon className='logo' />} />

			<main className='register-page'>
				<h1 className='title'>Welcome to dReader</h1>

				<Form padding centered fullWidth maxSize='sm' className='form--register-creator'>
					<Label isRequired tooltipText={usernameTooltip}>
						Username
					</Label>
					<div className='description'>Your username will be visible to dReader community</div>
					<Input {...register('name')} placeholder='John Doe' />

					<Label isRequired>Email</Label>
					<Input {...register('email')} placeholder='john.doe@dreader.io' />

					<Label isRequired>Password</Label>
					<div className='description'>8 characters minimum. At least 1 lowercase, 1 uppercase and 1 number</div>
					<Input {...register('password')} type='password' placeholder='********' />

					<FormActions centered>
						<Button type='submit' onClick={onSubmitClick} backgroundColor='yellow-500' className='action-button'>
							Register
						</Button>
					</FormActions>
				</Form>
			</main>
		</>
	)
}
