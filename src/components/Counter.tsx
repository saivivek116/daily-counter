import useDailyCounter from '../hooks/useDailyCounter'

const Counter: React.FC = () => {
	const { count, increment, decrement } = useDailyCounter()

	const today = new Date().toLocaleDateString('en-US', {
		weekday: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric',
	})

	return (
		<div className="counter-container">
			<div className="counter-header">
				<div className="date-badge">
					<svg className="date-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
						<rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
						<line x1="16" y1="2" x2="16" y2="6" />
						<line x1="8" y1="2" x2="8" y2="6" />
						<line x1="3" y1="10" x2="21" y2="10" />
					</svg>
					<span>{today}</span>
				</div>
			</div>

			<div className="counter-display">
				<div className="count-circle">
					<span className="count-number">{count}</span>
					<div className="count-label">Today's Count</div>
				</div>
			</div>

			<div className="counter-controls">
				<button
					className="counter-btn decrement-btn"
					onClick={decrement}
					disabled={count <= 0}
					aria-label="Decrease count"
				>
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
						<line x1="5" y1="12" x2="19" y2="12" />
					</svg>
				</button>

				<div className="quick-actions">
					<button
						className="quick-btn"
						onClick={() => {
							for (let i = 0; i < 5; i++) increment()
						}}
						aria-label="Add 5"
					>
						+5
					</button>
					<button
						className="quick-btn"
						onClick={() => {
							for (let i = 0; i < 10; i++) increment()
						}}
						aria-label="Add 10"
					>
						+10
					</button>
				</div>

				<button
					className="counter-btn increment-btn"
					onClick={increment}
					aria-label="Increase count"
				>
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
						<line x1="12" y1="5" x2="12" y2="19" />
						<line x1="5" y1="12" x2="19" y2="12" />
					</svg>
				</button>
			</div>
		</div>
	)
}

export default Counter;

