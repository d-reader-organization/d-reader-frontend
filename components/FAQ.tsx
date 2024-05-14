import Expandable from '@/components/ui/Expandable'
import FaqLink from './ui/FaqLink'
import NotImportant from './ui/NotImportant'
import Important from './ui/Important'

const FAQ: React.FC = () => {
	return (
		<>
			<div className='faq-section'>
				<p className='faq-section-title'>GET STARTED</p>
				<Expandable title='📚 I love comics! Where do I start?' id='get-started'>
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
					<NotImportant>
						visit our&nbsp;
						<FaqLink href='https://dreader.io/links'>linkree</FaqLink> to learn more about what we do
					</NotImportant>
				</Expandable>

				<Expandable title='🤔 Where can I learn more about the project?' id='learn-more'>
					To learn more about the project visit our <FaqLink href='https://dreader.io/links'>linkree</FaqLink> and take
					a look at our pitch deck! 🔥
				</Expandable>

				<Expandable title='📱 How do I buy the comic on the mobile app?' id='buy-on-mobile-app'>
					<p>Our mobile app is currently only available on Android.</p>
					<p>To buy the comic:</p>
					<ol>
						<li>go to the mobile app</li>
						<li>
							<Important>make sure your email is verified</Important> by going to <em>settings -&gt; profile</em>
							<br />
							- if there is no &quot;send email verification&quot; button, you&apos;re good to go!
							<br />- if the button is there, click on it and check your email inbox (check for spam!)
						</li>
						<li>find the comic you&apos;d like to buy (usually promoted on the homepage banner)</li>
						<li>go to the comic details and hit the buy button</li>
					</ol>
					<p>
						<NotImportant>
							* it&apos;s important to note that you&apos;ll need&nbsp;
							<Important>at least 0.0033 SOL in your wallet</Important> to pay for protocol & on-chain fees, even if the
							comic is listed as free.
						</NotImportant>
					</p>
				</Expandable>

				<Expandable title='🌐 How do I buy the comic from my mobile browser?' id='buy-on-mobile-browser'>
					<p>
						Our web app is currently available at <FaqLink href='https://dreader.app'>https://dreader.app</FaqLink>
					</p>
					<p>To buy the comic:</p>
					<ol>
						<li>open our web app from your mobile wallet&apos;s in-app browser</li>
						<li>
							<Important>make sure your email is verified</Important> by going to <em>profile -&gt; account</em>
							<br />
							- if there is no &quot;send email verification&quot; button, you&apos;re good to go!
							<br />- if the button is there, click on it and check your email inbox (check for spam!)
						</li>
						<li>find the comic you&apos;d like to buy (usually promoted on the homepage banner)</li>
						<li>go to the comic details and hit the buy button</li>
					</ol>
					<p>
						<NotImportant>
							* it&apos;s important to note that you&apos;ll need&nbsp;
							<Important>at least 0.0033 SOL in your wallet</Important> to pay for protocol & on-chain fees, even if the
							comic is listed as free.
						</NotImportant>
						<br />
						<NotImportant>
							** web app is behind in development when compared to the mobile app and is missing some features.
						</NotImportant>
					</p>
				</Expandable>

				<Expandable title='💻 How do I buy the comic from my desktop browser?' id='buy-on-desktop-browser'>
					<p>
						Our web app is currently available at <FaqLink href='https://dreader.app'>https://dreader.app</FaqLink>
					</p>
					<p>To buy the comic:</p>
					<ol>
						<li>open our web app</li>
						<li>
							<Important>make sure your email is verified</Important> by going to <em>profile -&gt; account</em>
							<br />
							- if there is no &quot;send email verification&quot; button, you&apos;re good to go!
							<br />- if the button is there, click on it and check your email inbox (check for spam!)
						</li>
						<li>find the comic you&apos;d like to buy (usually promoted on the homepage banner)</li>
						<li>go to the comic details and hit the buy button</li>
					</ol>
					<p>
						<NotImportant>
							* it&apos;s important to note that you&apos;ll need&nbsp;
							<Important>at least 0.0033 SOL in your wallet</Important> to pay for protocol & on-chain fees, even if the
							comic is listed as free.
						</NotImportant>
						<br />
						<NotImportant>
							** web app is behind in development when compared to the mobile app and is missing some features.
						</NotImportant>
					</p>
				</Expandable>
			</div>

			<div className='faq-section'>
				<p className='faq-section-title'>TROUBLESHOOTING</p>
				<Expandable
					title={`⚠️ ERROR: "user/wallet aaa..aaa has reached the purchase limit"`}
					id='wallet-reached-purchase-limit'
				>
					Some of our sales have limitations of assets bought per user/wallet basis. For example, you might only be
					eligible for 1 free comic, 2 public (paid) discounted comics, and unlimited public (full price) comics on a
					single comic sale.
				</Expandable>

				<Expandable
					title={`⚠️ ERROR: "transaction signature verification failure"`}
					id='transaction-signature-verification-failure'
				>
					Phantom has an issue with their Seed Vault implementation on Saga. If you see this errror, you&apos;re most
					likely using the Saga device and Phantom wallet.
					<br />
					If the issue persists, connect your seed phrase to the Solflare wallet. Works like a charm. 🤌
				</Expandable>

				<Expandable title={`⚠️ ERROR: "not enough SOL in your wallet"`} id='not-enough-sol'>
					It&apos;s in my personal interest to have as many comic enthusiasts on the platform. If the money is
					preventing you from minting reach out to me on discord &apos;josipvolarevic&apos; and I&apos;ll see if my
					personal treasury help in any way.
					<br />
					Especially if you&apos;re trying to buy the free comic but don&apos;t have 0.0033 SOL to pay for on-chain &
					protocol fees!
				</Expandable>
			</div>

			<div className='faq-section'>
				<p className='faq-section-title'>OTHER</p>
				<Expandable title={`🫰 Where can I trade my comics?`} id='trading-comics'>
					Comics can be traded within our mobile app. Web app is WIP progress, ETA Q3 2024.
					<br />
					Until then, you can buy comics from secondary marketplaces like{' '}
					<FaqLink href='https://www.tensor.trade/creator/dreader'>Tensor</FaqLink>.
				</Expandable>

				<Expandable title={`💀 What happens if dReader dies?`} id='what-if-dReader-dies'>
					Founders will look for a job at McDonalds, but your comics will still be safe! 🍟🍔
					<br />
					We&apos;re using <FaqLink href='https://www.darkblock.io'>Darkblock protocol</FaqLink> for on-chain data
					encryption. Comic assets are stored on Arweave and encrypted so only the owner of the asset can read it&apos;s
					content. If dReader goes under, you&apos;ll still be able to read the comics and trade on secondary.
				</Expandable>

				<Expandable title={`🛒 Are there in-app purchases or subscriptions?`} id='in-app-purchases-and-subscriptions'>
					Yes, dReader will offer a monthly subscription plan, providing you with access to a vast library of digital
					comics. Additionally, users can make in-app purchases to acquire digital comics and enhance their collections.
				</Expandable>

				<Expandable title={`📅 How can I stay updated with dReader news and updates?`} id='stay-updated'>
					Follow us on our official social media channels to stay informed about the latest dReader news, updates, and
					events. Our main social media channel is <FaqLink href='https://x.com/dReaderApp'>Twitter</FaqLink>. For other
					links visit our <FaqLink href='https://dreader.io/links'>linktree</FaqLink>.
				</Expandable>

				<Expandable
					title={`🤪 What makes dReader different from other comic platforms?`}
					id='what-makes-dReader-special'
				>
					dReader stands out for its focus on digital comic collecting, as well as, animated and gamified comics, and
					tokenized comic content. We offer a fresh and interactive approach to digital comics and manga.
				</Expandable>

				<Expandable title={`📖 How does the digital collecting experience work?`} id='digital-collecting-experience'>
					With dReader, you can collect and own digital comics as if they were real-world collectibles. Some of the
					collectable experience includes: signing the comics by its author, and condition state of the comics. Our
					tokenized system ensures the rarity and uniqueness of each comic.
				</Expandable>

				<Expandable title={`🙋‍♂️ How can I contact support?`} id='contact-support'>
					For any questions, concerns, or technical issues, please reach out to our support team at&nbsp;
					<Important>support@dreader.io</Important>&nbsp;or raise a #support ticket on our discord server. We&apos;re
					here to help.
				</Expandable>
			</div>

			<div className='faq-section'>
				<p className='faq-section-title'>PUBLISHING</p>
				<Expandable title={`✍️ Can I publish my own comics on dReader?`} id='publishing-comics'>
					Yes, in order to publish comics/mangas on dReader, visit&nbsp;
					<FaqLink href='https://dpublisher.app'>dPublisher</FaqLink>. dPublisher is a website for self-publishing
					digital comics and mangas. For any questions, reach out to us at <Important>support@dreader.io</Important>.
				</Expandable>
			</div>
		</>
	)
}

export default FAQ
