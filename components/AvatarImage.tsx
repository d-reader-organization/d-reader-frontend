import clsx from 'clsx'
import { ImageProps } from 'next/image'
import Image from 'next/image'

interface Props extends Omit<ImageProps, 'alt'> {
	size: number
	alt?: ImageProps['alt']
}

const AvatarImage: React.FC<Props> = ({ size = 40, className, alt = '', ...props }) => {
	return <Image alt={alt} width={size} height={size} className={clsx('avatar', className)} {...props} />
}

export default AvatarImage
