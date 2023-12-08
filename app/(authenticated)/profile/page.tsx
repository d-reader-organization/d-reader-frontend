'use client'

import { useEffect, useState } from 'react'
import Container from '@mui/material/Container'
import Navigation from '@/components/layout/Navigation'
import useAuthenticatedRoute from '@/hooks/useUserAuthenticatedRoute'
import { UpdateUserData } from '@/models/user'
import {
	useFetchMe,
	useFetchUserWallets,
	useRedeemUserReferral,
	useRequestUserEmailVerification,
	useUpdateUser,
} from '@/api/user'
import { useToaster } from '@/providers/ToastProvider'
import { yupResolver } from '@hookform/resolvers/yup'
import { updateUserValidationSchema } from '@/constants/schemas'
import CloseIcon from 'public/assets/vector-icons/close.svg'
import { useForm } from 'react-hook-form'
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
import FlexRow from '@/components/FlexRow'
import Box from '@mui/material/Box'
import dynamic from 'next/dynamic'
import { WALLET_LABELS } from '@/constants/wallets'
import useAuthorizeWallet from '@/hooks/useAuthorizeWallet'
import { shortenString } from '@/utils/helpers'
import { useWallet } from '@solana/wallet-adapter-react'
import { useDisconnectUserWallet } from '@/api/auth'

const BaseWalletMultiButtonDynamic = dynamic(
	async () => (await import('@solana/wallet-adapter-react-ui')).BaseWalletMultiButton,
	{ ssr: false }
)

function ProfilePage() {
	const toaster = useToaster()
	const { publicKey } = useWallet()
	const [activeTab, setActiveTab] = useState('1')

	const { data: me } = useFetchMe()
	const { data: connectedWallets = [] } = useFetchUserWallets(me?.id || 0)

	const { mutateAsync: updateUser } = useUpdateUser(me?.id || 0)
	const { mutateAsync: requestUserEmailVerification } = useRequestUserEmailVerification()
	const { mutateAsync: redeemReferral } = useRedeemUserReferral()
	const { mutateAsync: disconnectWallet } = useDisconnectUserWallet()

	const { register, handleSubmit, reset } = useForm<UpdateUserData>({
		defaultValues: {
			email: '',
			name: '',
		},
		resolver: yupResolver(updateUserValidationSchema),
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
					<TabContext value={activeTab}>
						<TabList
							TabIndicatorProps={{ style: { backgroundColor: '#fceb54' } }}
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
							{/* <Tab
								label='Security'
								disableRipple
								value='2'
								className={clsx('tab-button', activeTab === '2' && 'tab-button--active')}
							/> */}
							<Tab
								label='Wallets'
								disableRipple
								value='3'
								className={clsx('tab-button', activeTab === '3' && 'tab-button--active')}
							/>
						</TabList>

						<TabPanel value='1'>
							<Form fullWidth maxSize='sm'>
								<div className='title-box'>
									<h2>Account settings</h2>
									<p>Manage your dReader user profile</p>
								</div>

								<div className='profile-settings-section'>Basic details</div>
								<Label isRequired>Email</Label>
								<div className='description'>If changed, verification email will be sent to the new address</div>
								<Input {...register('email')} placeholder={me?.email} />
								<Label isRequired>Username</Label>
								<div className='description'>
									Must be 2 to 20 characters long. Leters, numbers, and dashes are allowed
								</div>
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
						update email new endpoint
						update password
						security - privacy policy
						redeem-referral get input working (get user.referrer from backend)
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
						</TabPanel>

						{/* <TabPanel value='2'>
							<div className='title-box'>
								<h2>Security & Privacy</h2>
							</div>
						</TabPanel> */}
						<TabPanel value='3'>
							<Box maxWidth='sm'>
								<div className='title-box'>
									<h2>Manage wallets</h2>
									<p>
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
												<Button naked>
													<CloseIcon
														className='close-icon'
														onClick={async () => {
															await disconnectWallet(wallet.address)
														}}
													/>
												</Button>
											</li>
										)
									})}
									<li>
										<BaseWalletMultiButtonDynamic labels={WALLET_LABELS} />
									</li>
								</ul>
							</Box>
						</TabPanel>
					</TabContext>
				</Container>
			</main>
		</>
	)
}

export default ProfilePage
