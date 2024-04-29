import React from 'react'
import Important from './ui/Important'
import ButtonLink from './ButtonLink'
import { RoutePath } from '@/enums/routePath'
import WenImage from 'public/assets/wen.png'
import Image from 'next/image'

type Props = {
	issueId: number | string
}

export const SignUpBanner: React.FC<Props> = ({ issueId }) => {
	return (
		<div className='sign-up-banner'>
			<div className='discount-section'>
				<div className='discount-text'>
					<span className='highlighed-text'>Registered users&nbsp;</span>
					<span>gets -10% off on every mint!</span>
				</div>
				<ButtonLink
					href={`${RoutePath.Login}?redirectTo=/mint/${issueId}`}
					clickableEffect={false}
					backgroundColor='transparent'
					className='action-button action-button--register login'
				>
					Don&apos;t have an account?&nbsp;<Important>Log in</Important>
				</ButtonLink>
			</div>
			<div className='right-section'>
				<Image className='wen-image' width={140} src={WenImage} alt='Wen Image' />
				<ButtonLink href={`${RoutePath.Register}?redirectTo=/mint/${issueId}`} noMinWidth className='sign-up-button'>
					Sign up
				</ButtonLink>
			</div>
		</div>
	)
}
