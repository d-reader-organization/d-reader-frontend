import Link, { LinkProps } from 'next/link'

interface Props extends LinkProps {
	children: React.ReactNode
}

const FaqLink: React.FC<Props> = ({ children, ...props }) => {
	return (
		<Link target='_blank' className='faq-link' {...props}>
			{children}
		</Link>
	)
}

export default FaqLink
