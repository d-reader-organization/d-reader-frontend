import { useState } from 'react'
import type { AppProps } from 'next/app'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletDialogProvider } from '@solana/wallet-adapter-material-ui'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { ReactQueryDevtools } from 'react-query/devtools'
import { network, endpoint, APP_IDENTITY } from 'constants/environment'
import { AuthProvider, MobileWalletProvider, getWallets } from '@open-sauce/solomon'
import ToastProvider from 'providers/ToastProvider'
import theme from 'styles/theme'
import Head from 'next/head'
import http from 'api/http'
import 'styles/app.scss'

function MyApp({ Component, pageProps }: AppProps) {
	const [queryClient] = useState(() => new QueryClient())

	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider theme={theme}>
				<ConnectionProvider endpoint={endpoint}>
					<WalletProvider wallets={getWallets(network)} autoConnect>
						<WalletDialogProvider featuredWallets={6} className='wallet-dialog'>
							<MobileWalletProvider cluster={network} identity={APP_IDENTITY}>
								<AuthProvider http={http} cluster={network} identity={APP_IDENTITY}>
									<ToastProvider>
										<CssBaseline />

										<Head>
											<meta
												name='viewport'
												content='minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover'
											/>
											<title>dReader</title>
										</Head>

										<Component {...pageProps} />
									</ToastProvider>
								</AuthProvider>
							</MobileWalletProvider>
						</WalletDialogProvider>
					</WalletProvider>
				</ConnectionProvider>
			</ThemeProvider>
			<ReactQueryDevtools initialIsOpen={false} />
		</QueryClientProvider>
	)
}

export default MyApp
