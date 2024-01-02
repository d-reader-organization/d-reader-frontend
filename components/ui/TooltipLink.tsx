import Link, { LinkProps } from 'next/link'

interface Props extends LinkProps {
	children: React.ReactNode
}

export const TooltipLink: React.FC<Props> = ({ href, children }) => {
	return (
		<Link href={href} style={{ textDecoration: 'underline' }} target='_blank'>
			{children}
		</Link>
	)
}

export default TooltipLink
