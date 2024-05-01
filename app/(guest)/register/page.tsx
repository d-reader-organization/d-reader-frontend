'use client'

import Header from 'components/layout/Header'
import Button from 'components/Button'
import Input from '@/components/forms/Input'
import LogoIcon from 'public/assets/vector-icons/logo-with-text.svg'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { RegisterData } from 'models/auth/register'
import { yupResolver } from '@hookform/resolvers/yup'
import { useRegisterGoogleUser, useRegisterUser } from 'api/auth'
import { RoutePath } from 'enums/routePath'
import { googleRegisterValidationSchema, registerValidationSchema } from '@/constants/schemas'
import Form from '@/components/forms/Form'
import usePrefetchRoute from '@/hooks/usePrefetchRoute'
import FormActions from '@/components/forms/FormActions'
import Label from '@/components/forms/Label'
import Steps from '@/components/ui/Steps'
import { useRedeemUserReferral } from '@/api/user'
import { useToaster } from '@/providers/ToastProvider'
import { Suspense } from 'react'
import GoogleLogoIcon from 'public/assets/vector-icons/google-logo.svg'
import { signIn } from 'next-auth/react'
import { useGoogleSessionCheck } from '@/hooks/useGoogleSessionCheck'
import { TermsOfServiceAndPrivacyPolicy } from '@/components/TosAndPPText'
import ButtonLink from '@/components/ButtonLink'
import Important from '@/components/ui/Important'

export default function RegisterUserPage() {
	const { push } = useRouter()
	const toaster = useToaster()
	const searchParams = useSearchParams()
	const referrer = searchParams.get('referrer') || ''
	const isRegisterWithGoogle = (searchParams.get('sso') ?? '') === 'google'
	const nextPage = `${RoutePath.RegisterConnectWallet}${searchParams.size ? `?${searchParams.toString()}` : ''}`
	const { mutateAsync: registerUser } = useRegisterUser()
	const { mutateAsync: registerGoogleUser } = useRegisterGoogleUser()
	const { mutateAsync: redeemReferral } = useRedeemUserReferral()
	const { register, handleSubmit } = useForm<RegisterData>({
		defaultValues: {
			name: '',
			email: '',
			password: '',
		},
		resolver: isRegisterWithGoogle
			? yupResolver(googleRegisterValidationSchema)
			: yupResolver(registerValidationSchema),
	})

	usePrefetchRoute(nextPage)
	useGoogleSessionCheck()

	const onSubmitClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault()

		handleSubmit(async (data) => {
			await (isRegisterWithGoogle ? registerGoogleUser(data) : registerUser(data))
			if (referrer) await redeemReferral(referrer)
			push(nextPage)
		}, toaster.onFormError)()
	}

	return (
		<Suspense>
			<Header image={<LogoIcon className='logo' />} />
			<Steps
				steps={[
					{ label: '01 Create account', isActive: true },
					{ label: '02 Connect wallet', isActive: false },
					...(isRegisterWithGoogle ? [] : [{ label: '03 Verify email', isActive: false }]),
				]}
			/>

			<main className='register-page'>
				{isRegisterWithGoogle ? <h1 className='title'>Set your details</h1> : <h1 className='title'>Welcome!</h1>}
				{/* <h1 className='title'>Join dReader</h1> */}
				<div style={{ marginTop: '2rem' }}></div>
				{isRegisterWithGoogle ? (
					<Form centered maxSize='xs' fullWidth className='form--register-user'>
						<Label>Username</Label>
						<p className='description'>3-20 chars. Numbers, dashes, underscores allowed</p>
						<Input {...register('name')} placeholder='john-doe' />

						<FormActions centered>
							<Button
								type='submit'
								onClick={onSubmitClick}
								backgroundColor='yellow-500'
								className='action-button action-button--register'
							>
								Register
							</Button>
						</FormActions>
						<TermsOfServiceAndPrivacyPolicy />
					</Form>
				) : (
					<Form centered maxSize='xs' fullWidth className='form--register-user'>
						<Button
							onClick={() => signIn('google')}
							type='button'
							backgroundColor='transparent'
							borderColor='grey-300'
							className='action-button google-button'
						>
							<GoogleLogoIcon className='google-icon' />
							Sign up with google
						</Button>

						<div className='divider'>or with</div>

						<Label>Username</Label>
						<p className='description'>3-20 chars. Numbers, dashes, underscores allowed</p>
						<Input {...register('name')} placeholder='john-doe' />

						<Label>Email</Label>
						<Input {...register('email')} placeholder='john.doe@dreader.io' />

						<Label>Password</Label>
						<p className='description'>8 characters minimum. At least 1 lowercase, 1 uppercase and 1 number</p>
						<Input {...register('password')} type='password' placeholder='********' />

						<FormActions centered>
							<Button
								type='submit'
								onClick={onSubmitClick}
								backgroundColor='yellow-500'
								className='action-button action-button--register'
							>
								Register
							</Button>
						</FormActions>
						<ButtonLink
							href={RoutePath.Login}
							clickableEffect={false}
							backgroundColor='transparent'
							className='action-button action-button--login'
						>
							Already have account?&nbsp;<Important>Log in</Important>
						</ButtonLink>
						<TermsOfServiceAndPrivacyPolicy />
					</Form>
				)}

				{/* <Box maxWidth='sm' margin='1rem auto'>
					<Link href={GOOGLE_PLAY_LINK} target='_blank'>
						<Image
							src={MobileAppBannerDesktop}
							width={480}
							height={171}
							alt='Download on Google Play'
							className='download-mobile-promo-banner'
						/>
					</Link>
				</Box> */}
			</main>
		</Suspense>
	)
}
