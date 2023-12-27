'use client'

import Expandable from '@/components/Expandable'
import Header from 'components/layout/Header'
import Link, { LinkProps } from 'next/link'
import LogoIcon from 'public/assets/vector-icons/logo-with-text.svg'

interface Props extends LinkProps {
	children: React.ReactNode
}

const FaqLink: React.FC<Props> = ({ children, ...props }) => {
	return (
		<Link target='_blank' className='faq-link' {...props}>
			{children}
		</Link>
	)
}

const Important: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	return <span className='text--important'>{children}</span>
}

const NotImportant: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	return <span className='text--not-important'>{children}</span>
}

export default function FaqPage() {
	return (
		<>
			<Header image={<LogoIcon className='logo' />} />

			<main className='faq-page'>
				<h1 className='title'>FAQ</h1>
				<p className='subtitle'>
					Find answers to your questions! For any details contact us at <Important>support@dreader.io</Important>
					<br />
					If you&apos;d like to report your bug use the &nbsp;
					<Important>
						<FaqLink href='https://forms.gle/pXH2DFaVPyquv1Yv9'>bug report form</FaqLink>
					</Important>
				</p>
				<div className='faq-section'>GET STARTED</div>
				<Expandable title='📚 I love comics! Where do I start?'>
					<p>First make sure to register to the app!</p>
					<p>
						If you&apos;re on Android mobile,&nbsp;
						<FaqLink href='https://play.google.com/store/apps/details?id=io.app.dreader'>
							download dReader on Google Play
						</FaqLink>
						. In case you&apos;re a proud Saga owner, find us on the Solana dApp store!
						<br />
						If you&apos;re using our web app go to this&nbsp;
						<FaqLink href='https://dreader.app/register'>dReader register link</FaqLink>. It&apos;s important to note
						that if you&apos;re opening this link on your mobile device, use Phantom or Solflare in-app browser feature.
					</p>
					<p>
						After registration <Important>use the code &apos;faq&apos;</Important> to gain full access to the app.
					</p>
					<NotImportant>
						visit our&nbsp;
						<FaqLink href='https://dreader.io/links'>linkree</FaqLink> to learn more about what we do
					</NotImportant>
				</Expandable>

				<Expandable title='😠 I need a referral code to get in?!'>
					<p>
						Use the code&nbsp;
						<Important>
							<Important>&apos;faq&apos;</Important>
						</Important>
					</p>
					<NotImportant>
						visit our&nbsp;
						<FaqLink href='https://dreader.io/links'>linkree</FaqLink> to learn more about what we do
					</NotImportant>
				</Expandable>

				<Expandable title='🤔 Where can I learn more about the project?'>
					To learn more about the project visit our <FaqLink href='https://dreader.io/links'>linkree</FaqLink> and take
					a look at our pitch deck! 🔥
				</Expandable>

				<div className='faq-section'>MINTING</div>
				<Expandable title='📱 How do I mint the comic on the mobile app?'>
					<p>Our mobile app is currently only available on Android.</p>
					<p>To mint the comic:</p>
					<ol>
						<li>go to the mobile app</li>
						<li>
							<Important>make sure your email is verified</Important> by going to <em>settings -&gt; profile</em>
							<br />
							- if there is no &quot;send email verification&quot; button, you&apos;re good to go!
							<br />- if the button is there, click on it and check your email inbox (check for spam!)
						</li>
						<li>find the comic you&apos;d like to mint (usually promoted on the homepage banner)</li>
						<li>go to the comic details and hit the mint button</li>
					</ol>
					<p>
						<NotImportant>
							* it&apos;s important to note that you&apos;ll need&nbsp;
							<Important>at least 0.029 SOL in your wallet</Important> to pay for protocol & on-chain fees, even if the
							comic is listed as free.
						</NotImportant>
					</p>
				</Expandable>

				<Expandable title='🌐 How do I mint the comic from my mobile browser?'>
					<p>
						Our web app is currently available at <FaqLink href='https://dreader.app'>https://dreader.app</FaqLink>
					</p>
					<p>To mint the comic:</p>
					<ol>
						<li>open our web app from your mobile wallet&apos;s in-app browser</li>
						<li>
							<Important>make sure your email is verified</Important> by going to <em>profile -&gt; account</em>
							<br />
							- if there is no &quot;send email verification&quot; button, you&apos;re good to go!
							<br />- if the button is there, click on it and check your email inbox (check for spam!)
						</li>
						<li>find the comic you&apos;d like to mint (usually promoted on the homepage banner)</li>
						<li>go to the comic details and hit the mint button</li>
					</ol>
					<p>
						<NotImportant>
							* it&apos;s important to note that you&apos;ll need&nbsp;
							<Important>at least 0.029 SOL in your wallet</Important> to pay for protocol & on-chain fees, even if the
							comic is listed as free.
						</NotImportant>
						<br />
						<NotImportant>
							** web app is behind in development when compared to the mobile app and is missing some features.
						</NotImportant>
					</p>
				</Expandable>

				<Expandable title='💻 How do I mint the comic from my desktop browser?'>
					<p>
						Our web app is currently available at <FaqLink href='https://dreader.app'>https://dreader.app</FaqLink>
					</p>
					<p>To mint the comic:</p>
					<ol>
						<li>open our web app</li>
						<li>
							<Important>make sure your email is verified</Important> by going to <em>profile -&gt; account</em>
							<br />
							- if there is no &quot;send email verification&quot; button, you&apos;re good to go!
							<br />- if the button is there, click on it and check your email inbox (check for spam!)
						</li>
						<li>find the comic you&apos;d like to mint (usually promoted on the homepage banner)</li>
						<li>go to the comic details and hit the mint button</li>
					</ol>
					<p>
						<NotImportant>
							* it&apos;s important to note that you&apos;ll need&nbsp;
							<Important>at least 0.029 SOL in your wallet</Important> to pay for protocol & on-chain fees, even if the
							comic is listed as free.
						</NotImportant>
						<br />
						<NotImportant>
							** web app is behind in development when compared to the mobile app and is missing some features.
						</NotImportant>
					</p>
				</Expandable>

				<div className='faq-section'>TROUBLESHOOTING</div>
				<Expandable title={`⚠️ ERROR: "wallet aaa..aaa is not eligible for mint"`}>
					<p>
						When wallet is not eligible for minting it could mean that you haven&apos;t completed all of the
						prerequisites.
					</p>
					<p>
						Some of our mints require users to have verified email addresses. If you&apos;re trying to collect a mint
						from a referral bonus, you&apos;ll need to onboard at least 2 users to dReader AND they&apos;ll need to
						verify their email and connect their wallet (fully onboarded)
					</p>
					<p>
						Lastly, there is an <Important>important note</Important> to make regarding how wallets are allowlisted for
						mints on dReader. We only allowlist the wallet you have first connected to your users.
						<br />
						For example: you might have 3 wallets connected and have just onboarded 2 friends to dReader. In this case,
						we&apos;ll allowlist the wallet which you&apos;ve first connected to the app. Your other 2 wallets
						won&apos;t have the rights to mint the referral bonus.
					</p>
					<p>This is in order to prevent abuse. We will work on improving this user experience in 2024.</p>
				</Expandable>

				<Expandable title={`⚠️ ERROR: "wallet aaa..aaa has reached the mint limit"`}>
					Some of our mints have limitations of NFTs per wallet basis. For example, your wallet might only be eligible
					for 1 free mint, 2 public (paid) discounted mints, and unlimited public (full price) mints.
				</Expandable>

				<Expandable title={`⚠️ ERROR: "transaction signature verification failure"`}>
					Phantom has an issue with their Seed Vault implementation on Saga. If you see this errror, you&apos;re most
					likely using Saga and Phantom.
					<br />
					We have worked with Phantom to resolve the issue which should be live by now. Update Phantom to the latest
					version from the dApp store and retry.
					<br />
					If the issue persists, connect your seed phrase to the Solflare wallet. Works like a charm. 🤌
				</Expandable>

				<Expandable title={`⚠️ ERROR: "not enough SOL in your wallet"`}>
					It&apos;s in my personal interest to have as many comic enthusiasts on the platform. If the money is
					preventing you from minting reach out to me on discord &apos;josipvolarevic&apos; and I&apos;ll see if my
					personal treasury help in any way.
					<br />
					Especially if you&apos;re trying to mint the free comic but don&apos;t have 0.029 SOL to pay for on-chain &
					protocol fees!
				</Expandable>

				<Expandable title={`⚠️ ERROR: cannot connect a wallet to the mobile app`}>
					This could be due to multiple reasons. Mainly its due to power saving mode or ..
					<p>
						<NotImportant>
							*Update your wallet app and dReader on google play or apple store(soon) to the latest version and reset
							your device.
						</NotImportant>
					</p>
				</Expandable>

				<div className='faq-section'>OTHER</div>
				<Expandable title={`🫰 Where can I trade my comics?`}>
					Comics can be traded within our mobile app. Web app is WIP progress, ETA Q1 2024.
					<br />
					Until then, you can buy comics from secondary marketplaces like Tensor.
				</Expandable>

				<Expandable title={`💀 What happens if dReader dies?`}>
					Founders will look for a job at McDonalds, but your comics will still be safe! 🍟🍔
					<br />
					We&apos;re using <FaqLink href='https://www.darkblock.io'>Darkblock protocol</FaqLink> for on-chain data
					encryption. Comic assets are stored on Arweave and encrypted so only the owner of the NFT can read it&apos;s
					content. If dReader goes under, you&apos;ll still be able to read the comics and trade on secondary.
				</Expandable>

				<Expandable title={`🛒 Are there in-app purchases or subscriptions?`}>
					Yes, dReader will offer a monthly subscription plan, providing you with access to a vast library of digital
					comics. Additionally, users can make in-app purchases to acquire digital comics and enhance their collections.
				</Expandable>

				<Expandable title={`📅 How can I stay updated with dReader news and updates?`}>
					Follow us on our official social media channels to stay informed about the latest dReader news, updates, and
					events. Our main social media channel is <FaqLink href='https://x.com/dReaderApp'>Twitter</FaqLink>. For other
					links visit our <FaqLink href='https://dreader.io/links'>linktree</FaqLink>.
				</Expandable>

				<Expandable title={`🤪 What makes dReader different from other comic platforms?`}>
					dReader stands out for its focus on digital comic collecting, as well as, animated and gamified comics, and
					tokenized comic content. We offer a fresh and interactive approach to digital comics and manga.
				</Expandable>

				<Expandable title={`📖 How does the digital collecting experience work?`}>
					With dReader, you can collect and own digital comics as if they were real-world collectibles. Some of the
					collectable experience includes: signing the comics by its author, and condition state of the comics. Our
					tokenized system ensures the rarity and uniqueness of each comic.
				</Expandable>

				<Expandable title={`🙋‍♂️ How can I contact support?`}>
					For any questions, concerns, or technical issues, please reach out to our support team at&nbsp;
					<Important>support@dreader.io</Important>&nbsp;or raise a #support ticket on our discord server. We&apos;re
					here to help.
				</Expandable>

				<div className='faq-section'>PUBLISHING</div>
				<Expandable title={`✍️ Can I publish my own comics on dReader?`}>
					Yes, in order to publish comics/mangas on dReader, visit&nbsp;
					<FaqLink href='https://dpublisher.app'>dPublisher</FaqLink>. dPublisher is a website for self-publishing
					digital comics and mangas. For any questions, reach out to us at <Important>support@dreader.io</Important>.
				</Expandable>
			</main>
		</>
	)
}