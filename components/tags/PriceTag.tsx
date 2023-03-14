import { Typography, TypographyProps } from '@mui/material'
import SolanaIcon from 'public/assets/vector-icons/solana.svg'

interface Props extends TypographyProps {
	price: number
	size?: number
	bold?: boolean
	reverse?: boolean
}

const PriceTag: React.FC<Props> = ({ price, size = 16, bold = true, reverse = false, ...props }) => {
	return (
		<Typography
			variant='body2'
			style={{
				display: 'flex',
				flexDirection: reverse ? 'row-reverse' : 'row',
				alignItems: 'center',
			}}
			fontWeight={bold ? 'bold' : 'normal'}
			{...props}
		>
			{price == 0 ? 'FREE' : price ?? '-.--'}
			<SolanaIcon
				style={{
					width: size,
					height: size,
					marginLeft: reverse ? undefined : '0.5rem',
					marginRight: reverse ? '0.5rem' : undefined,
				}}
			/>
		</Typography>
	)
}

export default PriceTag
