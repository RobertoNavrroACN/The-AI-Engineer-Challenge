import React from 'react'
import Header from './components/Header'
import Home from './components/Home'

export default function App() {
  return (
    <div className="app">
      <div className="bg-orbs" aria-hidden="true">
        <span className="orb orb-1" />
        <span className="orb orb-2" />
        <span className="orb orb-3" />
      </div>
      <div className="bg-grid" aria-hidden="true" />
      <Header title="The AI Engineer Challenge" />
      <main>
        <Home />
      </main>
    </div>
  )
}
