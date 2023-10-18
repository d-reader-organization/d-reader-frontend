import Typography, { TypographyProps } from '@mui/material/Typography'
import SolanaIcon from 'public/assets/vector-icons/solana-icon.svg'
import SolanaColoredIcon from 'public/assets/vector-icons/solana-colored-icon.svg'
import { formatPrice } from 'utils/helpers'
import { isNil } from 'lodash'
import { roundNumber } from 'utils/numbers'

interface Props extends Omit<TypographyProps<React.ElementType>, 'children'> {
	price?: number | null
	size?: number
	bold?: boolean
	reverse?: boolean
	from?: boolean
	symbol?: boolean
	icon?: boolean
	colorfulIcon?: boolean
	inline?: boolean
	maxDecimals?: number
}

const PriceTag: React.FC<Props> = ({
	price,
	size = 16,
	bold = false,
	reverse = false,
	from = false,
	inline = true,
	symbol = false,
	icon = false,
	colorfulIcon = false,
	maxDecimals,
	...props
}) => {
	const TypographyWrapper: React.FC<TypographyProps> = (tprops) => {
		return (
			<Typography
				variant='body2'
				style={{
					display: inline ? 'inline-flex' : 'flex',
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

	if (isNil(price)) return <TypographyWrapper>-.--</TypographyWrapper>
	if (price == 0) return <TypographyWrapper>FREE</TypographyWrapper>

	const formattedPrice = formatPrice(price)
	const roundedPrice = !isNil(maxDecimals) ? roundNumber(formattedPrice, maxDecimals) : formattedPrice

	return (
		<TypographyWrapper>
			{from ? 'from ' : ''}
			{symbol && <span>◎</span>}
			{icon && (
				<SolanaIcon
					style={{
						width: size,
						height: size,
						marginLeft: reverse ? '0.2rem' : '0.5rem',
						marginRight: reverse ? '0.5rem' : '0.2rem',
						color: 'inherit',
						fill: 'inherit',
					}}
				/>
			)}
			{colorfulIcon && (
				<SolanaColoredIcon
					style={{
						width: size,
						height: size,
						marginLeft: reverse ? '0.2rem' : '0.5rem',
						marginRight: reverse ? '0.5rem' : '0.2rem',
					}}
				/>
			)}

			{roundedPrice}
		</TypographyWrapper>
	)
}

export default PriceTag
