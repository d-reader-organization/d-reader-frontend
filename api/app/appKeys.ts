export const APP_QUERY_KEYS = Object.freeze({
	APP: 'app',
	HELLO: 'hello',
})

export const appKeys = Object.freeze({
	app: [APP_QUERY_KEYS.APP],
	getHello: () => [APP_QUERY_KEYS.APP, APP_QUERY_KEYS.HELLO],
})
