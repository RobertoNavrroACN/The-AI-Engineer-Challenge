import React from 'react'

export default function Header({ title }) {
  return (
    <header className="header">
      <div className="container header-inner">
        <div className="header-badge">
          <span className="badge-dot" aria-hidden="true" />
          Air mail · the post is open
        </div>
        <h1 className="header-title">{title}</h1>
        <p className="header-tagline">
          Write down whatever&rsquo;s on your mind, drop it in the post, and a
          thoughtful reply will find its way back to you.
        </p>
      </div>
    </header>
  )
}
