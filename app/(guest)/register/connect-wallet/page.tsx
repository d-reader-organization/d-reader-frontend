'use client'

import { useCallback } from 'react'
import Header from 'components/layout/Header'
import LogoIcon from 'public/assets/vector-icons/logo-with-text.svg'
import { WHAT_IS_A_WALLET, WHY_DO_I_NEED_A_WALLET } from '@/constants/staticText'
import CloseIcon from 'public/assets/vector-icons/close.svg'
import Form from '@/components/forms/Form'
import FormActions from '@/components/forms/FormActions'
import ButtonLink from '@/components/ButtonLink'
import Steps from '@/components/ui/Steps'
import { RoutePath } from '@/enums/routePath'
import Button from '@/components/Button'
import { WALLET_LABELS } from '@/constants/wallets'
import { useWallet } from '@solana/wallet-adapter-react'
import useAuthenticatedRoute from '@/hooks/useUserAuthenticatedRoute'
import { useRouter, useSearchParams } from 'next/navigation'
import Dialog from '@mui/material/Dialog'
import { useToggle } from '@/hooks'
import dynamic from 'next/dynamic'
import { useFetchMe, useFetchUserWallets } from '@/api/user'
import useAuthorizeWallet from '@/hooks/useAuthorizeWallet'

const BaseWalletMultiButtonDynamic = dynamic(
	async () => (await import('@solana/wallet-adapter-react-ui')).BaseWalletMultiButton,
	{ ssr: false }
)

export default function ConnectWalletPage() {
	const { push } = useRouter()
	const [whyWalletDialogOpen, toggleWhyWalletDialog] = useToggle()
	const searchParams = useSearchParams()
	const { publicKey } = useWallet()

	const { data: me } = useFetchMe()
	const { data: connectedWallets = [] } = useFetchUserWallets(me?.id || 0)

	const walletAddress = publicKey?.toBase58()
	const connectedWalletAddresses = connectedWallets.map((wallet) => wallet.address)
	const hasWalletConnected = !!walletAddress && connectedWalletAddresses.includes(walletAddress)
	const isRegisterWithGoogle = (searchParams.get('sso') ?? '') === 'google'
	const queryParams = searchParams.size ? `?${searchParams.toString()}` : ''
	const redirectTo = searchParams.get('redirectTo')
	const nextPage = isRegisterWithGoogle
		? redirectTo ?? RoutePath.Home
		: `${RoutePath.RegisterEmailVerification}${queryParams}`

	const moveToNextPage = useCallback(() => {
		push(nextPage)
	}, [push, nextPage])

	useAuthenticatedRoute()
	useAuthorizeWallet(moveToNextPage)

	if (hasWalletConnected) {
		push(nextPage)
		return
	}

	return (
		<>
			<Header image={<LogoIcon className='logo' />} />
			<Steps
				steps={[
					{ label: '01 Create account', isActive: false },
					{ label: '02 Connect wallet', isActive: true },
					...(isRegisterWithGoogle ? [] : [{ label: '03 Verify email', isActive: false }]),
				]}
			/>

			<main className='register-page'>
				<h1 className='title'>Connect wallet</h1>

				<Form centered fullWidth maxSize='sm' className='form--verify-email'>
					<p>Connect with your favorite Solana wallet to store digital comics & other collectibles.</p>

					<FormActions centered>
						<ButtonLink href={nextPage} backgroundColor='transparent' borderColor='grey-100' className='action-button'>
							Skip
						</ButtonLink>

						<BaseWalletMultiButtonDynamic labels={WALLET_LABELS} />
					</FormActions>

					<Button
						onClick={toggleWhyWalletDialog}
						bold={false}
						backgroundColor='transparent'
						className='action-button action-button--why-wallet'
					>
						Why do I need a wallet?
					</Button>

					<Dialog
						style={{ backdropFilter: 'blur(4px)' }}
						open={whyWalletDialogOpen}
						onClose={toggleWhyWalletDialog}
						PaperProps={{ className: 'text-dialog' }}
					>
						<div className='close-icon-wrapper'>
							<CloseIcon className='close-icon' onClick={toggleWhyWalletDialog} />
						</div>
						<strong>What is a wallet?</strong>
						{WHAT_IS_A_WALLET}
						<p />
						<strong>Why do I need a wallet?</strong>
						{WHY_DO_I_NEED_A_WALLET}
					</Dialog>
				</Form>
			</main>
		</>
	)
}
