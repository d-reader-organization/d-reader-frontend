import http from 'api/http'
import { carouselKeys, CAROUSEL_QUERY_KEYS } from 'api/carousel'
import { useToaster } from 'providers/ToastProvider'
import { useAuth } from '@open-sauce/solomon'
import { useQuery } from 'react-query'
import { CarouselSlide } from 'models/carouselSlide'

const { CAROUSEL, SLIDES, GET } = CAROUSEL_QUERY_KEYS

const fetchCarouselSlides = async (): Promise<CarouselSlide[]> => {
	const response = await http.get<CarouselSlide[]>(`${CAROUSEL}/${SLIDES}/${GET}`)
	return response.data
}

export const useFetchCarouselSlides = () => {
	const { isAuthenticated } = useAuth()
	const toaster = useToaster()

	return useQuery(carouselKeys.getSlides, fetchCarouselSlides, {
		staleTime: 1000 * 60 * 60 * 1, // Stale for 1 hour
		enabled: isAuthenticated,
		onError: toaster.onQueryError,
		retry: 1,
	})
}
