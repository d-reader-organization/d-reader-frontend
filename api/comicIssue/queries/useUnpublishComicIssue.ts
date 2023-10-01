import { COMIC_ISSUE_QUERY_KEYS, comicIssueKeys } from 'api/comicIssue/comicIssueKeys'
import { useToaster } from 'providers/ToastProvider'
import { useMutation, useQueryClient } from 'react-query'
import http from 'api/http'

const { COMIC_ISSUE, UNPUBLISH } = COMIC_ISSUE_QUERY_KEYS

const unpublishComicIssue = async (id: string | number): Promise<void> => {
	const response = await http.patch<void>(`${COMIC_ISSUE}/${UNPUBLISH}/${id}`)
	return response.data
}

export const useUnpublishComicIssue = (id: string | number) => {
	const toaster = useToaster()
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: () => unpublishComicIssue(id),
		onSuccess: () => {
			queryClient.invalidateQueries(comicIssueKeys.get(id))
			// 👇 TODO: this
			// queryClient.invalidateQueries(comicIssueKeys.getManyRaw())
		},
		onError: toaster.onQueryError,
	})
}
