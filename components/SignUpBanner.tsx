import React from 'react'
import Important from './ui/Important'
import ButtonLink from './ButtonLink'
import { RoutePath } from '@/enums/routePath'
import WenImageSrc from 'public/assets/wen.png'
import Image from 'next/image'
import { useMediaQuery } from '@mui/material'
import { Theme } from '@mui/material/styles'

type Props = {
	issueId: number | string
}

const LoginLink: React.FC<Props> = ({ issueId }) => {
	return (
		<ButtonLink
			href={`${RoutePath.Login}?redirectTo=/mint/${issueId}`}
			clickableEffect={false}
			backgroundColor='transparent'
			className='action-button action-button--register login'
		>
			Already have account?&nbsp;<Important>Log in</Important>
		</ButtonLink>
	)
}

const SignUpButton: React.FC<Props> = ({ issueId }) => {
	return (
		<ButtonLink href={`${RoutePath.Register}?redirectTo=/mint/${issueId}`} noMinWidth className='sign-up-button'>
			Sign up
		</ButtonLink>
	)
}

const WenImage: React.FC = () => {
	return <Image className='wen-image' src={WenImageSrc} alt='Wen Image' />
}

const DiscountSection: React.FC<Props> = ({ issueId }) => {
	const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
	return (
		<div className='discount-section'>
			<div className='discount-text'>
				<span className='highlighed-text'>Registered users&nbsp;</span>
				<span>gets -10% off on every mint!</span>
			</div>
			{!isMobile ? <LoginLink issueId={issueId} /> : null}
		</div>
	)
}

export const SignUpBanner: React.FC<Props> = ({ issueId }) => {
	const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
	return (
		<div className='sign-up-banner'>
			<DiscountSection issueId={issueId} />
			<WenImage />
			<SignUpButton issueId={issueId} />
			{isMobile ? <LoginLink issueId={issueId} /> : null}
		</div>
	)
}
