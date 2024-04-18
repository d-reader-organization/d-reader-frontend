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
import CloseIcon from 'public/assets/vector-icons/close.svg'
import FormActions from '@/components/forms/FormActions'
import Label from '@/components/forms/Label'
import Image from 'next/image'
import Link from 'next/link'
import { GOOGLE_PLAY_LINK } from '@/constants/links'
import Box from '@mui/material/Box'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { useToaster } from '@/providers/ToastProvider'
import { useRequestUserPasswordReset } from '@/api/user/queries/useRequestUserPasswordReset'
import { useToggle } from '@/hooks'
import Dialog from '@mui/material/Dialog'
import { useState } from 'react'
import GoogleLogoIcon from 'public/assets/vector-icons/google-logo.svg'
import { signIn } from 'next-auth/react'
import Important from '@/components/ui/Important'
import { useGoogleSessionCheck } from '@/hooks/useGoogleSessionCheck'

export default function LoginPage() {
	const [isFirstTimeLogin, setIsFirstTimeLogin] = useLocalStorage('firstTimeLogin', true)
	const [passwordDialogOpen, togglePasswordDialog] = useToggle()
	const [forgotPasswordEmailOrName, setForgotPasswordEmailOrName] = useState('')
	const toaster = useToaster()
	const { push } = useRouter()
	const nextPage = RoutePath.Home

	const { mutateAsync: login } = useLoginUser()
	const { mutateAsync: requestPasswordReset } = useRequestUserPasswordReset()

	const { register, handleSubmit } = useForm<LoginData>({
		defaultValues: {
			nameOrEmail: '',
			password: '',
		},
		resolver: yupResolver(loginValidationSchema),
	})
	useGoogleSessionCheck()
	usePrefetchRoute(nextPage)
	useGuestRoute()

	const onSubmitClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault()

		handleSubmit(async (data) => {
			await login(data)
			setIsFirstTimeLogin(false)
			push(nextPage)
		}, toaster.onFormError)()
	}

	const handleForgotPasswordEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setForgotPasswordEmailOrName(event.target.value)
	}

	return (
		<>
			<Header image={<LogoIcon className='logo' />} />

			<main className='login-page'>
				<h1 className='title'>Welcome back</h1>

				<Form centered maxSize='xs' fullWidth className='form--login-user'>
					<Button
						onClick={() => signIn('google')}
						type='button'
						backgroundColor='transparent'
						borderColor='grey-300'
						className='action-button'
					>
						<GoogleLogoIcon className='google-icon' />
						Sign in with google
					</Button>

					<div className='divider'>or with</div>

					<Label isRequired>Email or username</Label>
					<Input {...register('nameOrEmail')} placeholder='john.doe@dreader.io' />

					<Label isRequired>Password</Label>
					<Input {...register('password')} type='password' placeholder='********' />

					<FormActions column centered>
						<Button type='submit' onClick={onSubmitClick} backgroundColor='yellow-500' className='action-button'>
							Login
						</Button>

						<Button
							onClick={togglePasswordDialog}
							type='button'
							backgroundColor='transparent'
							borderColor='grey-300'
							className='action-button'
						>
							Forgot password?
						</Button>
						<ButtonLink
							href={RoutePath.Register}
							clickableEffect={false}
							backgroundColor='transparent'
							className='action-button action-button--register'
						>
							Don&apos;t have an account?&nbsp;<Important>Register here</Important>
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

				<Dialog
					style={{ backdropFilter: 'blur(4px)' }}
					PaperProps={{ className: 'action-dialog forgot-password-dialog' }}
					onClose={togglePasswordDialog}
					maxWidth='xs'
					open={passwordDialogOpen}
				>
					<div className='close-icon-wrapper'>
						<CloseIcon className='close-icon' onClick={togglePasswordDialog} />
					</div>

					<div className='dialog-content'>
						<strong>Reset password</strong>
						<p>
							Type in your email address to send password reset instructions to your mail inbox. Make sure to check your
							spam folder!
						</p>
						<Input
							type='text'
							placeholder='john.doe@dreader.io'
							className='forgot-password-input'
							value={forgotPasswordEmailOrName}
							onChange={handleForgotPasswordEmailChange}
						/>
					</div>

					<div className='dialog-actions'>
						<Button naked onClick={togglePasswordDialog}>
							Cancel
						</Button>
						<Button
							naked
							onClick={async () => {
								await requestPasswordReset({ nameOrEmail: forgotPasswordEmailOrName })
								setForgotPasswordEmailOrName('')
								togglePasswordDialog()
							}}
						>
							Send
						</Button>
					</div>
				</Dialog>
			</main>
		</>
	)
}
