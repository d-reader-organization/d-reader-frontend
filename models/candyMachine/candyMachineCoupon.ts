export interface CandyMachineCoupon {
    id: number,
	name: string,
	description: string,
	startsAt: string
	expiresAt: string
	numberOfRedemptions: number,
	type: CouponType,
    stats: CouponStats,
    prices: CouponCurrencySetting[],
}

export interface CouponCurrencySetting {
	label: string,
	mintPrice: number,
	splTokenAddress: string,
	usdcEquivalent: number
}

export interface CouponStats {
	itemsMinted: number,
	isEligible: number
}

export enum CouponType {
	PublicUser = 'PublicUser',
	RegisteredUser = 'RegisteredUser',
	WhitelistedUser = 'WhitelistedUser',
	WhitelistedWallet = 'WhitelistedWallet',
}

