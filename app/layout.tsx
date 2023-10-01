import type { Metadata } from 'next'
import CssBaseline from '@mui/material/CssBaseline'
import ClientContext from '@/providers/ClientContextProvider'
import UserAuthProvider from 'providers/UserAuthProvider'
import ToastProvider from 'providers/ToastProvider'
import localFont from 'next/font/local'
import clsx from 'clsx'
import 'app/styles/app.scss'

/**
 * TODO:
 * - main mainnet CDN URL fix
 * - refactor localStorage auth handling to SWR
 * - deprecate next-sitemap and implement https://nextjs.org/docs/app/api-reference/file-conventions/metadata
 */

const satoshi = localFont({
	src: [
		{ path: './fonts/Satoshi-Light.woff2', weight: '300', style: 'normal' },
		{ path: './fonts/Satoshi-LightItalic.woff2', weight: '300', style: 'italic' },
		{ path: './fonts/Satoshi-Regular.woff2', weight: '400', style: 'normal' },
		{ path: './fonts/Satoshi-Italic.woff2', weight: '400', style: 'italic' },
		{ path: './fonts/Satoshi-Medium.woff2', weight: '500', style: 'normal' },
		{ path: './fonts/Satoshi-MediumItalic.woff2', weight: '500', style: 'italic' },
		{ path: './fonts/Satoshi-Bold.woff2', weight: '700', style: 'normal' },
		{ path: './fonts/Satoshi-BoldItalic.woff2', weight: '700', style: 'italic' },
		{ path: './fonts/Satoshi-Black.woff2', weight: '900', style: 'normal' },
		{ path: './fonts/Satoshi-BlackItalic.woff2', weight: '900', style: 'italic' },
	],
	display: 'swap',
	preload: true,
})

export const metadata: Metadata = {
	title: 'dReader',
	metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL as string),
	description:
		'📚 Affordable, Authentic & Limited Edition - from manga to comics. dReader is a new kind of platform for discovering, trading, collecting, and reading digital comics.',
	keywords: 'NFT, dReader, dPublisher, Comic, Solana, SOL, mint, collection, manga, manwha',
	themeColor: '#15171c',
	viewport: 'minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, viewport-fit=cover',
	openGraph: {
		type: 'website',
		title: 'dReader',
		description:
			'📚 Affordable, Authentic & Limited Edition - from manga to comics. dReader is a new kind of platform for discovering, trading, collecting, and reading digital comics.',
		images: '/assets/images/home-metadata.jpg',
		url: process.env.NEXT_PUBLIC_SITE_URL,
		siteName: 'Home for comics',
	},
	appleWebApp: {
		title: 'dReader',
		startupImage: '/assets/apple-touch-icon.png',
	},
	twitter: {
		title: 'dReader',
		description:
			'📚 Affordable, Authentic & Limited Edition - from manga to comics. dReader is a new kind of platform for discovering, trading, collecting, and reading digital comics.',
		site: undefined,
		card: 'summary_large_image',
	},
	manifest: '/manifest.json',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang='en'>
			<body className={clsx(satoshi.className, 'layout')}>
				<ClientContext>
					<UserAuthProvider>
						<ToastProvider>
							<CssBaseline />
							{children}
						</ToastProvider>
					</UserAuthProvider>
				</ClientContext>
			</body>
		</html>
	)
}
