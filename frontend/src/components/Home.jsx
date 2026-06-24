import React, { useState } from 'react'
import { callApi } from '../api'

export default function Home(){
  const [input,setInput] = useState('')
  const [loading,setLoading] = useState(false)
  const [result,setResult] = useState(null)

  async function onSubmit(e){
    e.preventDefault()
    setLoading(true)
    try{
      const data = await callApi('echo', { text: input })
      setResult(data)
    }catch(err){
      setResult({ error: String(err) })
    }finally{ setLoading(false) }
  }

  return (
    <section className="home container">
      <form onSubmit={onSubmit} className="form">
        <label>
          Message
          <input value={input} onChange={e=>setInput(e.target.value)} placeholder="Type a message" />
        </label>
        <div>
          <button type="submit" disabled={loading}>{loading ? 'Sending...' : 'Send'}</button>
        </div>
      </form>

      <div className="result">
        {result ? <pre>{JSON.stringify(result,null,2)}</pre> : <div>No response yet</div>}
      </div>
    </section>
  )
}
