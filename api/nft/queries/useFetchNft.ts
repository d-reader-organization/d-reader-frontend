import { nftKeys, NFT_QUERY_KEYS } from 'api/nft/nftKeys'
import { useToaster } from 'providers/ToastProvider'
import { Nft } from 'models/nft'
import { useQuery } from 'react-query'
import http from 'api/http'

const { NFT, GET } = NFT_QUERY_KEYS

const fetchNft = async (address: string): Promise<Nft> => {
	const response = await http.get<Nft>(`${NFT}/${GET}/${address}`)
	return response.data
}

export const useFetchNft = (address: string, enabled = true) => {
	const toaster = useToaster()

	return useQuery({
		queryFn: () => fetchNft(address),
		queryKey: nftKeys.get(address),
		staleTime: 1000 * 60 * 60 * 1, // stale for 1 hour,
		enabled: enabled && !!address,
		onError: toaster.onQueryError,
	})
}
