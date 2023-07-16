import http from 'api/http'
import { candyMachineKeys, CANDY_MACHINE_QUERY_KEYS } from 'api/candyMachine'
import { useAuth } from '@open-sauce/solomon'
import { useQuery } from 'react-query'
import { CandyMachine } from 'models/candyMachine'
import { useToaster } from 'providers/ToastProvider'
import { CandyMachineReceiptParams } from 'models/candyMachine/candyMachineParams'

const { CANDY_MACHINE, GET, RECEIPTS } = CANDY_MACHINE_QUERY_KEYS

const fetchCandyMachineReceipts = async (params: CandyMachineReceiptParams): Promise<CandyMachine> => {
	const response = await http.get<CandyMachine>(`${CANDY_MACHINE}/${GET}/${RECEIPTS}`, { params })
	return response.data
}

export const useFetchCandyMachineReceipts = (params: CandyMachineReceiptParams) => {
	const { isAuthenticated } = useAuth()
	const toaster = useToaster()

	return useQuery(candyMachineKeys.getCandyMachineReceipts(params), () => fetchCandyMachineReceipts(params), {
		staleTime: 1000 * 60 * 5, // Stale for 5 minutes
		enabled: isAuthenticated && !!params.candyMachineAddress,
		onError: toaster.onQueryError,
		retry: 1,
	})
}
