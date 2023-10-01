import Skeleton from '@mui/material/Skeleton'

interface Props {
	isLoading: boolean
	className?: string
	children: React.ReactNode
}

const SkeletonText: React.FC<Props> = ({ isLoading, className, children }) => {
	if (isLoading) return <Skeleton variant='text' width='100%' className={className} />
	return children
}

export default SkeletonText
