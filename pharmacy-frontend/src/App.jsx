import { useState } from 'react'
import Medicines from './components/Medicines'
import AddMedicine from './components/AddMedicine'
import Sales from './components/Sales'
import './App.css'

export default function App() {
  const [view, setView] = useState('medicines')

  return (
    <div className="app">
      <header className="header">
        <span className="logo">💊 ABC Pharmacy — Medicine Tracker</span>
        <span className="clock">{new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</span>
      </header>

      <nav className="nav">
        <button className={view === 'medicines' ? 'active' : ''} onClick={() => setView('medicines')}>Medicines</button>
        <button className={view === 'add' ? 'active' : ''} onClick={() => setView('add')}>Add Medicine</button>
        <button className={view === 'sales' ? 'active' : ''} onClick={() => setView('sales')}>Sales Records</button>
      </nav>

      <main className="main">
        {view === 'medicines' && <Medicines />}
        {view === 'add' && <AddMedicine onAdded={() => setView('medicines')} />}
        {view === 'sales' && <Sales />}
      </main>
    </div>
  )
}
