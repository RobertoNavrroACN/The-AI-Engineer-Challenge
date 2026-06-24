import React from 'react'
import Header from './components/Header'
import Home from './components/Home'

export default function App() {
  return (
    <div className="app">
      <div className="paper-texture" aria-hidden="true" />
      <div className="airmail-frame" aria-hidden="true" />
      <Header title="Penpost" />
      <main>
        <Home />
      </main>
      <footer className="footer">
        <span className="footer-mark" aria-hidden="true">✦</span>
        Posted with care · The AI Engineer Challenge
      </footer>
    </div>
  )
}
