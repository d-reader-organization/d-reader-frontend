import { Typography, TypographyProps } from '@mui/material'
import SolanaIcon from 'public/assets/vector-icons/solana.svg'
import { formatPrice } from 'utils/helpers'

interface Props extends Omit<TypographyProps, 'children'> {
	price: number
	size?: number
	bold?: boolean
	reverse?: boolean
	from?: boolean
}

const PriceTag: React.FC<Props> = ({ price, size = 16, bold = false, reverse = false, from = false, ...props }) => {
	const TypographyWrapper: React.FC<TypographyProps> = (tprops) => {
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
				{tprops.children}
			</Typography>
		)
	}

	if (price == 0) return <TypographyWrapper>FREE</TypographyWrapper>

	return (
		<TypographyWrapper>
			{from ? 'from ' : ''}
			<SolanaIcon
				style={{
					width: size,
					height: size,
					marginLeft: reverse ? '0.2rem' : '0.5rem',
					marginRight: reverse ? '0.5rem' : '0.2rem',
				}}
			/>

			{formatPrice(price) ?? '-.--'}
		</TypographyWrapper>
	)
}

export default PriceTag
