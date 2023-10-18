'use client'

import { useEffect } from 'react'
import LogoWithTextIcon from 'public/assets/vector-icons/logo-with-text.svg'
import { useFetchMe, useVerifyUserEmail } from '@/api/user'
import { useUserAuth } from '@/providers/UserAuthProvider'
import ArrowRightIcon from 'public/assets/vector-icons/arrow-right.svg'
import { RoutePath } from '@/enums/routePath'
import ButtonLink from '@/components/ButtonLink'
import FormActions from '@/components/forms/FormActions'

interface Params {
	verificationToken: string
}

export default function VerifyEmailPage({ params }: { params: Params }) {
	const verificationToken = params?.verificationToken
	const { isAuthenticated } = useUserAuth()

	const { data: creator, mutateAsync: verifyEmail } = useVerifyUserEmail()
	const { data: me } = useFetchMe()

	useEffect(() => {
		if (verificationToken) {
			verifyEmail(verificationToken)
		}
	}, [verificationToken, verifyEmail])

	const name = creator?.name || me?.name || ''

	return (
		<main className='verify-email-page'>
			<h1 className='title'>
				Welcome
				<br />
				<span className='subtitle'>{name}</span>
			</h1>
			<p className='description description--content'>
				Your email has been <span className='description--highlighted'>successfully verified</span>! Now lets get
				started and explore some awesome content!
			</p>

			<FormActions centered className='actions'>
				<ButtonLink
					href={isAuthenticated ? RoutePath.Home : RoutePath.Login}
					backgroundColor='yellow-500'
					className='action-button'
				>
					Start exploring <ArrowRightIcon className='action-button-icon' />
				</ButtonLink>
			</FormActions>

			<div className='footer'>
				<LogoWithTextIcon className='logo' />
				<p className='description'>
					dReader is a platform for discovering, reading, collecting, and trading digital comics.
				</p>
				<p className='description'>
					Sign in & <span className='description--highlighted'>start collecting</span>!
				</p>
			</div>
		</main>
	)
}
