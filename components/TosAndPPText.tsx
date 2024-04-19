import React from 'react'
import Important from './ui/Important'
import Link from 'next/link'

export const TermsOfServiceAndPrivacyPolicy: React.FC = () => {
	return (
		<p className='description'>
			By creating an account I confirm I read and agree to the
			<Important>
				<Link href='/privacy-policy' target='_blank'>
					&nbsp;Terms of Service&nbsp;
				</Link>
			</Important>
			&
			<Important>
				<Link href='/privacy-policy' target='_blank'>
					&nbsp;Privacy Policy
				</Link>
			</Important>
		</p>
	)
}
