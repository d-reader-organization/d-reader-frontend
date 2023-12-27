'use client'

import Header from 'components/layout/Header'
import Button from 'components/Button'
import Input from '@/components/forms/Input'
import LogoIcon from 'public/assets/vector-icons/logo-with-text.svg'
import MobileAppBannerDesktop from 'public/assets/mobile-app-banner-desktop.png'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useLoginUser } from 'api/auth'
import { RoutePath } from 'enums/routePath'
import { LoginData } from 'models/auth/login'
import { loginValidationSchema } from '@/constants/schemas'
import useGuestRoute from 'hooks/useUserGuestRoute'
import Form from '@/components/forms/Form'
import usePrefetchRoute from '@/hooks/usePrefetchRoute'
import ButtonLink from '@/components/ButtonLink'
import FormActions from '@/components/forms/FormActions'
import Label from '@/components/forms/Label'
import Image from 'next/image'
import Link from 'next/link'
import { GOOGLE_PLAY_LINK } from '@/constants/links'
import Box from '@mui/material/Box'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useToaster } from '@/providers/ToastProvider'

export default function LoginPage() {
	const [isFirstTimeLogin, setIsFirstTimeLogin] = useLocalStorage('firstTimeLogin', true)

	const toaster = useToaster()
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
			setIsFirstTimeLogin(false)
			router.push(nextPage)
		}, toaster.onFormError)()
	}

	return (
		<>
			<Header image={<LogoIcon className='logo' />} />

			<main className='login-page'>
				<h1 className='title'>Welcome</h1>
				<p className='subtitle'>let&apos;s get back to enjoying comics!</p>

				<Form centered maxSize='xs' fullWidth className='form--login-user'>
					<Label isRequired>Email or username</Label>
					<Input {...register('nameOrEmail')} placeholder='john.doe@dreader.io' />

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

				{isFirstTimeLogin && (
					<Box maxWidth='sm' margin='1rem auto'>
						<Link href={GOOGLE_PLAY_LINK} target='_blank'>
							<Image
								src={MobileAppBannerDesktop}
								width={480}
								height={171}
								alt='Download on Google Play'
								className='download-mobile-promo-banner'
							/>
						</Link>
					</Box>
				)}
			</main>
		</>
	)
}
