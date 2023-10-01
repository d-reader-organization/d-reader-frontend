import { candyMachineKeys, CANDY_MACHINE_QUERY_KEYS } from 'api/candyMachine/candyMachineKeys'
import { useToaster } from 'providers/ToastProvider'
import { useQuery } from 'react-query'
import http from 'api/http'

const { CANDY_MACHINE, GET, MINTED_NFTS } = CANDY_MACHINE_QUERY_KEYS

const fetchCandyMachineMintedNfts = async (address: string): Promise<string[]> => {
	const response = await http.get<string[]>(`${CANDY_MACHINE}/${GET}/${MINTED_NFTS}/${address}`)
	return response.data
}

export const useFetchCandyMachineMintedNfts = (address: string) => {
	const toaster = useToaster()

	return useQuery({
		queryFn: () => fetchCandyMachineMintedNfts(address),
		queryKey: candyMachineKeys.getMintedNfts(address),
		staleTime: 1000 * 60 * 5, // stale for 5 minutes
		enabled: !!address,
		onError: toaster.onQueryError,
	})
}
