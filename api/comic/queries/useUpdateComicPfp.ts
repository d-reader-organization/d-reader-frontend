import { COMIC_QUERY_KEYS, comicKeys } from 'api/comic/comicKeys'
import { useToaster } from 'providers/ToastProvider'
import { BasicComic } from 'models/comic'
import { useMutation, useQueryClient } from 'react-query'
import http from 'api/http'

const { COMIC, UPDATE, PFP } = COMIC_QUERY_KEYS

const updateComicPfp = async (slug: string, request: FormData): Promise<BasicComic> => {
	const response = await http.patch<BasicComic>(`${COMIC}/${UPDATE}/${slug}/${PFP}`, request)
	return response.data
}

export const useUpdateComicPfp = (slug: string) => {
	const toaster = useToaster()
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (updateData: FormData) => updateComicPfp(slug, updateData),
		onSuccess: () => {
			toaster.add('Pfp updated!', 'success')
			queryClient.invalidateQueries(comicKeys.getRaw(slug))
			// 👇 TODO: this also invalidates all the individual comics
			queryClient.invalidateQueries([COMIC_QUERY_KEYS.COMIC, COMIC_QUERY_KEYS.GET_RAW])
		},
		onMutate: toaster.uploadingFiles,
		onError: toaster.onQueryError,
	})
}
