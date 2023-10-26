'use client'

import ButtonLink from '@/components/ButtonLink'
import LogoWithTextIcon from 'public/assets/vector-icons/logo-with-text.svg'
import ArrowRightIcon from 'public/assets/vector-icons/arrow-right.svg'
import FormActions from '@/components/forms/FormActions'
import { useUserAuth } from '@/providers/UserAuthProvider'
import { RoutePath } from '@/enums/routePath'
import { useRouter } from 'next/navigation'
import Button from '@/components/Button'

export default function PageNotFound() {
	const router = useRouter()
	const { isAuthenticated } = useUserAuth()

	return (
		<main className='not-found-page'>
			<h1 className='title'>Page not found</h1>
			<p className='description'>
				The page you were looking for was <span className='description--highlighted'>not found</span>!
			</p>

			<FormActions centered className='actions'>
				{isAuthenticated ? (
					<>
						<Button
							onClick={() => {
								router.back()
							}}
							backgroundColor='grey-100'
							className='action-button'
						>
							Go Back
						</Button>
						<ButtonLink href={RoutePath.Home} backgroundColor='yellow-500' className='action-button'>
							Home
							<ArrowRightIcon className='action-button-icon' />
						</ButtonLink>
					</>
				) : (
					<>
						<ButtonLink href={RoutePath.Register} backgroundColor='grey-100' className='action-button'>
							Register
						</ButtonLink>
						<ButtonLink href={RoutePath.Login} backgroundColor='yellow-500' className='action-button'>
							Login
						</ButtonLink>
					</>
				)}
			</FormActions>

			<div className='footer'>
				<LogoWithTextIcon className='logo' />
				<p className='description'>
					dReader is a platform for discovering, trading, <span className='description--highlighted'>collecting</span>,
					and reading digital comics.
				</p>
				<p className='description'>Sign in & start exploring!</p>
			</div>
		</main>
	)
}
