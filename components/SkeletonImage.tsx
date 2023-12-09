import { useState } from 'react'
import Skeleton from '@mui/material/Skeleton'
import Image, { ImageProps } from 'next/image'

interface Props extends Omit<ImageProps, 'src'> {
	src?: ImageProps['src']
	onLoaded?: () => void
	isLoading?: boolean
}

const SkeletonImage: React.FC<Props> = ({
	src,
	width,
	height,
	className,
	style,
	alt,
	isLoading = false,
	onLoaded,
	...props
}) => {
	const [isLoaded, setIsLoaded] = useState(false)
	return (
		<>
			{(!isLoaded || !src || isLoading) && (
				<Skeleton
					variant='rectangular'
					width={width}
					height={height}
					style={{ border: 'none', ...style }}
					className={className}
				/>
			)}
			{src && (
				<Image
					src={src}
					width={width}
					height={height}
					onLoad={() => {
						setIsLoaded(true)
						if (typeof onLoaded === 'function') {
							onLoaded()
						}
					}}
					alt={alt}
					className={className}
					style={{
						opacity: !isLoading && isLoaded ? 1 : 0,
						...style,
					}}
					{...props}
				/>
			)}
		</>
	)
}

export default SkeletonImage
