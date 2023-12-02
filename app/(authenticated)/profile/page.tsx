'use client'

import { useEffect, useState } from 'react'
import Container from '@mui/material/Container'
import Navigation from '@/components/layout/Navigation'
import useAuthenticatedRoute from '@/hooks/useUserAuthenticatedRoute'
import { UpdateUserData } from '@/models/user'
import { useFetchMe, useRedeemUserReferral, useRequestUserEmailVerification, useUpdateUser } from '@/api/user'
import { useToaster } from '@/providers/ToastProvider'
import { yupResolver } from '@hookform/resolvers/yup'
import { updateUserValidationSchema } from '@/constants/schemas'
import { useForm } from 'react-hook-form'
import Label from '@/components/forms/Label'
import Input from '@/components/forms/Input'
import Form from '@/components/forms/Form'
import FormActions from '@/components/forms/FormActions'
import Button from '@/components/Button'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import clsx from 'clsx'
import FlexRow from '@/components/FlexRow'

function ProfilePage() {
	const toaster = useToaster()
	const [activeTab, setActiveTab] = useState('1')

	const { data: me } = useFetchMe()
	const { mutateAsync: updateUser } = useUpdateUser(me?.id || 0)
	const { mutateAsync: requestUserEmailVerification } = useRequestUserEmailVerification()
	const { mutateAsync: redeemReferral } = useRedeemUserReferral()

	const { register, handleSubmit, reset } = useForm<UpdateUserData>({
		defaultValues: {
			email: '',
			name: '',
		},
		resolver: yupResolver(updateUserValidationSchema),
	})

	useAuthenticatedRoute()

	useEffect(() => {
		if (me) {
			reset({
				email: me.email,
				name: me.name,
			})
		}
	}, [me, reset])

	const onSubmitClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault()

		handleSubmit(async (data) => {
			await updateUser(data)
		}, toaster.onFormError)()
	}

	const handleTabChange = async (_: React.SyntheticEvent, newValue: string) => {
		setActiveTab(newValue)
	}

	return (
		<>
			<Navigation />
			<main className='profile-page'>
				<Container className='profile-page-container' disableGutters maxWidth='lg'>
					<Tabs
						TabIndicatorProps={{ style: { backgroundColor: '#fceb54' } }}
						textColor='secondary'
						value={activeTab}
						onChange={handleTabChange}
						aria-label=''
						className='tabs'
					>
						<Tab
							label='Account'
							disableRipple
							value='1'
							className={clsx('tab-button', activeTab === '1' && 'tab-button--active')}
						/>
						<Tab
							label='Security'
							disableRipple
							value='2'
							className={clsx('tab-button', activeTab === '2' && 'tab-button--active')}
						/>
						<Tab
							label='Wallets'
							disableRipple
							value='3'
							className={clsx('tab-button', activeTab === '3' && 'tab-button--active')}
						/>
					</Tabs>

					<Form fullWidth maxSize='sm'>
						<h2 className='title'>Account settings</h2>
						<div className='profile-settings-section'>Basic details</div>
						<Label isRequired>Email</Label>
						<div className='description'>If changed, verification email will be sent to the new address</div>
						<Input {...register('email')} placeholder={me?.email} />
						<Label isRequired>Username</Label>
						<div className='description'>Must be 2 to 20 characters long. Leters, numbers, and dashes are allowed</div>
						<Input {...register('name')} placeholder={me?.name} />
						<FormActions mobileColumn className='form-actions--mobile'>
							{!me?.isEmailVerified && (
								<Button
									onClick={async () => {
										await requestUserEmailVerification()
									}}
									bold={false}
									className='action-button'
								>
									Resend verification email
								</Button>
							)}
							<Button
								bold={false}
								type='submit'
								onClick={onSubmitClick}
								backgroundColor='yellow-500'
								className='action-button'
							>
								Save
							</Button>
						</FormActions>
						<div className='profile-settings-section'>Other</div>
						{/*
						TODO: Avatar
						update password
						security - privacy policy
						redeem-referral get input working (get user.referrer from backend)
						connect wallets
						logout button
						*/}
						<Label isRequired>Referrer</Label>
						<div className='description'>
							Type in the username, email, or wallet address from your referrer to unlock all the features
						</div>
						<FlexRow className='input-row'>
							<Input placeholder='username or wallet address' />
							<Button
								onClick={async () => {
									await redeemReferral('')
								}}
								bold={false}
								backgroundColor='yellow-500'
								className='action-button'
							>
								Redeem
							</Button>
						</FlexRow>
					</Form>
				</Container>
			</main>
		</>
	)
}

export default ProfilePage
