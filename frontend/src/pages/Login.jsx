import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/Authenticator'
import './Login.css'

export default function Login() {
  const [isRegistering, setIsRegistering] = useState(false)
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('user')
  const [error, setError] = useState('')
  
  const { login, register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (isRegistering) {
      if (!username || !email || !password) return setError('All fields required')
      
      const res = register(username, email, password, role) 
      if (res.success) {
        setIsRegistering(false)
        setError('Registration successful! Please login.')
      } else {
        setError(res.message)
      }
    } else {
      if (!email || !password) return setError('Please fill in all fields')
      if (login(email, password)) {
        navigate('/dashboard')
      } else {
        setError('Invalid credentials or user not found')
      }
    }
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>CarePulse</h1>
        <p className="subtitle">{isRegistering ? 'Create your account' : 'AI Marketing Analytics Dashboard'}</p>

        <form onSubmit={handleSubmit}>
          {isRegistering && (
            <>
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input 
                  id="username" 
                  type="text" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                  placeholder="johndoe" 
                />
              </div>

              <div className="form-group">
                <label htmlFor="role">Select Role</label>
                <select 
                  id="role"
                  value={role} 
                  onChange={(e) => setRole(e.target.value)}
                  className="role-select"
                >
                  <option value="guest">Guest</option>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </>
          )}

          <div className="form-group">
            <label htmlFor="email">Email or Username</label>
            <input 
              id="email" 
              type="text" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="demo@example.com" 
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              id="password" 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="••••••••" 
            />
          </div>

          {error && <div className={`error ${error.includes('successful') ? 'success-msg' : ''}`}>{error}</div>}

          <button type="submit" className="btn-login">
            {isRegistering ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        <button className="btn-toggle" onClick={() => setIsRegistering(!isRegistering)}>
          {isRegistering ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
        </button>
      </div>
    </div>
  )
}