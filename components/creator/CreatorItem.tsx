import { useState } from 'react'
import Box, { BoxProps } from '@mui/material/Box'
import Skeleton from '@mui/material/Skeleton'
import Typography from '@mui/material/Typography'
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
					loading='eager'
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
			<Image width={60} height={60} className='creator-image' src={creator.avatar} loading='eager' alt='' />
			<Box className='text-area'>
				<Box className='creator-name-wrapper'>
					<Typography variant='body2' className='creator-name'>
						{creator.name}
					</Typography>
					{creator.isVerified ? <VerifiedIcon /> : ''}
				</Box>
				<Typography variant='body2' className='performance'>
					{'--' || getRandomFloat(10, 30)} %
				</Typography>
			</Box>
		</Box>
	)
}

export default CreatorItem
