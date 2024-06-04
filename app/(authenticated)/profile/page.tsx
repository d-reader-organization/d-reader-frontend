'use client'

import { useEffect, useState } from 'react'
import Container from '@mui/material/Container'
import Navigation from '@/components/layout/Navigation'
import useAuthenticatedRoute from '@/hooks/useUserAuthenticatedRoute'
import AlphaBunnyIcon from 'public/assets/vector-icons/alpha-bunny-icon.svg'
import { UpdateUserAvatarData, UpdateUserData, UpdateUserPassword } from '@/models/user'
import { useFetchMe, useFetchUserWallets, useUpdateUser, useUpdateUserAvatar, useUpdateUserPassword } from '@/api/user'
import { useToaster } from '@/providers/ToastProvider'
import { yupResolver } from '@hookform/resolvers/yup'
import {
	updateUserAvatarValidationSchema,
	updateUserPasswordValidationSchema,
	updateUserValidationSchema,
} from '@/constants/schemas'
import CloseIcon from 'public/assets/vector-icons/close.svg'
import { Resolver, useForm } from 'react-hook-form'
import Label from '@/components/forms/Label'
import Input from '@/components/forms/Input'
import Form from '@/components/forms/Form'
import FormActions from '@/components/forms/FormActions'
import Button from '@/components/Button'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import clsx from 'clsx'
import FlexRow from '@/components/ui/FlexRow'
import Box from '@mui/material/Box'
import dynamic from 'next/dynamic'
import { WALLET_LABELS } from '@/constants/wallets'
import useAuthorizeWallet from '@/hooks/useAuthorizeWallet'
import { shortenString } from '@/utils/helpers'
import { useWallet } from '@solana/wallet-adapter-react'
import { useDisconnectUserWallet } from '@/api/auth'
import FileUpload from '@/components/forms/FileUpload'
import { imageTypes } from '@/constants/fileTypes'
import FlexColumn from '@/components/ui/FlexColumn'
import JoinTheBeta from '@/components/JoinTheBeta'
import { useUserAuth } from '@/providers/UserAuthProvider'
import Important from '@/components/ui/Important'
import FAQ from '@/components/FAQ'
import FaqLink from '@/components/ui/FaqLink'
import { useRequestUserEmailChange } from '@/api/user/queries/useRequestUserEmailChange'
import { ForgotPasswordDialog } from '@/components/dialogs/ForgotPasswordDialog'

const BaseWalletMultiButtonDynamic = dynamic(
	async () => (await import('@solana/wallet-adapter-react-ui')).BaseWalletMultiButton,
	{ ssr: false }
)

function ProfilePage() {
	const toaster = useToaster()
	const { publicKey } = useWallet()
	const [activeTab, setActiveTab] = useState('1')
	const { logout } = useUserAuth()

	const { data: me } = useFetchMe()
	const { data: connectedWallets = [] } = useFetchUserWallets(me?.id || 0)

	const { mutateAsync: updateUser } = useUpdateUser(me?.id || 0)
	const { mutateAsync: requestUserEmailChange } = useRequestUserEmailChange()
	const { mutateAsync: disconnectWallet } = useDisconnectUserWallet()
	const { mutateAsync: updateUserAvatar } = useUpdateUserAvatar(me?.id ?? 0)
	const { mutateAsync: updatePassword } = useUpdateUserPassword(me?.id ?? 0)

	const { register, handleSubmit, reset, formState } = useForm<UpdateUserData>({
		defaultValues: {
			email: '',
			name: '',
		},
		resolver: yupResolver(updateUserValidationSchema),
	})

	const {
		register: passwordRegister,
		handleSubmit: handlePasswordChangeSubmit,
		formState: passwordFormState,
	} = useForm<UpdateUserPassword>({
		defaultValues: {
			oldPassword: '',
			newPassword: '',
		},
		resolver: yupResolver(updateUserPasswordValidationSchema),
	})

	const {
		register: registerAvatarForm,
		setValue: setAvatarFormValue,
		handleSubmit: handleAvatarFormSubmit,
	} = useForm<UpdateUserAvatarData>({
		defaultValues: { avatar: undefined },
		resolver: yupResolver(updateUserAvatarValidationSchema) as Resolver<UpdateUserAvatarData>,
	})

	useAuthenticatedRoute()
	useAuthorizeWallet()

	useEffect(() => {
		if (me) {
			reset({
				email: me.email,
				name: me.name,
			})
		}
	}, [me, reset])

	const handleProfileUpdate = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault()

		handleSubmit(async (data) => {
			if (data.email && data.email !== me?.email) {
				await requestUserEmailChange({ newEmail: data.email })
			}
			if (data.name !== me?.name) {
				await updateUser({ name: data.name })
			}
		}, toaster.onFormError)()
	}

	const handleAvatarUpdateFormSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault()

		handleAvatarFormSubmit(async (data: UpdateUserAvatarData) => {
			const formData = new FormData()
			if (data.avatar) formData.append('avatar', data.avatar)
			await updateUserAvatar(formData)
		}, toaster.onFormError)()
	}

	const handlePasswordUpdate = (event: React.MouseEvent<HTMLButtonElement>) => {
		event.preventDefault()

		handlePasswordChangeSubmit(async (data) => {
			if (passwordFormState.isDirty) {
				await updatePassword(data)
			}
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
					<TabContext value={activeTab}>
						<TabList
							TabIndicatorProps={{ style: { backgroundColor: '#fceb54' } }}
							variant='scrollable'
							textColor='secondary'
							onChange={handleTabChange}
							aria-label=''
							className='tabs'
						>
							<Tab
								label='Account'
								disableRipple
								value='1'
								className={clsx('tab-button', activeTab === '1' && 'tab-button--active')}
							></Tab>
							<Tab
								label='Wallets'
								disableRipple
								value='2'
								className={clsx('tab-button', activeTab === '2' && 'tab-button--active')}
							/>
							<Tab
								label='Referrals'
								disableRipple
								value='3'
								className={clsx('tab-button', activeTab === '3' && 'tab-button--active')}
							/>
							<Tab
								label='Security'
								disableRipple
								value='4'
								className={clsx('tab-button', activeTab === '4' && 'tab-button--active')}
							/>
							<Tab
								label='FAQ'
								disableRipple
								value='5'
								className={clsx('tab-button', activeTab === '5' && 'tab-button--active')}
							/>
						</TabList>

						<TabPanel value='1'>
							{me && (
								<Box className='tab-content'>
									<div className='title-box'>
										<h2>Account settings</h2>
										<p className='subtitle'>Manage your dReader user profile</p>
									</div>
									<div className='profile-settings-section'>Assets</div>
									<Form fullWidth maxSize='sm'>
										<FlexRow mb={4}>
											<FlexColumn mr='auto'>
												<Label isRequired tooltipText={'test test'}>
													Update avatar image
												</Label>
												<p className='description'>Recommended size is 500 x 500px, 3mb max size</p>
												<Button
													bold={false}
													type='submit'
													onClick={handleAvatarUpdateFormSubmit}
													backgroundColor='grey-300'
													className='update-avatar-button'
												>
													Update
												</Button>
											</FlexColumn>
											<div className='profile-assets-upload'>
												<FileUpload
													id='avatar-upload'
													label='500x500'
													className='avatar-upload'
													onUpload={(files) => {
														setAvatarFormValue('avatar', files[0]?.file)
													}}
													ref={registerAvatarForm('avatar').ref}
													// TODO: fix the bug where it flashes the previewUrl image after hitting "update"
													previewUrl={me.avatar}
													options={{ accept: imageTypes, maxFiles: 1 }}
												/>
											</div>
										</FlexRow>
									</Form>
									<div className='profile-settings-section'>Basic details</div>
									<Form fullWidth>
										<Label isRequired>Email</Label>
										<p className='description'>If changed, verification email will be sent to the new address</p>
										<Input {...register('email')} placeholder={me.email} />
										<Label isRequired>Username</Label>
										<p className='description'>
											Must be 3 to 20 characters long. Leters, numbers, underscores, and dashes are allowed
										</p>
										<Input {...register('name')} placeholder={me.name} />
										<FormActions mobileColumn className='form-actions--mobile'>
											<Button
												bold={false}
												type='submit'
												onClick={handleProfileUpdate}
												backgroundColor={formState.isDirty ? 'yellow-500' : 'grey-300'}
												className='action-button'
											>
												Save
											</Button>
										</FormActions>
									</Form>
									<div className='profile-settings-section'>Change your password</div>
									<Form fullWidth>
										<Label isRequired>Current password</Label>
										<Input {...passwordRegister('oldPassword')} type='password' placeholder='********' />
										<Label isRequired>New password</Label>
										<Input {...passwordRegister('newPassword')} type='password' placeholder='********' />
										<p className='description'>8 characters minimum. At least 1 lowercase, 1 uppercase and 1 number</p>
										<ForgotPasswordDialog />
										<FormActions mobileColumn marginTop className='form-actions--mobile'>
											<Button
												bold={false}
												type='submit'
												onClick={handlePasswordUpdate}
												backgroundColor={passwordFormState.isDirty ? 'yellow-500' : 'grey-300'}
												className='action-button'
											>
												Submit
											</Button>
										</FormActions>
									</Form>
									<div className='profile-settings-section'>Other</div>

									<Button bold={false} onClick={logout}>
										Logout
									</Button>
								</Box>
							)}
						</TabPanel>

						<TabPanel value='2'>
							<Box className='tab-content'>
								<div className='title-box'>
									<h2>Manage wallets</h2>
									<p className='subtitle'>
										Link any wallet you wish to have connected with your account. This will allow you see all your
										comics & collectibles in one place.
									</p>
								</div>

								<ul className='wallet-list'>
									{connectedWallets.map((wallet) => {
										return (
											<li
												key={wallet.address}
												className={clsx(
													'wallet-item',
													wallet.address === publicKey?.toBase58() && 'wallet-item--active'
												)}
											>
												<span>{shortenString(wallet.address)}</span>
												<Button
													onClick={async () => {
														await disconnectWallet(wallet.address)
													}}
													naked
												>
													<CloseIcon className='close-icon' />
												</Button>
											</li>
										)
									})}
									<li className='wallet-item--button'>
										<BaseWalletMultiButtonDynamic labels={WALLET_LABELS} />
									</li>
								</ul>
							</Box>
						</TabPanel>
						<TabPanel value='3'>
							{me && (
								<Box className='tab-content'>
									<div className='title-box'>
										<FlexRow>
											<AlphaBunnyIcon style={{ height: 32, width: 'auto', marginRight: '1rem' }} />
											{!me.hasBetaAccess ? <h2>Claim referral</h2> : <h2>Invite your friends</h2>}
										</FlexRow>
										{!me.hasBetaAccess && (
											<p>
												🎁 Enter the username or wallet address of your referrer so they can claim the referral bonus.
											</p>
										)}
										{!me.hasBetaAccess && <JoinTheBeta inForm />}
									</div>
									<p>
										Referrals remaining: <strong>{me.referralsRemaining}</strong>
									</p>
									<p className='subtitle'>
										Onboarding people to the platform will make you eligible for rewards in the future!
									</p>
									<Button
										bold={false}
										backgroundColor='yellow-500'
										onClick={() => {
											navigator.clipboard.writeText(`https://dreader.app/register?referrer=${me.name}`)
											toaster.add('Referral link copied to clipboard', 'success')
										}}
									>
										copy referral link
									</Button>
								</Box>
							)}
						</TabPanel>

						<TabPanel value='4'>
							<Box className='tab-content'>
								<div className='title-box'>
									<h2>Security & Privacy</h2>
									<p className='subtitle'>Change your security settings and review the privacy policy here</p>
								</div>
							</Box>
						</TabPanel>

						<TabPanel value='5'>
							<Box className='tab-content'>
								<div className='title-box'>
									<h2>Frequent Questions</h2>
									<p className='subtitle'>
										If you&apos;d like to report your bug use the &nbsp;
										<Important>
											<FaqLink href='https://forms.gle/pXH2DFaVPyquv1Yv9'>bug report form</FaqLink>
										</Important>
									</p>
									<FAQ />
								</div>
							</Box>
						</TabPanel>
					</TabContext>
				</Container>
			</main>
		</>
	)
}

export default ProfilePage
