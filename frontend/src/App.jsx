import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [status, setStatus] = useState('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetch(import.meta.env.VITE_API_URL || '/api')
      .then((res) => res.json())
      .then((data) => {
        setMessage(data.message)
        setStatus('online')
      })
      .catch(() => {
        setStatus('offline')
        setMessage('Could not reach the API')
      })
  }, [])

  return (
    <div className="container">
      <div className={`card ${status}`}>
        <div className="indicator" />
        <h1>API Status</h1>
        <p className="message">{message || 'Connecting...'}</p>
        <span className="badge">{status}</span>
      </div>
    </div>
  )
}

export default App
