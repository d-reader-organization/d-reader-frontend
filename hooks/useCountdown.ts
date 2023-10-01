import { useState, useEffect } from 'react'

const formatTime = (secs: number, expirationDate?: string) => {
	if (!expirationDate) return { seconds: 0, minutes: 0, hours: 0, days: 0, isDue: false, countdownString: '--' }

	const totalSeconds = Math.ceil(secs)

	const days = Math.floor((totalSeconds % (60 * 60 * 24 * 1000)) / (60 * 60 * 24))
	const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60))
	const minutes = Math.floor((totalSeconds % (60 * 60)) / 60)
	const seconds = Math.floor(totalSeconds % 60)

	const countdownString =
		totalSeconds > 0
			? `${days ? `${days}d ` : null}
	${hours ? `${hours}`.padStart(2, '0') + ':' : null}
	${`${minutes}`.padStart(2, '0')}:${`${seconds}`.padStart(2, '0')}`
			: ''

	return { seconds, minutes, hours, days, isDue: totalSeconds === 0, countdownString }
}

const calculateRemaningSeconds = (expirationDate?: string) => {
	if (!expirationDate) return 0
	const now = new Date().getTime()
	const milliSecondsDistance = new Date(expirationDate).getTime() - now
	if (milliSecondsDistance > 0) return milliSecondsDistance / 1000
	return 0
}

type CountdownHook = (props: { expirationDate?: string; onExpire?: VoidFunction }) => {
	seconds: number
	minutes: number
	hours: number
	days: number
	countdownString: string
	isDue: boolean
}

export const useCountdown: CountdownHook = ({ expirationDate, onExpire }) => {
	const [remainingSeconds, setRemainingSeconds] = useState(0)
	const [isCounting, setIsCounting] = useState(false)

	useEffect(() => {
		setRemainingSeconds(calculateRemaningSeconds(expirationDate))
		setIsCounting(calculateRemaningSeconds(expirationDate) > 0)
	}, [expirationDate])

	useEffect(() => {
		const interval = setInterval(async () => {
			if (isCounting && remainingSeconds === 0) {
				if (onExpire) onExpire()
				setIsCounting(false)
			}
			setRemainingSeconds(calculateRemaningSeconds(expirationDate))
		}, 1000)

		if (!isCounting) clearInterval(interval)

		return () => clearInterval(interval)
	}, [onExpire, isCounting, remainingSeconds, expirationDate])

	return formatTime(remainingSeconds, expirationDate)
}

export default useCountdown
