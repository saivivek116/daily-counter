import { useState } from 'react'
import './App.css'
import Counter from './components/Counter'
import History from './components/History'

function App() {
	const [view, setView] = useState<'counter' | 'history'>('counter')

	return (
		<div className="app">
			<header className="app-header">
				<div className="header-content">
					<h1 className="app-title">Daily Counter</h1>
					<p className="app-subtitle">Track your daily progress</p>
				</div>
				<nav className="app-nav">
					<button
						className={`nav-btn ${view === 'counter' ? 'active' : ''}`}
						onClick={() => setView('counter')}
					>
						<svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
							<path d="M12 2v20M2 12h20" />
						</svg>
						<span>Today</span>
					</button>
					<button
						className={`nav-btn ${view === 'history' ? 'active' : ''}`}
						onClick={() => setView('history')}
					>
						<svg className="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
							<path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
						</svg>
						<span>History</span>
					</button>
				</nav>
			</header>
			<main className="app-main">
				<div className="content-wrapper">
					{view === 'counter' ? <Counter /> : <History />}
				</div>
			</main>
		</div>
	)
}

export default App
