import { useState, useMemo, useCallback } from 'react'

// TODO: https://stackoverflow.com/questions/45514676/react-check-if-element-is-visible-in-dom
export const useOnScreen = <E extends HTMLElement>(): [boolean, React.RefCallback<E>] => {
	const [intersecting, setIntersecting] = useState(false)

	const observer = useMemo(
		() => new IntersectionObserver(([entry]) => setIntersecting(entry.isIntersecting)),
		[setIntersecting]
	)

	const currentElement = useCallback(
		(element: E | null) => {
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