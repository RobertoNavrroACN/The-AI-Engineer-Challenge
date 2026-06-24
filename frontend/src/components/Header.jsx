import React from 'react'

export default function Header({title}){
  return (
    <header className="header">
      <div className="container">
        <h1>{title}</h1>
      </div>
    </header>
  )
}
