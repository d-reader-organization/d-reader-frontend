import { Button, ButtonProps } from '@mui/material'
import Link from 'next/link'

interface Props extends ButtonProps<'a'> {
	Icon?: React.FC
	blank?: boolean
}

const ButtonLink: React.FC<Props> = ({ Icon, href, blank = false, children, ...props }) => {
	if (!href) return null

	return (
		<Button LinkComponent={Link} target={blank ? '_blank' : undefined} href={href || '#'} {...props}>
			{children || (Icon && <Icon />)}
		</Button>
	)
}

export default ButtonLink
