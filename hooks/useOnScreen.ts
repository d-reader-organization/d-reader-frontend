import { useState, useMemo, useCallback } from 'react'

export const useOnScreen = <E extends HTMLElement>(): [boolean, React.RefCallback<E>] => {
	const [intersecting, setIntersecting] = useState(false)

	const observer = useMemo(() => {
		if (typeof window === 'object') {
			return new IntersectionObserver(([entry]) => setIntersecting(entry.isIntersecting))
		}
	}, [setIntersecting])

	const currentElement = useCallback(
		(element: E | null) => {
			if (!observer) return
			if (element) observer.observe(element)
			else {
				observer.disconnect()
				setIntersecting(false)
			}
		},
		[observer, setIntersecting]
	)

	return [intersecting, currentElement]
}

export default useOnScreen
