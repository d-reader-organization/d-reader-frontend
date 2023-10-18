'use client'

import { RoutePath } from 'enums/routePath'
import LogoWithTextIcon from 'public/assets/vector-icons/logo-with-text.svg'
import LogoIcon from 'public/assets/vector-icons/logo.svg'
import useGuestRoute from '@/hooks/useUserGuestRoute'
import FormActions from '@/components/forms/FormActions'
import ButtonLink from '@/components/ButtonLink'

export default function Welcome() {
	useGuestRoute()

	return (
		<main className='welcome-page'>
			<LogoWithTextIcon className='logo' />

			<h1 className='title'>Hop into the new age of comics!</h1>
			<p className='description'>
				Enjoy & collect premium comics from various indie creators, publishers, brands, and projects. Help us shape the
				future of the comic industry!
			</p>

			<FormActions className='actions'>
				<ButtonLink href={RoutePath.Login} backgroundColor='yellow-500' className='action-button' bold>
					<LogoIcon className='mini-logo' /> Jump in!
				</ButtonLink>
			</FormActions>

			<div>
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
