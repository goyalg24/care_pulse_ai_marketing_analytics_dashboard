import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/Authenticator'
import './Login.css'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Please fill in all fields')
      return
    }

    if (login(email, password)) {
      navigate('/dashboard')
    } else {
      setError('Invalid credentials')
    }
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <h1> CarePulse</h1>
        <p className="subtitle">AI Marketing Analytics Dashboard</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              placeholder="demo@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="any password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <div className="error">{error}</div>}

          <button type="submit" className="btn-login">
            Sign In
          </button>
        </form>

        <div className="demo-hint">
          <p>Demo credentials:</p>
          <code>demo@example.com / password</code>
        </div>
      </div>
    </div>
  )
}