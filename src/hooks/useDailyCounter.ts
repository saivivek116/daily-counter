import { useState, useEffect } from 'react'

interface CounterData {
	date: string
	count: number
}

const useDailyCounter = () => {
	const [count, setCount] = useState(0)

	useEffect(() => {
		const today = new Date().toDateString()
		const savedData: CounterData | null = JSON.parse(
			localStorage.getItem('counterData') || 'null'
		)

		if (!savedData || savedData.date !== today) {
			// Save yesterday's data to history if it exists
			if (savedData && savedData.date !== today) {
				const historyKey = `counterHistory_${savedData.date}`
				localStorage.setItem(historyKey, JSON.stringify(savedData))
			}

			// Reset for today
			localStorage.setItem(
				'counterData',
				JSON.stringify({ date: today, count: 0 })
			)
			setCount(0)
		} else {
			setCount(savedData.count)
		}
	}, [])

	const increment = () => {
		setCount(prev => {
			const newCount = prev + 1
			saveCount(newCount)
			return newCount
		})
	}

	const decrement = () => {
		setCount(prev => {
			const newCount = Math.max(0, prev - 1)
			saveCount(newCount)
			return newCount
		})
	}

	const saveCount = (newCount: number) => {
		const today = new Date().toDateString()
		localStorage.setItem(
			'counterData',
			JSON.stringify({ date: today, count: newCount })
		)
	}

	return { count, increment, decrement }
}

export default useDailyCounter;
