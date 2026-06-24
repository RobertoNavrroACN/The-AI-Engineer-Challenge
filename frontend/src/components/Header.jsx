import React from 'react'

export default function Header({ title }) {
  return (
    <header className="header">
      <div className="container header-inner">
        <div className="header-badge">
          <span className="badge-dot" aria-hidden="true" />
          Live demo
        </div>
        <h1>
          <span className="header-icon" aria-hidden="true">✦</span>
          {title}
        </h1>
        <p className="header-tagline">
          Send a message to the API and watch the response light up.
        </p>
      </div>
    </header>
  )
}
