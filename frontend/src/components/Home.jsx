import React, { useRef, useState } from 'react'
import { callApi } from '../api'

const MAX_CHARS = 1000
const SEAL_MS = 1050 // flap-close + wax-seal animation before departure
const TRANSIT_MIN_MS = 2400 // minimum time a letter spends in transit

export default function Home() {
  const [message, setMessage] = useState('')
  const [phase, setPhase] = useState('compose') // compose | sealing | transit | delivered | error
  const [reply, setReply] = useState('')
  const [sent, setSent] = useState('')
  const [error, setError] = useState('')
  const sealTimer = useRef(null)

  const inFlight = phase === 'sealing' || phase === 'transit'
  const canSend = message.trim().length > 0 && !inFlight

  async function postLetter(e) {
    e?.preventDefault?.()
    if (!canSend) return

    const note = message.trim()
    setSent(note)
    setError('')
    setReply('')
    setPhase('sealing')

    const delivery = callApi('chat', { message: note })
    const minTransit = new Promise((resolve) => setTimeout(resolve, TRANSIT_MIN_MS))

    // After the envelope seals, send it on its way.
    sealTimer.current = setTimeout(() => {
      setPhase((p) => (p === 'sealing' ? 'transit' : p))
    }, SEAL_MS)

    try {
      const [data] = await Promise.all([delivery, minTransit])
      setReply((data?.reply || '').trim() || 'The envelope arrived, but the page was blank.')
      setPhase('delivered')
    } catch (err) {
      setError(err?.message || 'Your letter could not be delivered.')
      setPhase('error')
    } finally {
      clearTimeout(sealTimer.current)
    }
  }

  function writeAnother() {
    setMessage('')
    setReply('')
    setSent('')
    setError('')
    setPhase('compose')
  }

  function tryAgain() {
    // Keep the message so it can be re-posted.
    setError('')
    setPhase('compose')
  }

  return (
    <section className="home container">
      {phase === 'compose' && (
        <ComposeCard
          message={message}
          setMessage={setMessage}
          canSend={canSend}
          onSubmit={postLetter}
        />
      )}

      {inFlight && <OutboundScene phase={phase} />}

      {phase === 'delivered' && (
        <DeliveredScene sent={sent} reply={reply} onWriteAnother={writeAnother} />
      )}

      {phase === 'error' && <ReturnedScene error={error} onRetry={tryAgain} />}
    </section>
  )
}

function ComposeCard({ message, setMessage, canSend, onSubmit }) {
  function onKeyDown(e) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') onSubmit(e)
  }

  return (
    <form className="letter compose" onSubmit={onSubmit}>
      <div className="letter-edge" aria-hidden="true" />

      <div className="address-row">
        <div className="address">
          <span className="address-label">To</span>
          <span className="address-name">Your Coach</span>
        </div>
        <div className="address address--from">
          <span className="address-label">From</span>
          <span className="address-name">You</span>
        </div>
      </div>

      <div className="paper">
        <p className="salutation">Dear Coach,</p>
        <label className="sr-only" htmlFor="note">
          Your message
        </label>
        <textarea
          id="note"
          className="note-input"
          value={message}
          onChange={(e) => setMessage(e.target.value.slice(0, MAX_CHARS))}
          onKeyDown={onKeyDown}
          placeholder="Tell me what's on your mind today…"
          rows={6}
          autoFocus
        />
      </div>

      <div className="compose-foot">
        <span className="char-count">
          {message.length}/{MAX_CHARS}
        </span>
        <button type="submit" className="btn-send" disabled={!canSend}>
          <span className="btn-stamp" aria-hidden="true">✦</span>
          Seal &amp; send
          <span className="btn-arrow" aria-hidden="true">→</span>
        </button>
      </div>
      <p className="hint">Press ⌘ / Ctrl + Enter to send</p>
    </form>
  )
}

function OutboundScene({ phase }) {
  const flying = phase === 'transit'

  return (
    <div className={`scene outbound ${flying ? 'is-flying' : 'is-sealing'}`}>
      <div className="envelope" aria-hidden="true">
        <div className="env-body" />
        <div className="env-flap" />
        <div className="wax-seal">
          <span>✦</span>
        </div>
        <div className="postage">
          <span className="postage-ink" />
        </div>
      </div>

      {flying && (
        <div className="flight" aria-hidden="true">
          <span className="flight-line" />
          <span className="flight-plane" />
        </div>
      )}

      <p className="scene-caption">
        {flying ? 'Your letter is on its way…' : 'Sealing your letter…'}
      </p>
    </div>
  )
}

function DeliveredScene({ sent, reply, onWriteAnother }) {
  const paragraphs = reply.split(/\n{2,}/).filter(Boolean)

  return (
    <div className="scene delivered">
      <div className="delivered-badge">
        <span className="badge-dot" aria-hidden="true" />
        Delivered
      </div>

      <article className="letter reply">
        <div className="letter-edge" aria-hidden="true" />
        <header className="reply-head">
          <div>
            <p className="reply-from">A letter from</p>
            <h2 className="reply-name">Your Coach</h2>
          </div>
          <span className="postmark" aria-hidden="true">
            <span>AIR&nbsp;MAIL</span>
          </span>
        </header>

        <div className="paper reply-paper">
          {paragraphs.map((para, i) => (
            <p key={i} className="reply-para">
              {para}
            </p>
          ))}
          <p className="signature">— with warmth, your coach</p>
        </div>
      </article>

      {sent && (
        <details className="your-note">
          <summary>Read the letter you sent</summary>
          <p>{sent}</p>
        </details>
      )}

      <div className="scene-actions">
        <button className="btn-send" onClick={onWriteAnother}>
          <span className="btn-stamp" aria-hidden="true">✦</span>
          Write another
        </button>
      </div>
    </div>
  )
}

function ReturnedScene({ error, onRetry }) {
  return (
    <div className="scene returned">
      <article className="letter returned-letter">
        <span className="return-stamp" aria-hidden="true">
          Return to sender
        </span>
        <h2 className="return-title">This one didn&rsquo;t make it</h2>
        <p className="return-detail">{error}</p>
        <div className="scene-actions">
          <button className="btn-send" onClick={onRetry}>
            <span className="btn-arrow" aria-hidden="true">↻</span>
            Try again
          </button>
        </div>
      </article>
    </div>
  )
}
