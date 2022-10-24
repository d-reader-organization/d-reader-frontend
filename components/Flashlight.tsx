import React, { MutableRefObject, useEffect, useMemo, useRef } from 'react'

interface Props {
	enabled?: boolean
	showCursor?: boolean
	size?: number
	darkness?: number
	speed?: number
	children?: React.ReactElement
}

interface Element {
	light: React.MutableRefObject<HTMLDivElement>
	container: React.MutableRefObject<HTMLDivElement>
}

const Flashlight: React.FC<Props> = ({
	enabled = true,
	showCursor = false,
	size = 150,
	darkness = 0.9,
	speed = 1000,
	children = <div />,
}) => {
	const style: React.CSSProperties = {
		position: 'absolute',
		top: 0,
		left: 0,
		background: `radial-gradient(transparent 0%, rgba(0, 0, 0, ${darkness}) ${size}px, rgba(0, 0, 0, ${
			darkness + 0.1
		}) 80%)`,
		transition: 'none',
		pointerEvents: 'none',
		willChange: 'transform',
	}

	const elements: Element[] = useMemo(() => {
		return (
			React.Children.map(children, () => ({
				// eslint-disable-next-line react-hooks/rules-of-hooks
				light: useRef() as MutableRefObject<HTMLDivElement>,
				// eslint-disable-next-line react-hooks/rules-of-hooks
				container: useRef() as MutableRefObject<HTMLDivElement>,
			})) || []
		)
	}, [children])

	useEffect(() => {
		let lastKnownScrollPosition = 0
		let ticking = false

		elements.forEach((element) => {
			const container = element.container.current
			container.style.overflow = 'hidden'
			container.style.position = 'relative'
			if (!showCursor) container.style.cursor = 'none'
		})

		function resizeLights() {
			elements.forEach(resizeLight)
		}

		function resizeLight(element: Element) {
			const light = element.light.current
			const maskSize = window.innerWidth > window.innerHeight ? window.innerWidth : window.innerHeight

			light.style.width = maskSize * 2 + 'px'
			light.style.height = maskSize * 2 + 'px'

			light.style.left = maskSize + 'px'
			light.style.top = maskSize + 'px'
		}

		function handleMouseMove(e: MouseEvent) {
			if (!ticking) {
				window.requestAnimationFrame(function () {
					ticking = false
					elements.forEach((element) => {
						const light = element.light.current
						const container = element.container.current
						const lightStyle = window.getComputedStyle(light, null)
						const containerStyle = container.getBoundingClientRect()
						light.style.transition = `opacity ease-in-out ${speed}ms`
						light.style.left = e.clientX - containerStyle.left - parseInt(lightStyle.width) / 2 + 'px'
						light.style.top = e.clientY - containerStyle.top - parseInt(lightStyle.height) / 2 + 'px'
					})
				})
				ticking = true
			}
		}

		function handleScroll() {
			const increment = window.scrollY - lastKnownScrollPosition
			lastKnownScrollPosition = window.scrollY
			if (!ticking) {
				window.requestAnimationFrame(function () {
					ticking = false
					elements.forEach((element) => {
						const light = element.light.current
						light.style.transition = `opacity ease-in-out ${speed}ms`
						light.style.top = parseInt(light.style.top) + increment + 'px'
					})
				})
				ticking = true
			}
		}

		resizeLights()

		const resizeObservers: ResizeObserver[] = []

		elements.forEach(() => {
			resizeObservers.push(new ResizeObserver(resizeLights))
		})

		window.addEventListener('mousemove', handleMouseMove)
		window.addEventListener('scroll', handleScroll)
		window.addEventListener('resize', resizeLights)

		elements.forEach((element, i) => {
			resizeObservers[i].observe(element.container.current)
		})

		// Cleanup
		return () => {
			window.removeEventListener('mousemove', handleMouseMove)
			window.removeEventListener('scroll', handleScroll)
			window.removeEventListener('resize', resizeLights)

			elements.forEach((element, i) => {
				resizeObservers[i].disconnect
			})
		}
	}, [elements, showCursor, speed])

	useEffect(() => {
		elements.forEach((element) => {
			const light = element.light.current
			if (light) {
				light.style.transition = `opacity ease-in-out ${speed}ms`
				light.style.opacity = enabled ? '1' : '0'
			}
		})
	}, [elements, enabled, speed])

	return (
		<>
			{React.Children.map(children, (child, i) =>
				React.cloneElement(child, {
					ref: elements[i].container,
					children: (
						<>
							{child.props.children}
							<div style={style} ref={elements[i].light} />
						</>
					),
				})
			)}
		</>
	)
}

export default Flashlight
