import React, { useCallback, useEffect, useState } from 'react'
import clsx from 'clsx'

import ArrowDownIcon from 'public/assets/vector-icons/arrow-down-2.svg'
import useEventListener from '@/hooks/useEventListener'

interface Props {
	title: string
	children?: React.ReactNode
	open?: boolean
}

const Expandable: React.FC<Props> = ({ title, open = false, children }) => {
	const [isExpanded, setIsExpanded] = useState(open)
	const [contentHeight, setContentHeight] = useState(0)
	const [contentRef, setContentRef] = useState<HTMLDivElement | null>(null)

	const handleContentHeightChange = useCallback(() => {
		if (!contentRef) return 0

		setContentHeight(
			contentRef.clientHeight +
				+contentRef.style.getPropertyValue('padding-top').split('px')[0] +
				+contentRef.style.getPropertyValue('padding-bottom').split('px')[0]
		)
	}, [contentRef])

	useEffect(() => {
		handleContentHeightChange()
	}, [handleContentHeightChange])
	useEventListener('resize', handleContentHeightChange)

	return (
		<div className='expandable'>
			<div className='expandable-header' onClick={() => setIsExpanded((currentIsExpanded) => !currentIsExpanded)}>
				{title}
				<ArrowDownIcon
					className={clsx('expandable-header-arrow-icon', {
						'expandable-header-arrow-icon--rotated': isExpanded,
					})}
				/>
			</div>
			<div
				className={clsx('expandable-content-wrapper', {
					'expandable-content-wrapper--expanded': isExpanded,
				})}
				style={{ '--content-height': `${contentHeight}px` } as React.CSSProperties}
			>
				<div ref={(contentRef) => setContentRef(contentRef)} className='expandable-content'>
					{children}
				</div>
			</div>
		</div>
	)
}

export default Expandable
