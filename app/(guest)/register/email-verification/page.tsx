'use client'

import Header from 'components/layout/Header'
import LogoIcon from 'public/assets/vector-icons/logo-with-text.svg'
import MailIcon from 'public/assets/vector-icons/mail-icon.svg'
import Form from '@/components/forms/Form'
import FormActions from '@/components/forms/FormActions'
import ButtonLink from '@/components/ButtonLink'
import Steps from '@/components/Steps'
import { RoutePath } from '@/enums/routePath'
import Button from '@/components/Button'

export default function VerifyEmailPage() {
	return (
		<>
			<Header image={<LogoIcon className='logo' />} />
			<Steps
				steps={[
					{ label: '01 Create account', isActive: false },
					{ label: '02 Verify email', isActive: true },
					{ label: '03 Connect wallet', isActive: false },
				]}
			/>

			<main className='register-page'>
				<h1 className='title'>Check your mail</h1>
				<MailIcon className='mail-icon' />

				<Form centered fullWidth maxSize='sm' className='form--verify-email'>
					<p>
						Follow the simple instructions within the email to verify and become eligible for rewards. It might take up
						to 5 minutes to receive the mail
					</p>

					<FormActions centered>
						<ButtonLink href={RoutePath.RegisterConnectWallet} backgroundColor='yellow-500' className='action-button'>
							Next
						</ButtonLink>
					</FormActions>

					<p className='description'>
						Didn&apos;t get the email?
						<br />
						Check your spam folder{/* before resending */}
					</p>
					{false && (
						<Button
							onClick={() => {
								console.log('TODO: resend email confirmation')
							}}
							bold={false}
							backgroundColor='transparent'
							className='action-button action-button--resend-email'
						>
							Resend email confirmation link
						</Button>
					)}
				</Form>
			</main>
		</>
	)
}
