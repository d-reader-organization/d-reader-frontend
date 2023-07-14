import {
	Accordion as MuiAccordion,
	AccordionDetails,
	AccordionSummary,
	Box,
	BoxProps,
	AccordionProps,
	styled,
} from '@mui/material'
import variables from 'styles/variables/theme.module.scss'
import { useQueue } from 'hooks'

export interface AccordionItem {
	summary: string
	details: React.ReactNode
}

interface Props extends BoxProps {
	items: AccordionItem[]
}

const Accordion = styled((props: AccordionProps) => <MuiAccordion disableGutters elevation={0} {...props} />)(() => ({
	background: 'transparent',
	border: 'none',
	'&:not(:last-child)': {
		borderBottom: `1px solid ${variables.lightgray}`,
	},
}))

const AccordionList: React.FC<Props> = ({ items, ...params }) => {
	const accordionsQueue = useQueue<number>()

	const toggleAccordion = (selectedIndex: number) => {
		accordionsQueue.add(selectedIndex)
	}

	return (
		<Box {...params}>
			{items.map((item, index) => {
				return (
					<Accordion key={item.summary} expanded={accordionsQueue.contains(index)}>
						<AccordionSummary
							onClick={() => {
								toggleAccordion(index)
							}}
						>
							{item.summary}
						</AccordionSummary>
						<AccordionDetails>{item.details}</AccordionDetails>
					</Accordion>
				)
			})}
		</Box>
	)
}

export default AccordionList
