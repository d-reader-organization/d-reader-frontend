import { useState } from 'react'
import { Box, BoxProps, Skeleton, Typography } from '@mui/material'
import VerifiedIcon from 'public/assets/vector-icons/verified-icon.svg'
import { getRandomFloat } from 'utils/helpers'
import { Creator } from 'models/creator'
import Image from 'next/image'
import clsx from 'clsx'

interface Props extends BoxProps {
	creator: Creator
}

const CreatorItem: React.FC<Props> = ({ creator, className, ...props }) => {
	const [isLoaded, setIsLoaded] = useState(false)

	// TODO: skeleton fixes
	if (!isLoaded) {
		return (
			<Box className={clsx('creator-item', className)} {...props}>
				<Skeleton variant='rectangular' width='100%' height='100%' className='cover-image' />
				<Image
					sizes='(max-width: 580px) 100vw,(max-width: 900px) 50vw,(max-width: 1200)33vw,25vw'
					onLoadingComplete={() => setIsLoaded(true)}
					style={{ visibility: 'hidden' }}
					className='cover-image'
					src={creator.avatar}
					loading='lazy'
					alt=''
					fill
				/>
				<Box className='text-area'>
					<Skeleton variant='text' />
					<Skeleton variant='text' width='50%' />
				</Box>
			</Box>
		)
	}

	return (
		<Box className={clsx('creator-item', className)} {...props}>
			<Image width={60} height={60} className='creator-image' src={creator.avatar} loading='lazy' alt='' />
			<Box className='text-area'>
				<Typography variant='body2' className='creator-name'>
					{creator.name}
					{creator.isVerified ? <VerifiedIcon /> : ''}
				</Typography>
				<Typography variant='body2' className='performance'>
					{getRandomFloat(10, 50)} %
				</Typography>
			</Box>
		</Box>
	)
}

export default CreatorItem
