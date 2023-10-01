'use client'

import { endpoint, network } from '@/constants/environment'
import { getWallets } from '@/constants/wallets'
import { ThemeProvider } from '@mui/material/styles'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { createContext, useContext } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
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
	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider theme={theme}>
				<ConnectionProvider endpoint={endpoint}>
					<WalletProvider wallets={getWallets(network)} autoConnect>
						<WalletModalProvider className='wallet-dialog'>{children}</WalletModalProvider>
					</WalletProvider>
				</ConnectionProvider>
			</ThemeProvider>
		</QueryClientProvider>
	)
}

export default ClientContextProvider

export const useToaster = (): null => useContext(ClientContext)
