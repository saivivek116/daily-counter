import { useEffect, useState } from 'react'

interface HistoryEntry {
	date: string
	count: number
}

const History: React.FC = () => {
	const [history, setHistory] = useState<HistoryEntry[]>([])

	useEffect(() => {
		const keys = Object.keys(localStorage)
		const pastEntries: HistoryEntry[] = keys
			.filter(key => key.startsWith('counterHistory_'))
			.map(key => {
				const data = localStorage.getItem(key)
				return data ? JSON.parse(data) : null
			})
			.filter(entry => entry !== null)
			.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

		setHistory(pastEntries)
	}, [])

	const formatDate = (dateString: string) => {
		const date = new Date(dateString)
		return date.toLocaleDateString('en-US', {
			weekday: 'short',
			month: 'short',
			day: 'numeric',
		})
	}

	const formatFullDate = (dateString: string) => {
		const date = new Date(dateString)
		return date.toLocaleDateString('en-US', {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		})
	}

	const getTotalCount = () => {
		return history.reduce((total, entry) => total + entry.count, 0)
	}

	const getAverageCount = () => {
		return history.length > 0 ? Math.round(getTotalCount() / history.length) : 0
	}

	return (
		<div className="history-container">
			<div className="history-header">
				<h1>History</h1>
				<div className="history-stats">
					<div className="stat-card">
						<div className="stat-value">{history.length}</div>
						<div className="stat-label">Days Tracked</div>
					</div>
					<div className="stat-card">
						<div className="stat-value">{getTotalCount()}</div>
						<div className="stat-label">Total Count</div>
					</div>
					<div className="stat-card">
						<div className="stat-value">{getAverageCount()}</div>
						<div className="stat-label">Average</div>
					</div>
				</div>
			</div>

			{history.length === 0 ? (
				<div className="empty-state">
					<svg className="empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
						<path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
					<h3>No History Yet</h3>
					<p>Start counting today to see your progress history!</p>
				</div>
			) : (
				<div className="history-list">
					{history.map((entry, index) => (
						<div key={index} className="history-entry">
							<div className="entry-date">
								<div className="date-short">{formatDate(entry.date)}</div>
								<div className="date-full">{formatFullDate(entry.date)}</div>
							</div>
							<div className="entry-count">
								<span className="count-badge">{entry.count}</span>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	)
}

export default History;

