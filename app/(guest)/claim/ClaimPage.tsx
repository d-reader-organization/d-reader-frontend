'use client'
import React from 'react'
import Button from '@/components/Button'
import { WALLET_LABELS } from '@/constants/wallets'
import CircularProgress from '@mui/material/CircularProgress'
import LinearProgress from '@mui/material/LinearProgress'
import { Props } from './CandyMachineGroup'

export const ClaimPage: React.FC<Props> = ({ group }) => {
	const { countdownString } = useCountdown({ expirationDate: group.startDate })

	const isLive = new Date(group.startDate) <= new Date() && new Date(group.endDate) > new Date()
	const isEnded = new Date() > new Date(group.endDate)
	return (
		<div className='mint-group' key={group.label}>
			<div className='group-detail-wrapper'>
				<div>
					<p>{group.displayLabel}</p>
					<div className='group-status'>
						{isLive ? (
							<span className='text--success'>Live</span>
						) : isEnded ? (
							<span className='text--error'>Ended</span>
						) : (
							<span className='text--important'>
								Upcoming <div className='countdown'>{countdownString}</div>
							</span>
						)}
					</div>
				</div>
				<div>
					<p>{group.mintPrice == 0 ? '*Free' : `${toSol(group.mintPrice)} SOL`}</p>
					<p>
						{group.itemsMinted}/{group.supply}
					</p>
				</div>
			</div>
			<LinearProgress
				variant='determinate'
				className='progress-bar'
				color='inherit'
				value={normalise(group.itemsMinted, group.supply)}
			/>
			{isLive ? (
				<>
					{hasWalletConnected || isMobile ? (
						<Button onClick={handleMint}>
							{!isMintTransactionLoading ? (
								'Mint'
							) : (
								<CircularProgress thickness={6} classes={{ svg: 'loader', root: 'loader--root' }} />
							)}
						</Button>
					) : (
						<BaseWalletMultiButtonDynamic labels={WALLET_LABELS} style={{ width: '100%' }} />
					)}
					<p className='mint-limit'>{group.mintLimit ? `Limit ${group.mintLimit} per wallet` : null}</p>
				</>
			) : null}
		</div>
	)
}
