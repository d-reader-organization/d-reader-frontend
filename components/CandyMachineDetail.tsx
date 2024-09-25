'use client'

import React, { Dispatch, SetStateAction, useState } from 'react'
import Button from '@/components/Button'
import { WALLET_LABELS } from '@/constants/wallets'
import CircularProgress from '@mui/material/CircularProgress'
import LinearProgress from '@mui/material/LinearProgress'
import useCountdown from '@/hooks/useCountdown'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import { useWallet } from '@solana/wallet-adapter-react'
import dynamic from 'next/dynamic'
import { CandyMachine } from '@/models/candyMachine'
import { checkIfCouponIsActive, getCouponDiscount, validateMintEligibilty } from '@/utils/mint'
import LockIcon from 'public/assets/vector-icons/lock.svg'
import { MAX_PROTOCOL_FEE } from '@/constants/fee'
import clsx from 'clsx'
import Expandable from './ui/Expandable'
import { CandyMachineCoupon, CouponCurrencySetting } from '@/models/candyMachine/candyMachineCoupon'
import Select from './forms/Select'
import { SelectOption } from '@/models/selectOption'
import { useFetchSupportedTokens } from '@/api/settings'
import { WRAPPED_SOL_MINT } from '@metaplex-foundation/js'
import { SplToken } from '@/models/settings/splToken'

const BaseWalletMultiButtonDynamic = dynamic(
	async () => (await import('@solana/wallet-adapter-react-ui')).BaseWalletMultiButton,
	{ ssr: false }
)

interface Props {
	candyMachine: CandyMachine,
	selectedCouponId: number,
	supportedTokens: SplToken[],
	handleMint: () => Promise<void>
	setCouponLabel: Dispatch<SetStateAction<string | undefined>>
	isMintTransactionLoading: boolean
	isAuthenticated?: boolean
}

const normalise = (value: number, MAX: number) => (value * 100) / MAX
const toSol = (lamports: number) => +(lamports / LAMPORTS_PER_SOL).toFixed(3)

export const CandyMachineDetail: React.FC<Props> = ({
	candyMachine,
	selectedCouponId,
	supportedTokens,
	handleMint,
	setCouponLabel,
	isMintTransactionLoading,
	isAuthenticated,
}) => {
	const selectedCoupon = candyMachine.coupons.find(coupon=>coupon.id==selectedCouponId) as CandyMachineCoupon;
	const { startsAt, expiresAt, numberOfRedemptions, prices} = selectedCoupon;

	const currencyToOption = (currency: CouponCurrencySetting | undefined) => {
		if(!currency){
			return {label: "UNKNOWN $SOL", value: WRAPPED_SOL_MINT.toString()}
		}

		const token = supportedTokens?.find(token=>token.address == currency.splTokenAddress);
		const denominator = Math.pow(10 ,token?.decimals || 9);
		const symbol = token?.symbol || 'UKNOWN';

		return {
			label: (currency.mintPrice/denominator).toPrecision(3).toString() + " " + symbol,
			value: token?.address || WRAPPED_SOL_MINT.toString()
		}
	}

	const solCurrency = prices.find(price=>price.splTokenAddress == WRAPPED_SOL_MINT.toString());
	const [selectedCurrency,setSelectedCurrency] = useState(solCurrency);
	setCouponLabel(selectedCurrency?.label);

	const currencyList : SelectOption[] = prices.map(price=>{
		return currencyToOption(price);
	});



	const { countdownString } = useCountdown({ expirationDate: startsAt })
	const { publicKey } = useWallet()

	const walletAddress = publicKey?.toBase58()
	const hasWalletConnected = !!walletAddress

	const isLive = checkIfCouponIsActive(selectedCoupon);
	const isEnded = expiresAt ? new Date() > new Date(expiresAt) : false;

	const { isEligible, error } = validateMintEligibilty(candyMachine.coupons,selectedCouponId)
	const itemsMintedPerUserOrWallet = 	selectedCoupon.stats.itemsMinted;
	const isSolCurrencySelected = selectedCurrency?.splTokenAddress == solCurrency?.splTokenAddress;

	const discount = getCouponDiscount(candyMachine.coupons,selectedCoupon);
	const highlightDiscount = (discount && discount > 0);

	const findCurrencySetting = (splTokenAddress: string) => {
		return selectedCoupon.prices.find(price=>price.splTokenAddress == splTokenAddress);
	}
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
					<div className='price-div'>
						{highlightDiscount ? (
							<div className='discount-chip'>
								<span>-{discount}&#37;</span>
							</div>
						) : null}
						<span className={clsx('price', highlightDiscount && 'price--highlight')}>
							{selectedCurrency && <Select
								options={currencyList}
								defaultSelectedOptions={[currencyToOption(selectedCurrency)]}
								onSelect={(selectedOptions) => {
									const currencySetting = findCurrencySetting(selectedOptions[0].value)
									setSelectedCurrency(currencySetting)
									setCouponLabel(currencySetting?.label);
								}}
								unselectableIfAlreadySelected
								placeholder='Select currency'
							/>}
						</span>
					</div>
				</div>
				<div className='user-detail-wrapper'>
					<div className='user-detail'>
						<div>You minted</div>
						<div className='items-minted'>
							{itemsMintedPerUserOrWallet}/{numberOfRedemptions ?? '∞'}
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
			<Expandable
				title='Comic Vault'
				style={{
					backgroundColor: '#2F333E',
					borderColor: 'transparent',
					borderRadius: '8px',
					marginTop: '8px',
					marginBottom: '8px',
				}}
				titleComponent={
					<div className='comic-vault-title'>
						<LockIcon className='lock-icon' /> Comic Vault
					</div>
				}
				hideArrow
			>
				<p className='comic-vault-details'>
					Comic Vault stores portion of the supply of each issue to later use in giveaways & other activities where we
					reward loyal users.
				</p>
			</Expandable>

			<div className='balance-details'>
				<div>Total</div>
				<div>≈ {(isSolCurrencySelected ? toSol(MAX_PROTOCOL_FEE + (solCurrency?.mintPrice || 0)) +  " $SOL" : currencyToOption(selectedCurrency).label)}</div>
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
