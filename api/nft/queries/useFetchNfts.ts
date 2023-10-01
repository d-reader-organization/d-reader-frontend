import { nftKeys, NFT_QUERY_KEYS } from 'api/nft/nftKeys'
import { useToaster } from 'providers/ToastProvider'
import { NftParams } from 'models/nft/nftParams'
import { Nft } from 'models/nft'
import { useQuery } from 'react-query'
import http from 'api/http'

const { NFT, GET } = NFT_QUERY_KEYS

const fetchNfts = async (params: NftParams): Promise<Nft[]> => {
	const response = await http.get<Nft[]>(`${NFT}/${GET}`, { params })
	return response.data
}

export const useFetchNfts = (params: NftParams) => {
	const toaster = useToaster()

	return useQuery({
		queryFn: () => fetchNfts(params),
		queryKey: nftKeys.getMany(params),
		staleTime: 1000 * 60 * 30, // stale for 30 minutes
		onError: toaster.onQueryError,
	})
}
