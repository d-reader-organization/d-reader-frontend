import Document, { DocumentContext, Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
	static async getInitialProps(ctx: DocumentContext) {
		const initialProps = await Document.getInitialProps(ctx)

		return initialProps
	}

	render() {
		return (
			<Html lang='en'>
				<Head>
					<meta charSet='utf-8' />
					<meta httpEquiv='X-UA-Compatible' content='IE=edge' />

					<meta
						name='description'
						content='Affordable, Authentic & Limited Edition. From manga to comics, now you can own digital graphic novels from your favorite artists and get rewarded for collecting.'
					/>
					<meta name='keywords' content='NFT, dReader, Comic, Solana, SOL, mint, collection, manga, manwha' />

					<link rel='manifest' href='/manifest.json' />
					<link rel='apple-touch-icon' href='/apple-touch-icon.png'></link>
					<meta name='theme-color' content='#181A20' />

					<link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='' />

					{/* Preload Urbanist font */}
					<link
						rel='preload'
						as='style'
						href='https://fonts.googleapis.com/css2?family=Urbanist:wght@400;500;700&display=swap'
					/>
					<link
						href='https://fonts.googleapis.com/css2?family=Urbanist:wght@400;500;700&display=swap'
						rel='stylesheet'
					/>
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		)
	}
}

export default MyDocument
