import { COMIC_ISSUE_QUERY_KEYS, comicIssueKeys } from 'api/comicIssue/comicIssueKeys'
import { useToaster } from 'providers/ToastProvider'
import { PublishOnChainData } from 'models/comicIssue/publishOnChain'
import { useMutation, useQueryClient } from 'react-query'
import http from 'api/http'

const { COMIC_ISSUE, PUBLISH_ON_CHAIN } = COMIC_ISSUE_QUERY_KEYS

const publishComicIssueOnChain = async (id: string | number, request: PublishOnChainData): Promise<void> => {
	const response = await http.patch<void>(`${COMIC_ISSUE}/${PUBLISH_ON_CHAIN}/${id}`, request)
	return response.data
}

export const usePublishComicIssueOnChain = (id: string | number) => {
	const toaster = useToaster()
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (publishData: PublishOnChainData) => publishComicIssueOnChain(id, publishData),
		onSuccess: () => {
			queryClient.invalidateQueries(comicIssueKeys.getRaw(id))
			// 👇 TODO: this
			// queryClient.invalidateQueries(comicIssueKeys.getManyRaw())
		},
		onError: toaster.onQueryError,
	})
}
