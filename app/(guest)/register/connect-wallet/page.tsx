'use client'

import { useCallback, useEffect } from 'react'
import Header from 'components/layout/Header'
import LogoIcon from 'public/assets/vector-icons/logo-with-text.svg'
import Form from '@/components/forms/Form'
import FormActions from '@/components/forms/FormActions'
import ButtonLink from '@/components/ButtonLink'
import Steps from '@/components/Steps'
import { RoutePath } from '@/enums/routePath'
import Button from '@/components/Button'
import { BaseWalletMultiButton } from '@solana/wallet-adapter-react-ui'
import { WALLET_LABELS } from '@/constants/wallets'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { useConnectUserWallet } from '@/api/auth/queries/useConnectUserWallet'
import { useRequestWalletPassword } from '@/api/auth'
import { PublicKey, Transaction } from '@solana/web3.js'
import { useRouter } from 'next/navigation'
import bs58 from 'bs58'

export default function ConnectWalletPage() {
	const router = useRouter()

	const { wallet, publicKey, signMessage, signTransaction } = useWallet()
	const { connection } = useConnection()

	const { mutateAsync: requestWalletPassword } = useRequestWalletPassword()
	const { mutateAsync: connectUserWallet } = useConnectUserWallet()

	const authorizeWallet = useCallback(async () => {
		if (!publicKey) return

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
		router.push(RoutePath.Home)
	}, [
		publicKey,
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
					{ label: '02 Verify email', isActive: false },
					{ label: '03 Connect wallet', isActive: true },
				]}
			/>

			<main className='register-page'>
				<h1 className='title'>Connect wallet</h1>

				<Form centered fullWidth maxSize='sm' className='form--verify-email'>
					<p>Connect with your favorite Solana wallet to store digital comics & other collectibles.</p>

					<FormActions centered>
						<ButtonLink
							href={RoutePath.Home}
							backgroundColor='transparent'
							borderColor='grey-100'
							className='action-button'
						>
							Skip
						</ButtonLink>

						<BaseWalletMultiButton labels={WALLET_LABELS} />
					</FormActions>

					{false && (
						<Button
							onClick={() => {
								console.log('TODO: open a dialog')
							}}
							bold={false}
							backgroundColor='transparent'
							className='action-button action-button--why-wallet'
						>
							Why do I need a wallet?
						</Button>
					)}
				</Form>
			</main>
		</>
	)
}
