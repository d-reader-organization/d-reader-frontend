'use client'

import React from 'react'
import Button from '@/components/Button'
import { WALLET_LABELS } from '@/constants/wallets'
import CircularProgress from '@mui/material/CircularProgress'
import LinearProgress from '@mui/material/LinearProgress'
import useCountdown from '@/hooks/useCountdown'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import { useWallet } from '@solana/wallet-adapter-react'
import dynamic from 'next/dynamic'
import { CandyMachine } from '@/models/candyMachine'
import { getActiveGroup, validateMintEligibilty } from '@/utils/mint'
import { CandyMachineGroupWithSource } from '@/models/candyMachine/candyMachineGroup'

const BaseWalletMultiButtonDynamic = dynamic(
	async () => (await import('@solana/wallet-adapter-react-ui')).BaseWalletMultiButton,
	{ ssr: false }
)

interface Props {
	candyMachine: CandyMachine
	handleMint: () => Promise<void>
	isMintTransactionLoading: boolean
}

const normalise = (value: number, MAX: number) => (value * 100) / MAX
const toSol = (lamports: number) => +(lamports / LAMPORTS_PER_SOL).toFixed(3)

const CandyMachineDetail: React.FC<Props> = ({ candyMachine, handleMint, isMintTransactionLoading }) => {
	const { startDate, endDate, mintLimit } = candyMachine.groups.at(0) as CandyMachineGroupWithSource

	const { countdownString } = useCountdown({ expirationDate: startDate })
	const { publicKey } = useWallet()

	const walletAddress = publicKey?.toBase58()
	const hasWalletConnected = !!walletAddress

	const isLive = new Date(startDate) <= new Date() && new Date(endDate) > new Date()
	const isEnded = new Date() > new Date(endDate)

	const { isEligible, error } = validateMintEligibilty(candyMachine.groups.at(0))

	const group = getActiveGroup(candyMachine)

	return (
		<div className='mint-group'>
			<div className='group-detail-wrapper'>
				<div>
					<div className='group-status'>
						{isLive ? (
							<span className='text--important'>● Live</span>
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
					<p>{group?.mintPrice == 0 ? '*Free' : `${toSol(group?.mintPrice as number)} SOL`}</p>
				</div>
			</div>
			<LinearProgress
				variant='determinate'
				className='progress-bar'
				color='inherit'
				value={normalise(candyMachine.itemsMinted, candyMachine.supply)}
			/>
			{isLive ? (
				<>
					{hasWalletConnected ? (
						isEligible ? (
							<Button onClick={handleMint}>
								{!isMintTransactionLoading ? (
									'Mint'
								) : (
									<CircularProgress thickness={6} classes={{ svg: 'loader', root: 'loader--root' }} />
								)}
							</Button>
						) : (
							<>
								<Button backgroundColor='disabled' disabled>
									{error}
								</Button>
							</>
						)
					) : (
						<BaseWalletMultiButtonDynamic labels={WALLET_LABELS} style={{ width: '100%' }} />
					)}
					<p className='mint-limit'>{mintLimit ? `Limit ${mintLimit} per wallet` : null}</p>
				</>
			) : null}
		</div>
	)
}

export default CandyMachineDetail
