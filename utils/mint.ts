import { CandyMachineGroupWithSource, WhiteListType } from '@/models/candyMachine/candyMachineGroup'

export const validateMintEligibilty = (group: CandyMachineGroupWithSource | undefined) => {
	let isMintLimitReached, isEligible

	if (group?.whiteListType == WhiteListType.Wallet || group?.whiteListType == WhiteListType.WalletWhiteList) {
		isMintLimitReached = group?.mintLimit && group?.wallet.itemsMinted && group?.mintLimit <= group?.wallet.itemsMinted
		isEligible = group?.wallet.isEligible
	} else {
		isMintLimitReached = group?.mintLimit && group?.user.itemsMinted && group?.mintLimit <= group?.user.itemsMinted
		isEligible = group?.user.isEligible
	}

	if (!group?.isActive) return { isEligible: false, error: 'Group Is Inactive' }
	else if (isMintLimitReached) return { isEligible: false, error: `Your Mint Limit Reached.` }
	else if (!isEligible) return { isEligible: false, error: `Not Eligible` }

	return { isEligible: true }
}
