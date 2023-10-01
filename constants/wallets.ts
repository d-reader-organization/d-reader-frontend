import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { SolflareWalletAdapter } from '@solana/wallet-adapter-solflare'
import { phantomLedger } from './phantomLedgerAdapter'
// import {
// 	SolanaMobileWalletAdapter,
// 	createDefaultAddressSelector,
// 	createDefaultAuthorizationResultCache,
// 	createDefaultWalletNotFoundHandler,
// } from '@solana-mobile/wallet-adapter-mobile'

export const getWallets = (network: WalletAdapterNetwork) => {
	if (typeof window === 'undefined') return []
	else
		return [
			/**
			 * Wallets that implement either of these standards will be available automatically.
			 *   - Solana Mobile Stack Mobile Wallet Adapter Protocol
			 *     (https://github.com/solana-mobile/mobile-wallet-adapter)
			 *   - Solana Wallet Standard
			 *     (https://github.com/solana-labs/wallet-standard)
			 */
			new SolflareWalletAdapter({ network }),
			// new SolanaMobileWalletAdapter({
			// 	addressSelector: createDefaultAddressSelector(),
			// 	appIdentity: {
			// 		name: 'My app',
			// 		uri: 'https://myapp.io',
			// 		icon: 'relative/path/to/icon.png',
			// 	},
			// 	authorizationResultCache: createDefaultAuthorizationResultCache(),
			// 	cluster: network,
			// 	onWalletNotFound: createDefaultWalletNotFoundHandler(),
			// }),
			phantomLedger,
		]
}
