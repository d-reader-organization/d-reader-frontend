'use client'

import { endpoint } from '@/constants/environment'
import { getWallets } from '@/constants/wallets'
import { ThemeProvider } from '@mui/material/styles'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { createContext, useContext } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { usePathname } from 'next/navigation'
import { RoutePath } from '@/enums/routePath'
import { useLocalStorage } from '@/hooks/useLocalStorage'
import { IMPORTANT_NOTICE } from '@/constants/staticText'
import CloseIcon from 'public/assets/vector-icons/close.svg'
import Dialog from '@mui/material/Dialog'
import theme from 'app/styles/theme'

export const ClientContext = createContext(null)

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnWindowFocus: true,
			refetchOnMount: false,
			refetchOnReconnect: false,
			retry: 1,
			staleTime: 10 * 1000, // stale for 10 seconds
		},
	},
})

const ClientContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const pathname = usePathname()
	const autoConnect = pathname.startsWith(RoutePath.ComicIssue('')) // only autoconnect on /comic-issue screens
	const [isFirstTimeVisitor, setIsFirstTimeVisitor] = useLocalStorage('firstTimeVisitor', true)

	// TODO: if there is a user connected and if there is a wallet connected
	// check if the wallet is assigned to the user on backend and if not, prompt to sign a message

	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider theme={theme}>
				<ConnectionProvider endpoint={endpoint}>
					<WalletProvider wallets={getWallets()} autoConnect={autoConnect}>
						<WalletModalProvider className='wallet-dialog'>
							{children}
							<Dialog
								style={{ backdropFilter: 'blur(4px)' }}
								PaperProps={{ className: 'text-dialog' }}
								onClose={() => setIsFirstTimeVisitor(false)}
								open={isFirstTimeVisitor}
							>
								<div className='close-icon-wrapper'>
									<CloseIcon className='close-icon' onClick={() => setIsFirstTimeVisitor(false)} />
								</div>
								<strong>🚧 IMPORTANT NOTICE! 🚧</strong>
								<p>{IMPORTANT_NOTICE}</p>
							</Dialog>
						</WalletModalProvider>
					</WalletProvider>
				</ConnectionProvider>
			</ThemeProvider>
		</QueryClientProvider>
	)
}

export default ClientContextProvider

export const useToaster = (): null => useContext(ClientContext)
