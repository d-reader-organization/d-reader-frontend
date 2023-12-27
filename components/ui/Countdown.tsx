import { useCallback, useEffect, useState } from 'react'

interface Props {
	targetDateTime: string
}

const Countdown: React.FC<Props> = ({ targetDateTime }) => {
	const calculateTimeRemaining = useCallback(() => {
		const now = new Date()
		const targetDate = new Date(targetDateTime)
		const timeDifference = targetDate.getTime() - now.getTime()

		if (timeDifference <= 0) {
			return { days: 0, hours: 0, minutes: 0, seconds: 0 }
		}

		const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24))
		const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
		const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60))
		const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000)

		return { days, hours, minutes, seconds }
	}, [targetDateTime])

	const [timeRemaining, setTimeRemaining] = useState(calculateTimeRemaining())

	useEffect(() => {
		const interval = setInterval(() => {
			setTimeRemaining(calculateTimeRemaining())
		}, 1000)
		return () => clearInterval(interval)
	}, [calculateTimeRemaining])

	const renderTimeUnit = (unit: number, label: string) => {
		return unit > 0 ? (
			<span className='timer'>
				{unit} {unit === 1 ? label.slice(0, -1) : label}
			</span>
		) : null
	}

	const renderUnits = () => {
		if (timeRemaining.days > 0) {
			return (
				<>
					{renderTimeUnit(timeRemaining.days, 'days')}
					{renderTimeUnit(timeRemaining.hours, 'hours')}
				</>
			)
		} else if (timeRemaining.hours > 0) {
			return (
				<>
					{renderTimeUnit(timeRemaining.hours, 'hours')}
					{renderTimeUnit(timeRemaining.minutes, 'mins')}
				</>
			)
		} else if (timeRemaining.minutes > 0) {
			return (
				<>
					{renderTimeUnit(timeRemaining.minutes, 'mins')}
					{renderTimeUnit(timeRemaining.seconds, 'secs')}
				</>
			)
		} else {
			return renderTimeUnit(timeRemaining.seconds, 'secs')
		}
	}

	return <div className='countdown'>{renderUnits()}</div>
}

export default Countdown
