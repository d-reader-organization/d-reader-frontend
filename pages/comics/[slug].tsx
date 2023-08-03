import React, { useEffect, useState } from 'react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { Box, Button, CircularProgress, Container, Hidden, Modal, TextField, Theme, Typography, useMediaQuery } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close';
import ComicIssueDiscoverList from 'components/comicIssue/ComicIssueDiscoverList'
import PageBanner from 'public/assets/page-banner.png'
import WebsiteIcon from 'public/assets/vector-icons/web-icon.svg'
import TwitterIcon from 'public/assets/vector-icons/twitter-icon.svg'
import DiscordIcon from 'public/assets/vector-icons/discord-icon.svg'
import TelegramIcon from 'public/assets/vector-icons/telegram-icon.svg'
import InstagramIcon from 'public/assets/vector-icons/instagram-icon.svg'
import TikTokIcon from 'public/assets/vector-icons/tiktok-icon.svg'
import YouTubeIcon from 'public/assets/vector-icons/youtube-icon.svg'
import VerifiedIcon from 'public/assets/vector-icons/verified-icon.svg'
import CollectionStatusItem from 'components/ui/CollectionStatusItem'
import IconButtonLink from 'components/buttons/ButtonLink'
import ProtectedContent from 'components/ProtectedContent'
import AvatarImage from 'components/AvatarImage'
import PriceTag from 'components/tags/PriceTag'
import { useFetchComicIssues } from 'api/comicIssue'
import { useFetchComic } from 'api/comic'
import { SortOrder } from 'enums/sortOrder'
import InfoList from 'components/ui/InfoList'
import { roundNumber } from 'utils/numbers'
import FlexRow from 'components/ui/FlexRow'
import Image from 'next/image'
import clsx from 'clsx'
import {useCrossDeviceWallet} from '@open-sauce/solomon'
import { Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js'
import { useWallet } from '@solana/wallet-adapter-react'
import {SEED_MESSAGE, Elusiv} from '@elusiv/sdk'

const ComicDetails: NextPage = () => {
	const router = useRouter()
	const { slug } = router.query
	const { data: comic, error } = useFetchComic(slug as string)
	const { flatData: comicIssues = [] } = useFetchComicIssues({
		comicSlug: slug as string,
		take: 20,
		skip: 0,
	})
	const [connection,setConnection] = useState<Connection>();
	const {signMessage,signTransaction} = useCrossDeviceWallet();
	const [elusiv,setElusiv] = useState<Elusiv>();
	const [open,setModalOpen] = useState(false);
	const [loading,setLoading] = useState(false);
	const [privateBalance,setPrivateBalance] = useState(0.0);
	const [topupBalance,setTopupBalance] = useState(0);
	const receiptAddress = new PublicKey(comic?.creatorAddress ?? "3i8mZjkWboj8bSSgoqASTCx5mhkJEhb7Ta6rwWpu3KBL")

	const [sendFund,setFund] = useState(0);

	const {publicKey} = useWallet();

	const initPrivateTxPortal = async()=>{
        if(!connection || !process.env.NEXT_PUBLIC_SOLANA_CLUSTER || !publicKey)return;
        const seed = await signMessage(
            Buffer.from(SEED_MESSAGE, 'utf-8'),
        );
        const elusiv = await Elusiv.getElusivInstance(seed, publicKey, connection, "devnet");
        setElusiv(elusiv);
		setModalOpen(true);
		await calculatePrivateBalance(elusiv);
    }

	const calculatePrivateBalance = async(elusiv?:Elusiv)=>{
		if(!connection || !process.env.NEXT_PUBLIC_SOLANA_CLUSTER || !publicKey || !elusiv)return;
		const privateBalance = await elusiv.getLatestPrivateBalance("LAMPORTS");
		const balance = Number(privateBalance)/LAMPORTS_PER_SOL;
		setPrivateBalance(balance);
	}

	const topUp = async()=>{
		try{
			if(!elusiv)return;
			const topupTxData = await elusiv.buildTopUpTx(topupBalance*LAMPORTS_PER_SOL, 'LAMPORTS');
			const signedTx = await signTransaction(topupTxData.tx);
			topupTxData.tx = signedTx;
			setLoading(true)
			const topupSig = await elusiv.sendElusivTx(topupTxData);
			console.log(`topup successful ${topupSig}`)
			await calculatePrivateBalance(elusiv);
		}catch(e){
			console.log(e);
		}finally{
			setLoading(false);
		}
    }

	const sendPrivateFunds = async()=>{
		try{
			if(!elusiv)return;
			setLoading(true)
			const sendTx = await elusiv.buildSendTx(sendFund * LAMPORTS_PER_SOL, receiptAddress, 'LAMPORTS');
			const sendSig = await elusiv.sendElusivTx(sendTx);
			console.log(`Performed private transfer with sig ${sendSig.signature}`);
		}catch(e){
			console.log(e);
		}finally{
			await calculatePrivateBalance(elusiv);
			setLoading(false);
		}
        
    }
	const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))

	useEffect(()=>{
		const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC_NODE_ENDPOINT || '');
		setConnection(connection);
	},[])
	const style = {
		modalContainer: {
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			backgroundColor: 'black',
			borderRadius: 8,
			padding: '16px',
			boxShadow: '0px 2px 6px rgba(0, 0, 0, 0.25)',
			outline: 'none',
			position: 'absolute' as 'absolute',
			top: '50%',
			left: '50%',
			transform: 'translate(-50%, -50%)',
			width: 500,
			border: '2px solid #000',
			p: 4,
		  },
		  closeButton: {
			position: 'absolute',
			top: 12,
			right: 12,
		  },
		  closeIcon: {
			fontSize: 18,
			backgroundColor: 'red',
			radius: '50%'
		  },
		  button: {
			margin: '4px'
		  },
		  balance: {
			position: 'absolute',
			top: 12,
			left: 12,
		  },
		  topup:{
			marginRight: '10px',
			fontSize:15
		  }
	  };
	const handleClose = ()=>setModalOpen(false)
	// const toggleFavorite = () => {
	// 	console.log('Toggle favorite')
	// }

	// const toggleBookmark = () => {
	// 	console.log('Toggle bookmark')
	// }

	if (error) return <Box p={2}>{error.message}</Box>
	if (!comic || !comic.stats || !comic.myStats) return null

	const hasHeroImage = comic.banner || comic.cover
	const fallbackImage = isMobile ? comic.cover : PageBanner.src
	const heroImage = comic.banner || fallbackImage

	return (
		<ProtectedContent>
			<div className='comic-details-banner-image' style={{ backgroundImage: `url('${heroImage}')` }}>
				<div className={clsx('bottom-overlay', `bottom-overlay--${hasHeroImage ? 'standard' : 'simpler'}`)} />
				{comic.logo && <Image src={comic.logo} priority width={600} height={300} className='comic-logo' alt='' />}
			</div>

			<Container className='comic-details' maxWidth='xl'>
				<Box className='comic-details-header'>
					<Box className='comic-details--left'>
						<FlexRow>
							<Typography variant='h4' component='h1'>
								{comic.title}
							</Typography>
							{/* TODO: implement this + import heart icons */}
							{/* <Button onClick={toggleFavorite}>❤️</Button> */}
						</FlexRow>
						{comic.genres && (
							<FlexRow>
								<Box className='comic-genre-list'>
									{comic.genres.map((genre) => (
										<Box className='genre-item' key={genre.slug}>
											<img src={genre.icon} alt='' className='genre-icon' />
											<Hidden smDown>
												<Typography variant='body1'>{genre.name}</Typography>
											</Hidden>
										</Box>
									))}
								</Box>
							</FlexRow>
						)}
						{comic.flavorText && (
							<Typography variant='body2' className='comic-flavor-text'>
								{comic.flavorText}
							</Typography>
						)}
						{/* TODO: add "view more" if more than 2-3 rows */}
						<Typography className='comic-description'>{comic.description}</Typography>
						{comic.creator && (
							<Box className='comic-creator-wrapper'>
								<AvatarImage src={comic.creator.avatar} size={48} />
								<Box ml={2}>
									<Typography className='text--author'>author</Typography>
									<Typography fontWeight='bold'>
										{comic.creator.name} {comic.creator.isVerified ? <VerifiedIcon /> : ''}
									</Typography>
								</Box>
							</Box>
						)}
					</Box>
					<Box className='comic-details--right'>
						<FlexRow className='comic-links-wrapper'>
							<FlexRow className='comic-links'>
								{/* TODO: if too many links, show a linktree dropdown */}
								<IconButtonLink href={comic.website} Icon={WebsiteIcon} blank />
								<IconButtonLink href={comic.twitter} Icon={TwitterIcon} blank />
								<IconButtonLink href={comic.discord} Icon={DiscordIcon} blank />
								<IconButtonLink href={comic.telegram} Icon={TelegramIcon} blank />
								<IconButtonLink href={comic.instagram} Icon={InstagramIcon} blank />
								<IconButtonLink href={comic.tikTok} Icon={TikTokIcon} blank />
								<IconButtonLink href={comic.youTube} Icon={YouTubeIcon} blank />
							</FlexRow>
							<Box width='max-content'>
								{/* TODO: enable this */}
								{/* <Button onClick={toggleBookmark}>+ Add to Library</Button> */}
							</Box>
						</FlexRow>
						<Button type="submit" variant="outlined" color="secondary" onClick={initPrivateTxPortal}>
							👋 Anon! Wanna Support Us 
						</Button>
						<FlexRow className='comic-stats'>
							<InfoList orientation='vertical'>
								<Button>
									⭐&nbsp;<span>{roundNumber(comic.stats.averageRating) || '-'}</span>
								</Button>
								<Button>
									❤️&nbsp;<span>{comic.stats.favouritesCount}</span>
								</Button>
							</InfoList>

							<InfoList orientation='vertical'>
								<CollectionStatusItem
									label='volume'
									value={<PriceTag component='span' maxDecimals={0} price={1030220000000} bold symbol reverse />}
								/>
								<CollectionStatusItem label='issues' value={comic.stats.issuesCount} />
								<CollectionStatusItem label='readers' value={comic.stats.viewersCount} />
								<CollectionStatusItem label='ongoing' value={comic.isCompleted ? 'no ' : 'yes'} />
							</InfoList>
						</FlexRow>
					</Box>
				</Box>

				<Typography className='section-title' variant='h5' component='h2'>
					Issues ( {`${comic.stats.issuesCount}`} )
				</Typography>
				<ComicIssueDiscoverList params={{ comicSlug: comic.slug, sortOrder: SortOrder.ASC }} enabled hideItemsCount />
				{comicIssues.length === 0 && <Box>No issues found for this comic</Box>}
				<Modal
					open={open}
					aria-labelledby="modal-modal-title"
					aria-describedby="modal-modal-description"
					>
					<Box sx={style.modalContainer}>
						{
							loading ? <CircularProgress/> : 
							<>
							<Typography className='section-title' variant='body2' component='h2' fontSize={12} style={style.balance}>
								Balance: {`${privateBalance}`}
							</Typography>
							<Box display="flex" alignItems="center">
							<Button type="submit" variant="outlined" color="secondary" onClick={topUp} style={style.topup}>
								Topup Private Balance
							</Button>
							<TextField
								hiddenLabel
								id="filled-hidden-label-small"
								defaultValue="Small"
								variant="filled"
								size='small'
								type="number"
								sx={{ width: '5ch' }}
								inputProps={{ min: 0 }}
								value={topupBalance}
       							onChange={(e)=>setTopupBalance(Math.max(0, parseFloat(e.target.value)))}
							/>
							</Box>
							<Box display="flex" alignItems="center">
							<Button type="submit" variant="outlined" color="secondary" onClick={sendPrivateFunds} style={style.button}>
								Send Sol Anonymously
							</Button>
							<TextField
								hiddenLabel
								id="filled-hidden-label-small"
								defaultValue="Small"
								variant="filled"
								size='small'
								type="number"
								sx={{ width: '5ch' }}
								inputProps={{ min: 0 }}
								value={sendFund}
        						onChange={(e)=>setFund(Math.max(0, parseFloat(e.target.value)))}
							/>
							</Box>
							<Button type="submit" color="secondary" onClick={handleClose} sx={style.closeButton}>
							<CloseIcon sx={style.closeIcon} />
							</Button>
						</>
						}
					</Box>
    			</Modal>

			</Container>
		</ProtectedContent>
	)
}

export default ComicDetails
