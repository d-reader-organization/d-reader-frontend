import axios from 'axios'

export const http = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_ENDPOINT,
})

http.interceptors.response.use(
	(response) => response,
	(error) => {
		// if (axios.isAxiosError(error)) return error.response?.data?.message
		if (error.response?.data) return Promise.reject(error.response.data)
		else return Promise.reject(error)
	}
)
export default http
