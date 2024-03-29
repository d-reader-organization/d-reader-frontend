'use client'

import Header from 'components/layout/Header'
import Button from 'components/Button'
import Input from '@/components/forms/Input'
import LogoIcon from 'public/assets/vector-icons/logo-with-text.svg'
import MobileAppBannerDesktop from 'public/assets/mobile-app-banner-desktop.png'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { RegisterData } from 'models/auth/register'
import { yupResolver } from '@hookform/resolvers/yup'
import { useRegisterUser } from 'api/auth'
import { RoutePath } from 'enums/routePath'
import { registerValidationSchema } from '@/constants/schemas'
import { usernameTooltip } from '@/constants/tooltips'
import Form from '@/components/forms/Form'
import usePrefetchRoute from '@/hooks/usePrefetchRoute'
import FormActions from '@/components/forms/FormActions'
import Label from '@/components/forms/Label'
import Steps from '@/components/ui/Steps'
import { useRedeemUserReferral } from '@/api/user'
import Image from 'next/image'
import Link from 'next/link'
import { GOOGLE_PLAY_LINK } from '@/constants/links'
import { useToaster } from '@/providers/ToastProvider'

export default function RegisterUserPage() {
	const router = useRouter()
	const toaster = useToaster()
	const searchParams = useSearchParams()
	const referrer = searchParams.get('referrer') || ''
	const nextPage = RoutePath.RegisterConnectWallet

	const { mutateAsync: registerUser } = useRegisterUser()
	const { mutateAsync: redeemReferral } = useRedeemUserReferral()
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
			if (referrer) await redeemReferral(referrer)
			router.push(nextPage)
		}, toaster.onFormError)()
	}

	return (
		<>
			<Header image={<LogoIcon className='logo' />} />
			<Steps
				steps={[
					{ label: '01 Create account', isActive: true },
					{ label: '02 Connect wallet', isActive: false },
					{ label: '03 Verify email', isActive: false },
				]}
			/>

			<main className='register-page'>
				{/* <h1 className='title'>Welcome to dReader</h1> */}
				<div style={{ marginTop: '2rem' }}></div>
				<Form centered fullWidth maxSize='sm' className='form--register-user'>
					<Label isRequired tooltipText={usernameTooltip}>
						Username
					</Label>
					<p className='description'>2-20 characters. Letters, numbers, underscores, and dashes are allowed</p>
					<Input {...register('name')} placeholder='john-doe' />

					<Label isRequired>Email</Label>
					<Input {...register('email')} placeholder='john.doe@dreader.io' />

					<Label isRequired>Password</Label>
					<p className='description'>8 characters minimum. At least 1 lowercase, 1 uppercase and 1 number</p>
					<Input {...register('password')} type='password' placeholder='********' />

					<FormActions centered>
						<Button type='submit' onClick={onSubmitClick} backgroundColor='yellow-500' className='action-button'>
							Register
						</Button>
					</FormActions>

					<Link href={GOOGLE_PLAY_LINK} target='_blank'>
						<Image
							src={MobileAppBannerDesktop}
							width={480}
							height={171}
							alt='Download on Google Play'
							className='download-mobile-promo-banner'
						/>
					</Link>
				</Form>
			</main>
		</>
	)
}
