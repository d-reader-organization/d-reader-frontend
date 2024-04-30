import { ImageResponse } from 'next/og'
import { ComicIssue } from '@/models/comicIssue'
import { COMIC_ISSUE_QUERY_KEYS } from '@/api/comicIssue/comicIssueKeys'
// import fontSrc from '../../../fonts/Satoshi-Regular.woff2'

const { COMIC_ISSUE, GET_PUBLIC } = COMIC_ISSUE_QUERY_KEYS

const defaultTextStyles: React.CSSProperties = {
	position: 'absolute',
	left: 310,
	padding: 0,
	margin: 0,
	width: '100%',
	color: 'white',
	fontSize: '32px',
	fontWeight: 'bold',
	overflow: 'hidden',
	whiteSpace: 'nowrap',
	textOverflow: 'ellipsis',
	fontFamily: 'serif',
}

export const runtime = 'edge'

const size = { width: 800, height: 417 }

// const fetchAsset = (url: URL) => fetch(url).then((res) => res.arrayBuffer())

// const fetchSatoshiFont = fetchAsset(new URL('../../../fonts/Satoshi-Regular.woff2', import.meta.url))

export async function generateImageMetadata({ params }: { params: { id: string } }) {
	const comicIssue: ComicIssue = await (
		await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/${COMIC_ISSUE}/${GET_PUBLIC}/${params.id}`)
	).json()

	return [
		{
			id: 'large',
			size,
			alt: `Read '${comicIssue.comic?.title}' Episode ${comicIssue.number} on dReader`,
			contentType: 'image/png', // what if it isn't image/png?
		},
	]
}

export default async function GET({ params }: { params: { id: string }; id: number }) {
	const comicIssue: ComicIssue = await (
		await fetch(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/${COMIC_ISSUE}/${GET_PUBLIC}/${params.id}`)
	).json()

	// const comicIssueImage = process.env.NEXT_PUBLIC_SITE_URL + '/' + comicIssueImageSrc.src
	// const [satoshiFont] = await Promise.all([fetchSatoshiFont])

	return new ImageResponse(
		(
			<div
				style={{
					backgroundColor: 'rgb(21, 23, 28)',
					width: '100%',
					height: '100%',
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>
				<img width='100%' src={comicIssue.cover} alt='' style={{ position: 'absolute', opacity: 0.05 }} />
				<img
					width='220px'
					height='322px'
					src={comicIssue.cover}
					alt=''
					style={{ position: 'absolute', top: 60, left: 60, borderRadius: 8 }}
				/>
				<p style={{ ...defaultTextStyles, top: 75, color: '#c2c5ce' }}>{comicIssue.creator?.name || ''}</p>
				<p
					style={{
						...defaultTextStyles,
						top: 123,
						fontSize: '40px',
						fontWeight: 'bolder',
					}}
				>
					{comicIssue.comic?.title || ''}
				</p>
				<p style={{ ...defaultTextStyles, top: 190 }}>
					{comicIssue.title || ''} (EP{comicIssue.number})
				</p>
				{!!comicIssue.activeCandyMachineAddress && (
					<p
						style={{
							position: 'absolute',
							left: 310,
							top: 260,
							display: 'flex',
							alignItems: 'center',
							backgroundColor: '#fceb54',
							color: 'black',
							fontSize: '21px',
							fontWeight: 'bold',
							padding: '16px',
							borderRadius: '8px',
						}}
					>
						<svg
							style={{ marginRight: '8px', marginBottom: '2px' }}
							viewBox='0 0 44 44'
							fill='none'
							xmlns='http://www.w3.org/2000/svg'
						>
							<path d='M9.08759 21.6247H14.4937' stroke='black' stroke-width='2.70306' stroke-linecap='round' />
							<path d='M21.7019 9.0105V14.4166' stroke='black' stroke-width='2.70306' stroke-linecap='round' />
							<path d='M34.3162 21.6249H28.91' stroke='black' stroke-width='2.70306' stroke-linecap='round' />
							<path d='M21.7019 34.239V28.8329' stroke='black' stroke-width='2.70306' stroke-linecap='round' />
							<path d='M12.7819 30.5443L16.6046 26.7216' stroke='black' stroke-width='2.70306' stroke-linecap='round' />
							<path d='M12.7819 12.7052L16.6046 16.5279' stroke='black' stroke-width='2.70306' stroke-linecap='round' />
							<path d='M30.622 12.7052L26.7993 16.5279' stroke='black' stroke-width='2.70306' stroke-linecap='round' />
							<path d='M30.622 30.5443L26.7993 26.7216' stroke='black' stroke-width='2.70306' stroke-linecap='round' />
						</svg>
						MINTING LIVE
					</p>
				)}

				<svg
					style={{ position: 'absolute', bottom: 40, right: 40 }}
					width={51}
					height={50}
					color='white'
					fill='white'
					id='Layer_1'
					data-name='Layer 1'
					xmlns='http://www.w3.org/2000/svg'
					viewBox='0 0 298.49 275.62'
				>
					<path d='M271.22,43.88a32.9,32.9,0,0,0-65.79,0v78.26c-1.45-.08-2.9-.13-4.36-.13H142V43.88a32.89,32.89,0,0,0-65.78,0v79.44A71.31,71.31,0,0,0,89.83,264.63H201.07c39.38,0,70.07-31.93,70.07-71.31C271.14,188.92,271.22,43.88,271.22,43.88ZM102.81,192.94H70.69a12.59,12.59,0,1,1,0-25.18h32.12a12.59,12.59,0,1,1,0,25.18Zm89.3,0H160a12.59,12.59,0,1,1,0-25.18h32.12a12.59,12.59,0,0,1,0,25.18Z' />
				</svg>
			</div>
		),
		{
			...size,
			// fonts: [{ name: 'var(--font-sans)', data: satoshiFont, style: 'normal' }],
		}
	)
}
