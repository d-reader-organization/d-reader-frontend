import { COMIC_ISSUE_QUERY_KEYS, comicIssueKeys } from 'api/comicIssue/comicIssueKeys'
import { useToaster } from 'providers/ToastProvider'
import { useMutation, useQueryClient } from 'react-query'
import http from 'api/http'

const { COMIC_ISSUE, FAVOURITISE } = COMIC_ISSUE_QUERY_KEYS

const favouritiseComicIssue = async (id: string | number): Promise<void> => {
	const response = await http.patch<void>(`${COMIC_ISSUE}/${FAVOURITISE}/${id}`)
	return response.data
}

export const useFavouritiseComicIssue = (id: string | number) => {
	const toaster = useToaster()
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: () => favouritiseComicIssue(id),
		onSuccess: () => {
			queryClient.invalidateQueries(comicIssueKeys.get(id))
			// 👇 TODO: this
			// queryClient.invalidateQueries(comicIssueKeys.getMany())
		},
		onError: toaster.onQueryError,
	})
}
