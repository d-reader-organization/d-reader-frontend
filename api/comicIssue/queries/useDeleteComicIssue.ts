import { COMIC_ISSUE_QUERY_KEYS, comicIssueKeys } from 'api/comicIssue/comicIssueKeys'
import { useToaster } from 'providers/ToastProvider'
import { useMutation, useQueryClient } from 'react-query'
import http from 'api/http'

const { COMIC_ISSUE, DELETE } = COMIC_ISSUE_QUERY_KEYS

const deleteComicIssue = async (slug: string): Promise<void> => {
	const response = await http.delete<void>(`${COMIC_ISSUE}/${DELETE}/${slug}`)
	return response.data
}

export const useDeleteComicIssue = (slug: string) => {
	const toaster = useToaster()
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: () => deleteComicIssue(slug),
		onSuccess: () => {
			toaster.add('Comic issue deleted!', 'success')
			queryClient.invalidateQueries(comicIssueKeys.getRaw(slug))
			// 👇 TODO: this also invalidates all the individual comic issues
			queryClient.invalidateQueries([COMIC_ISSUE_QUERY_KEYS.COMIC_ISSUE, COMIC_ISSUE_QUERY_KEYS.GET_RAW])
		},
		onError: toaster.onQueryError,
	})
}
