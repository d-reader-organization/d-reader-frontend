import { CandyMachine } from '@/models/candyMachine'
import { WhiteListType } from '@/models/candyMachine/candyMachineGroup'
import { useMemo } from 'react'

export function findDiscountAmountFromCandyMachine(candyMachine: CandyMachine) {
	const group = candyMachine?.groups.find((group) => group.whiteListType === WhiteListType.User)
	return group?.discount
}

const useDiscountAmount = (candyMachine: CandyMachine | undefined) => {
	return useMemo(() => {
		if (!candyMachine) return 0

		const discountAmount = findDiscountAmountFromCandyMachine(candyMachine)
		return discountAmount
	}, [candyMachine])
}

export default useDiscountAmount
