import { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'dReader - Launchpad',
	metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL as string),
	description: '📚 Affordable, Authentic & Limited Edition - from manga to comics. Collect comics on dReader!',
	keywords: 'NFT, dReader, dPublisher, Comic, Solana, SOL, mint, collection, manga, manwha',
	openGraph: {
		type: 'website',
		title: 'dReader - Launchpad',
		description: '📚 Affordable, Authentic & Limited Edition - from manga to comics. Collect comics on dReader!',
		images: '/assets/images/recruits-metadata.png',
		siteName: 'dReader',
	},
	appleWebApp: {
		title: 'dReader - Launchpad',
		startupImage: '/assets/apple-touch-icon.png',
	},
	twitter: {
		title: 'dReader - Launchpad',
		description: '📚 Affordable, Authentic & Limited Edition - from manga to comics. Collect comics on dReader!',
		card: 'summary_large_image',
		site: '@dReaderApp',
		creator: '@dReaderApp',
		images: '/assets/images/recruits-metadata.png',
	},
}

export default function RecruitsMintLayout({ children }: { children: React.ReactNode }) {
	return children
}
