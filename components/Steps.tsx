import React from 'react'
import clsx from 'clsx'

import { Step } from 'models/step'

interface Props {
	steps: Step[]
}

const Steps: React.FC<Props> = ({ steps }) => {
	return (
		<ul className='steps'>
			{steps.map((step) => (
				<li
					key={step.label}
					className={clsx('steps-item', {
						'steps-item--active': step.isActive,
					})}
				>
					<span>{step.label}</span>
				</li>
			))}
		</ul>
	)
}

export default Steps
