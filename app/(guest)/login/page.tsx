'use client'

import Header from 'components/layout/Header'
import Button from 'components/Button'
import Input from '@/components/forms/Input'
import LogoIcon from 'public/assets/vector-icons/logo-with-text.svg'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useLoginUser } from 'api/auth'
import { RoutePath } from 'enums/routePath'
import { LoginData } from 'models/auth/login'
import { loginValidationSchema } from '@/components/forms/schemas'
import useGuestRoute from 'hooks/useUserGuestRoute'
import Form from '@/components/forms/Form'
import usePrefetchRoute from '@/hooks/usePrefetchRoute'
import ButtonLink from '@/components/ButtonLink'
import FormActions from '@/components/forms/FormActions'
import Label from '@/components/forms/Label'

export default function LoginPage() {
	const router = useRouter()
	const nextPage = RoutePath.Home

	const { mutateAsync: login } = useLoginUser()
	const { register, handleSubmit } = useForm<LoginData>({
		defaultValues: {
			nameOrEmail: '',
			password: '',
		},
		resolver: yupResolver(loginValidationSchema),
	})

	usePrefetchRoute(nextPage)
	useGuestRoute()

	const onSubmitClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault()

		handleSubmit(async (data) => {
			await login(data)
			router.push(nextPage)
		})()
	}

	return (
		<>
			<Header image={<LogoIcon className='logo' />} />

			<main className='login-page'>
				<h1 className='title'>Welcome</h1>
				<p className='subtitle'>let&apos;s get back to enjoying comics!</p>

				<Form padding centered maxSize='xs' fullWidth className='form--login-user'>
					<Label isRequired>Email or username</Label>
					<Input {...register('nameOrEmail')} type='email' placeholder='john.doe@dreader.io' />

					<Label isRequired>Password</Label>
					<Input {...register('password')} type='password' placeholder='********' />

					<FormActions column centered>
						<Button type='submit' onClick={onSubmitClick} backgroundColor='yellow-500' className='action-button'>
							Login
						</Button>

						<ButtonLink
							href={RoutePath.Register}
							clickableEffect={false}
							backgroundColor='transparent'
							className='action-button action-button--register'
						>
							No account? Register here
						</ButtonLink>
					</FormActions>
				</Form>
			</main>
		</>
	)
}
