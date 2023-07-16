import http from 'api/http'
import { candyMachineKeys, CANDY_MACHINE_QUERY_KEYS } from 'api/candyMachine'
import { useAuth } from '@open-sauce/solomon'
import { useQuery } from 'react-query'
import { CandyMachine } from 'models/candyMachine'
import { useToaster } from 'providers/ToastProvider'

const { CANDY_MACHINE, GET } = CANDY_MACHINE_QUERY_KEYS

const fetchCandyMachine = async (address: string): Promise<CandyMachine> => {
	const response = await http.get<CandyMachine>(`${CANDY_MACHINE}/${GET}/${address}`)
	return response.data
}

export const useFetchCandyMachine = (address?: string) => {
	const { isAuthenticated } = useAuth()
	const toaster = useToaster()

	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	return useQuery(candyMachineKeys.getCandyMachine(address!), () => fetchCandyMachine(address!), {
		staleTime: 1000 * 60 * 5, // Stale for 5 minutes
		enabled: isAuthenticated && !!address,
		onError: toaster.onQueryError,
		retry: 1,
	})
}
