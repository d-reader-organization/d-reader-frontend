'use client'

import FAQ from '@/components/FAQ'
import FaqLink from '@/components/ui/FaqLink'
import Important from '@/components/ui/Important'

export default function FaqPage() {
	return (
		<>
			<main className='faq-page'>
				<h1 className='title'>FAQ</h1>
				<p className='subtitle'>
					Find answers to your questions! For any details contact us at <Important>support@dreader.io</Important>
					<br />
					If you&apos;d like to report your bug use the&nbsp;
					<Important>
						<FaqLink href='https://forms.gle/pXH2DFaVPyquv1Yv9'>bug report form</FaqLink>
					</Important>
				</p>
				<FAQ />
			</main>
		</>
	)
}
