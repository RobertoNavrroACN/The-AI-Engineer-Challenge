import React, { useState } from 'react'
import { callApi } from '../api'

export default function Home() {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  async function onSubmit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      const data = await callApi('echo', { text: input })
      setResult({ ok: true, data })
    } catch (err) {
      setResult({ ok: false, data: { error: String(err) } })
    } finally {
      setLoading(false)
    }
  }

  const hasError = result && !result.ok
  const payload = result?.data

  return (
    <section className="home container">
      <div className="card form-card">
        <div className="card-glow" aria-hidden="true" />
        <h2 className="card-title">Echo playground</h2>
        <p className="card-subtitle">
          Type anything below — the backend will echo it right back.
        </p>

        <form onSubmit={onSubmit} className="form">
          <label className="input-label">
            <span className="label-text">Your message</span>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Hello, AI Engineer Challenge!"
              disabled={loading}
            />
          </label>
          <button type="submit" className="btn-send" disabled={loading || !input.trim()}>
            {loading ? (
              <>
                <span className="spinner" aria-hidden="true" />
                Sending…
              </>
            ) : (
              <>
                <span aria-hidden="true">→</span>
                Send
              </>
            )}
          </button>
        </form>
      </div>

      <div className={`card result-card ${result ? 'result-card--visible' : ''} ${hasError ? 'result-card--error' : ''}`}>
        <div className="card-glow" aria-hidden="true" />
        <div className="result-header">
          <h2 className="card-title">Response</h2>
          {result && (
            <span className={`status-pill ${hasError ? 'status-pill--error' : 'status-pill--success'}`}>
              {hasError ? 'Error' : 'Success'}
            </span>
          )}
        </div>

        <div className="result-body">
          {loading && (
            <div className="result-placeholder result-placeholder--loading">
              <span className="spinner spinner--lg" aria-hidden="true" />
              <span>Waiting for the API…</span>
            </div>
          )}

          {!loading && !result && (
            <div className="result-placeholder">
              <span className="placeholder-icon" aria-hidden="true">◇</span>
              <span>No response yet — send a message to get started.</span>
            </div>
          )}

          {!loading && result && (
            <pre className="result-json">{JSON.stringify(payload, null, 2)}</pre>
          )}
        </div>
      </div>
    </section>
  )
}
