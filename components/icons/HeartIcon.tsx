import HeartOutlinedIcon from 'public/assets/vector-icons/heart-outlined-icon.svg'
import HeartSolidIcon from 'public/assets/vector-icons/heart-solid-icon.svg'
import clsx from 'clsx'

interface Props extends React.SVGProps<SVGSVGElement> {
	solid?: boolean
	size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

const HeartIcon: React.FC<Props> = ({ solid = false, size = 'md', className, ...props }) => {
	const sharedClasses = {
		'icon--xs': size === 'xs',
		'icon--sm': size === 'sm',
		'icon--md': size === 'md',
		'icon--lg': size === 'lg',
		'icon--xl': size === 'xl',
	}

	if (solid) return <HeartSolidIcon className={clsx(className, 'heart-icon--solid', sharedClasses)} {...props} />
	else return <HeartOutlinedIcon className={clsx(className, 'heart-icon--outlined', sharedClasses)} {...props} />
}

export default HeartIcon
