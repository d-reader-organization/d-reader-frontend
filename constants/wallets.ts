import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets'
import { ledger } from './ledgerAdapter'
import { network } from './environment'
import { tiplinkWalletAdpater } from './tiplinkAdapter'

export const WALLET_LABELS = {
	'change-wallet': 'Change wallet',
	connecting: 'Connecting',
	'copy-address': 'Copy address',
	copied: 'Copied',
	disconnect: 'Disconnect',
	'has-wallet': 'Connect',
	'no-wallet': 'Connect',
} as const