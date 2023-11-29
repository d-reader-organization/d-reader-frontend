'use client'

import { useCallback, useEffect } from 'react'
import Header from 'components/layout/Header'
import LogoIcon from 'public/assets/vector-icons/logo-with-text.svg'
import { WHAT_IS_A_WALLET, WHY_DO_I_NEED_A_WALLET } from '@/constants/staticText'
import CloseIcon from 'public/assets/vector-icons/close.svg'
import Form from '@/components/forms/Form'
import FormActions from '@/components/forms/FormActions'
import ButtonLink from '@/components/ButtonLink'
import Steps from '@/components/Steps'
import { RoutePath } from '@/enums/routePath'
import Button from '@/components/Button'
import { WALLET_LABELS } from '@/constants/wallets'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { useConnectUserWallet } from '@/api/auth/queries/useConnectUserWallet'
import { useRequestWalletPassword } from '@/api/auth'
import { PublicKey, Transaction } from '@solana/web3.js'
import useAuthenticatedRoute from '@/hooks/useUserAuthenticatedRoute'
import { useRouter } from 'next/navigation'
import Dialog from '@mui/material/Dialog'
import { useToggle } from '@/hooks'
import dynamic from 'next/dynamic'
import { useFetchMe, useFetchUserWallets } from '@/api/user'
import bs58 from 'bs58'

const BaseWalletMultiButtonDynamic = dynamic(
	async () => (await import('@solana/wallet-adapter-react-ui')).BaseWalletMultiButton,
	{ ssr: false }
)

export default function ConnectWalletPage() {
	const router = useRouter()
	const [whyWalletDialogOpen, toggleWhyWalletDialog] = useToggle()

	const { wallet, publicKey, signMessage, signTransaction } = useWallet()
	const { connection } = useConnection()

	const { mutateAsync: requestWalletPassword } = useRequestWalletPassword()
	const { mutateAsync: connectUserWallet } = useConnectUserWallet()

	const { data: me } = useFetchMe()
	const { data: connectedWallets = [], isLoading, isFetched } = useFetchUserWallets(me?.id || 0)

	const walletAddress = publicKey?.toBase58()
	const connectedWalletAddresses = connectedWallets.map((wallet) => wallet.address)
	const hasWalletConnected = !!walletAddress && connectedWalletAddresses.includes(walletAddress)

	useAuthenticatedRoute()

	const authorizeWallet = useCallback(async () => {
		if (!publicKey) return
		if (!isFetched || isLoading) return
		if (hasWalletConnected) {
			router.push(RoutePath.RegisterEmailVerification)
			return
		}

		const address = publicKey.toBase58()
		const otp = await requestWalletPassword(address)
		const message = new TextEncoder().encode(otp)

		let encoding = ''
		// If wallet supports message signing, go with that option
		if (signMessage && wallet?.adapter.name !== 'Ledger') {
			const signedMessage = await signMessage(message)
			encoding = bs58.encode(signedMessage)
		}
		// Otherwise sign a transaction with OTP stored in its instruction
		else if (signTransaction) {
			const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash()

			const transaction = new Transaction({ feePayer: publicKey, blockhash, lastValidBlockHeight }).add({
				keys: [],
				programId: PublicKey.default,
				data: Buffer.from(message),
			})

			const signedTransaction = await signTransaction(transaction)
			encoding = bs58.encode(signedTransaction.serialize())
		} else throw new Error('Wallet does not support message or transaction signing!')

		await connectUserWallet({ address, encoding })
		router.push(RoutePath.RegisterEmailVerification)
	}, [
		publicKey,
		isFetched,
		isLoading,
		hasWalletConnected,
		requestWalletPassword,
		signMessage,
		wallet?.adapter.name,
		signTransaction,
		connectUserWallet,
		router,
		connection,
	])

	// Trigger this useEffect only if it's not a mobile device
	// otherwise, show a "verify wallet" button or use a custom "Connect and Sign" button
	useEffect(() => {
		authorizeWallet()
	}, [authorizeWallet])

	return (
		<>
			<Header image={<LogoIcon className='logo' />} />
			<Steps
				steps={[
					{ label: '01 Create account', isActive: false },
					{ label: '02 Connect wallet', isActive: true },
					{ label: '03	 Verify email', isActive: false },
				]}
			/>

			<main className='register-page'>
				<h1 className='title'>Connect wallet</h1>

				<Form centered fullWidth maxSize='sm' className='form--verify-email'>
					<p>Connect with your favorite Solana wallet to store digital comics & other collectibles.</p>

					<FormActions centered>
						<ButtonLink
							href={RoutePath.RegisterEmailVerification}
							backgroundColor='transparent'
							borderColor='grey-100'
							className='action-button'
						>
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
