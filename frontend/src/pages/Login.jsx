import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/Authenticator'
import ErrorBanner from '../components/ErrorBanner'
import FormField from '../components/FormField'

export default function Login() {
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'analyst' })
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const { login, register } = useAuth()
  const navigate = useNavigate()

  const onChange = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSuccess('')
    setSubmitting(true)
    try {
      if (mode === 'register') {
        await register(form.name, form.email, form.password, form.role)
        setSuccess('Registration successful. You can now sign in.')
        setMode('login')
      } else {
        await login(form.email, form.password)
        navigate('/dashboard')
      }
    } catch (err) {
      setError(err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>CarePulse</h1>
        <p>{mode === 'login' ? 'Sign in to the enterprise dashboard' : 'Create a new team account'}</p>
        {success && <div className="success-banner">{success}</div>}
        <ErrorBanner error={error} />
        <form onSubmit={handleSubmit} className="auth-form">
          {mode === 'register' && (
            <>
              <FormField label="Full name">
                <input value={form.name} onChange={(e) => onChange('name', e.target.value)} placeholder="Alex Morgan" />
              </FormField>
              <FormField label="Role">
                <select value={form.role} onChange={(e) => onChange('role', e.target.value)}>
                  <option value="analyst">Analyst</option>
                  <option value="admin">Admin</option>
                </select>
              </FormField>
            </>
          )}
          <FormField label="Email">
            <input value={form.email} onChange={(e) => onChange('email', e.target.value)} placeholder="alex@example.com" />
          </FormField>
          <FormField label="Password">
            <input type="password" value={form.password} onChange={(e) => onChange('password', e.target.value)} placeholder="At least 6 characters" />
          </FormField>
          <button className="primary-btn" disabled={submitting}>{submitting ? 'Submitting...' : mode === 'login' ? 'Sign in' : 'Register'}</button>
        </form>
        <button className="link-btn" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
          {mode === 'login' ? 'Need an account? Register' : 'Already have an account? Sign in'}
        </button>
      </div>
    </div>
  )
}
