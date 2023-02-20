export const CAROUSEL_QUERY_KEYS = Object.freeze({
	CAROUSEL: 'carousel',
	GET: 'get',
	SLIDES: 'slides',
})

export const carouselKeys = Object.freeze({
	carousel: [CAROUSEL_QUERY_KEYS.CAROUSEL],
	getSlides: [CAROUSEL_QUERY_KEYS.CAROUSEL, CAROUSEL_QUERY_KEYS.SLIDES, CAROUSEL_QUERY_KEYS.GET],
})
