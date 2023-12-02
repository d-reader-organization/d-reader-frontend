import StarOutlinedIcon from 'public/assets/vector-icons/star-outlined-icon.svg'
import StarSolidIcon from 'public/assets/vector-icons/star-solid-icon.svg'
import clsx from 'clsx'

interface Props extends React.SVGProps<SVGSVGElement> {
	solid?: boolean
	size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

const StarIcon: React.FC<Props> = ({ solid = false, size = 'md', className, ...props }) => {
	const sharedClasses = {
		'icon--xs': size === 'xs',
		'icon--sm': size === 'sm',
		'icon--md': size === 'md',
		'icon--lg': size === 'lg',
		'icon--xl': size === 'xl',
	}

	if (solid) return <StarSolidIcon className={clsx(className, 'star-icon--solid', sharedClasses)} {...props} />
	else return <StarOutlinedIcon className={clsx(className, 'star-icon--outlined', sharedClasses)} {...props} />
}

export default StarIcon
