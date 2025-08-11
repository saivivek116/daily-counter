import { useEffect, useRef, useState } from 'react'

interface HistoryEntry {
	date: string
	count: number
}

const History: React.FC = () => {
	const [history, setHistory] = useState<HistoryEntry[]>([])
	const fileInputRef = useRef<HTMLInputElement | null>(null)

	useEffect(() => {
		const load = () => {
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
		}

		load()
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

	const handleExport = () => {
		const keys = Object.keys(localStorage)
		const historyEntries: HistoryEntry[] = keys
			.filter(key => key.startsWith('counterHistory_'))
			.map(key => {
				const data = localStorage.getItem(key)
				return data ? JSON.parse(data) : null
			})
			.filter(entry => entry !== null)

		const counterData = localStorage.getItem('counterData')
		const payload = {
			version: 1,
			exportedAt: new Date().toISOString(),
			counterData: counterData ? JSON.parse(counterData) : null,
			historyEntries,
		}

		const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
		const url = URL.createObjectURL(blob)
		const a = document.createElement('a')
		const dateStr = new Date().toISOString().slice(0, 10)
		a.href = url
		a.download = `daily-counter-backup-${dateStr}.json`
		a.click()
		URL.revokeObjectURL(url)
	}

	const triggerImport = () => {
		fileInputRef.current?.click()
	}

	const handleImport: React.ChangeEventHandler<HTMLInputElement> = async e => {
		const file = e.target.files?.[0]
		if (!file) return
		try {
			const text = await file.text()
			const data = JSON.parse(text)
			const entries: HistoryEntry[] = Array.isArray(data?.historyEntries) ? data.historyEntries : []

			let imported = 0
			for (const entry of entries) {
				if (!entry?.date || typeof entry?.count !== 'number') continue
				const key = `counterHistory_${entry.date}`
				if (!localStorage.getItem(key)) {
					localStorage.setItem(key, JSON.stringify(entry))
					imported += 1
				}
			}

			// Only set counterData if it does not already exist
			if (!localStorage.getItem('counterData') && data?.counterData) {
				localStorage.setItem('counterData', JSON.stringify(data.counterData))
			}

			alert(`Imported ${imported} record(s). Existing records were kept.`)
			// Refresh list
			const keys = Object.keys(localStorage)
			const pastEntries: HistoryEntry[] = keys
				.filter(key => key.startsWith('counterHistory_'))
				.map(key => {
					const item = localStorage.getItem(key)
					return item ? JSON.parse(item) : null
				})
				.filter(entry => entry !== null)
				.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
			setHistory(pastEntries)
		} catch (err) {
			alert('Invalid backup file.')
		} finally {
			e.target.value = ''
		}
	}

	return (
		<div className="history-container">
			<div className="history-header">
				<h1>History</h1>
				<div className="history-actions">
					<button className="quick-btn" onClick={handleExport}>Export</button>
					<button className="quick-btn" onClick={triggerImport}>Import</button>
					<input
						ref={fileInputRef}
						type="file"
						accept="application/json"
						onChange={handleImport}
						style={{ display: 'none' }}
					/>
				</div>
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

			<div className="history-scroll">
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
		</div>
	)
}

export default History;

