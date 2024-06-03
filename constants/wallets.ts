import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets'
import { ledger } from './ledgerAdapter'

export const WALLET_LABELS = {
	'change-wallet': 'Change wallet',
	connecting: 'Connecting',
	'copy-address': 'Copy address',
	copied: 'Copied',
	disconnect: 'Disconnect',
	'has-wallet': 'Connect',
	'no-wallet': 'Connect',
} as const

export const getWallets = () => {
	if (typeof window === 'undefined') return []
	else return [new PhantomWalletAdapter(),new SolflareWalletAdapter(), ledger]
}
