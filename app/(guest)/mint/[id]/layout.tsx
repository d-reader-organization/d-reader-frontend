import { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Tensorverse mint',
	metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL as string),
	description: '👾 Enter the Tensorverse comic mint is live! Click on the link and get yours',
	keywords: 'NFT, dReader, dPublisher, Comic, Solana, SOL, mint, collection, manga, manwha',
	openGraph: {
		type: 'website',
		title: 'Tensorverse mint',
		description: '👾 Enter the Tensorverse comic mint is live! Click on the link and get yours',
		images: '/assets/images/tensorverse-mint.png',
		url: process.env.NEXT_PUBLIC_SITE_URL,
		siteName: 'dReader',
	},
	appleWebApp: {
		title: 'Tensorverse mint',
		startupImage: '/assets/apple-touch-icon.png',
	},
	twitter: {
		title: 'Tensorverse mint',
		description: '👾 Enter the Tensorverse comic mint is live! Click on the link and get yours',
		site: undefined,
		card: 'summary_large_image',
		images: '/assets/images/tensorverse-mint.png',
	},
	manifest: '/manifest.json',
}

export default function MintLayout({ children }: { children: React.ReactNode }) {
	return children
}
