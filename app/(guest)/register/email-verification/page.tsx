'use client'

import Header from 'components/layout/Header'
import LogoIcon from 'public/assets/vector-icons/logo-with-text.svg'
import MailIcon from 'public/assets/vector-icons/mail-icon.svg'
import Form from '@/components/forms/Form'
import FormActions from '@/components/forms/FormActions'
import ButtonLink from '@/components/ButtonLink'
import Button from '@/components/Button'
import Steps from '@/components/ui/Steps'
import { useRequestUserEmailVerification } from '@/api/user'
import useAuthenticatedRoute from '@/hooks/useUserAuthenticatedRoute'
import { RoutePath } from '@/enums/routePath'
import { useSearchParams } from 'next/navigation'
import FlexRow from '@/components/ui/FlexRow'

export default function EmailVerificationPage() {
	const { mutateAsync: requestUserEmailVerification } = useRequestUserEmailVerification()
	const searchParams = useSearchParams()
	const redirectTo = searchParams.get('redirectTo')

	useAuthenticatedRoute()

	return (
		<>
			<Header image={<LogoIcon className='logo' />} />
			<Steps
				steps={[
					{ label: '01 Create account', isActive: false },
					{ label: '02 Connect wallet', isActive: false },
					{ label: '03 Verify email', isActive: true },
				]}
			/>

			<main className='register-page'>
				<h1 className='title'>Check your mail</h1>
				<FlexRow>
					<MailIcon className='mail-icon' />
				</FlexRow>

				<Form centered fullWidth maxSize='sm' className='form--verify-email'>
					<p>
						Follow the simple instructions within the email to verify and become eligible for rewards. It might take up
						to 5 minutes to receive the mail
					</p>

					<FormActions centered>
						<ButtonLink href={redirectTo ?? RoutePath.Home} backgroundColor='yellow-500' className='action-button'>
							Next
						</ButtonLink>
					</FormActions>

					<p className='description'>
						Didn&apos;t get the email?
						<br />
						Check your spam folder{/* before resending */}
					</p>
					<Button
						onClick={async () => {
							await requestUserEmailVerification()
						}}
						bold={false}
						backgroundColor='transparent'
						className='action-button action-button--resend-email'
					>
						Resend email confirmation link
					</Button>
				</Form>
			</main>
		</>
	)
}
