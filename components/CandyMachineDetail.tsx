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
import { validateMintEligibilty } from '@/utils/mint'
import { CandyMachineGroupWithSource, WhiteListType } from '@/models/candyMachine/candyMachineGroup'
import LockIcon from 'public/assets/vector-icons/lock.svg'
import { MAX_PROTOCOL_FEE } from '@/constants/fee'

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

export const CandyMachineDetail: React.FC<Props> = ({ candyMachine, handleMint, isMintTransactionLoading }) => {
	const { startDate, endDate, mintLimit, mintPrice } = candyMachine.groups.at(0) as CandyMachineGroupWithSource

	const { countdownString } = useCountdown({ expirationDate: startDate })
	const { publicKey } = useWallet()

	const walletAddress = publicKey?.toBase58()
	const hasWalletConnected = !!walletAddress

	const isLive = new Date(startDate) <= new Date() && new Date(endDate) > new Date()
	const isEnded = new Date() > new Date(endDate)

	const { isEligible, error } = validateMintEligibilty(candyMachine.groups.at(0))

	const getItemsMinted = (candyMachine: CandyMachine) => {
		const group = candyMachine.groups.at(0)
		if (group?.whiteListType == WhiteListType.Wallet || group?.whiteListType == WhiteListType.WalletWhiteList) {
			return group.wallet.itemsMinted ?? 0
		} else {
			return group?.user.itemsMinted ?? 0
		}
	}
	const itemsMintedPerUserOrWallet = getItemsMinted(candyMachine)

	return (
		<div className='mint-group'>
			<div className='group-detail-wrapper'>
				<div className='group-detail'>
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
					<div>
						<span className='price'>{mintPrice == 0 ? '*Free' : `${toSol(mintPrice)} SOL`}</span>
					</div>
				</div>
				<div className='user-detail-wrapper'>
					<div className='user-detail'>
						<div>You minted</div>
						<div className='items-minted'>
							{itemsMintedPerUserOrWallet}/{mintLimit ?? '∞'}
						</div>
					</div>
					<div>
						{candyMachine.itemsMinted}/{candyMachine.supply}
					</div>
				</div>
			</div>
			<LinearProgress
				variant='determinate'
				className='progress-bar'
				sx={{
					'& .MuiLinearProgress-bar': {
						backgroundColor: '#fceb54',
					},
				}}
				value={normalise(candyMachine.itemsMinted, candyMachine.supply)}
			/>
			<div className='comic-vault'>
				<div className='title'>
					<LockIcon className='lock-icon' /> Comic Vault
				</div>
				<div className='comic-vault-details'>
					Comic Vault stores portion of the supply of each issue to later use in giveaways & other activities where we
					reward loyal users
				</div>
			</div>
			<div className='balance-details'>
				<div>Total</div>
				<div>≈ {toSol(mintPrice + MAX_PROTOCOL_FEE)} SOL</div>
			</div>
			{isLive ? (
				<>
					{hasWalletConnected ? (
						isEligible ? (
							<Button className='mint-button' onClick={handleMint}>
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
				</>
			) : null}
		</div>
	)
}

