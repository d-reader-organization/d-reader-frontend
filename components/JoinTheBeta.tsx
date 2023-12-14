'use client'

import { useState } from 'react'
import TwitterIcon from 'public/assets/vector-icons/twitter-icon.svg'
import DiscordIcon from 'public/assets/vector-icons/discord-icon.svg'
import AlphaBunnyIcon from 'public/assets/vector-icons/alpha-bunny-icon.svg'
import Container, { ContainerProps } from '@mui/material/Container'
import ButtonLink from '@/components/ButtonLink'
import Form from '@/components/forms/Form'
import FlexRow from '@/components/FlexRow'
import Input from '@/components/forms/Input'
import Button from '@/components/Button'
import { useRedeemUserReferral } from '@/api/user/queries/useRedeemUserReferral'
import { DISCORD_LINK, TWITTER_LINK } from '@/constants/links'

interface Props extends ContainerProps {
	inForm?: boolean
}

const JoinTheBeta: React.FC<Props> = ({ inForm = false, ...props }) => {
	const { mutateAsync: redeemReferral } = useRedeemUserReferral()
	const [referrer, setReferrer] = useState('')

	const handleReferrerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setReferrer(event.target.value)
	}

	return (
		<Container
			maxWidth={!inForm ? 'xs' : undefined}
			style={{ marginTop: inForm ? 0 : '3rem' }}
			className='join-the-beta-page'
			disableGutters
			{...props}
		>
			{!inForm && (
				<>
					<AlphaBunnyIcon style={{ width: 160, height: 'auto', margin: '0 auto' }} />
					<h1 className='title'>Join the beta</h1>
				</>
			)}
			<Form fullWidth>
				{!inForm && (
					<p className='description'>
						Type in the username or the wallet address from your referrer to claim beta access
					</p>
				)}
				<FlexRow className='input-row'>
					<Input placeholder='username or wallet address' onChange={handleReferrerChange} name='invite-code' />
					<Button
						onClick={async () => {
							if (referrer) await redeemReferral(referrer)
						}}
						bold={false}
						backgroundColor='yellow-500'
						className='action-button'
					>
						Redeem
					</Button>
				</FlexRow>
			</Form>
			<div className='links-container'>
				<p className='links-container-title'>Don&apos;t have the code?</p>
				<p className='description'>
					Find a referrer or connect with us on social media to find out if there any invite codes available!
				</p>
				<FlexRow>
					<ButtonLink
						className='invite-button'
						noMinWidth
						backgroundColor='grey-600'
						borderColor='grey-300'
						href={TWITTER_LINK}
					>
						<TwitterIcon className='button-icon' />
						Twitter
					</ButtonLink>
					<ButtonLink
						className='invite-button'
						noMinWidth
						backgroundColor='grey-600'
						borderColor='grey-300'
						href={DISCORD_LINK}
					>
						<DiscordIcon className='button-icon' />
						Discord
					</ButtonLink>
				</FlexRow>
			</div>
		</Container>
	)
}

export default JoinTheBeta
