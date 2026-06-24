import React from 'react'
import Header from './components/Header'
import Home from './components/Home'

export default function App(){
  return (
    <div className="app">
      <Header title="The AI Engineer Challenge" />
      <main>
        <Home />
      </main>
    </div>
  )
}
