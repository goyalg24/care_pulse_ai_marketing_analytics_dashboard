import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/Authenticator'
import './Header.css'

export default function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="header">
      <div className="header-container">
        <h1 className="logo">CarePulse</h1>
        {user && (
          <div className="header-right">
            <span className="user-name">Welcome, {user.name}</span>
            <button onClick={handleLogout} className="btn-logout">
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  )
}