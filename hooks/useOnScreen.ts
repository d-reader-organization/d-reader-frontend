import { useState, useMemo, useCallback } from 'react'

export const useOnScreen = <E extends HTMLElement>(): [boolean, React.RefCallback<E>] => {
	const [intersecting, setIntersecting] = useState(false)

	const observer = useMemo(() => {
		if (typeof window === 'object') {
			return new IntersectionObserver(([entry]) => {
				// if (entry.intersectionRatio >= 0) {
				// TODO: intersectionRatio
				// https://stackoverflow.com/questions/53214116/intersectionobserver-callback-firing-immediately-on-page-load
				// 	setIntersecting(true)
				// }

				if (entry.isIntersecting) {
					setIntersecting((prevIntersecting) => {
						if (observer) observer.unobserve(entry.target)
						return prevIntersecting || entry.isIntersecting
					})
				}
			})
		}
	}, [])

	const currentElement = useCallback(
		(element: E | null) => {
			if (!observer) return
			if (element) {
				setTimeout(() => {
					observer.observe(element)
				}, 2000)
			} else {
				observer.disconnect()
				setIntersecting(false)
			}
		},
		[observer]
	)

	return [intersecting, currentElement]
}

export default useOnScreen
