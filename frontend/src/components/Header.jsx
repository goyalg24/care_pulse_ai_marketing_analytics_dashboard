import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/Authenticator'
import RoleBadge from './RoleBadge'

export default function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="header">
      <div className="header-inner">
        <div>
          <div className="brand">CarePulse</div>
          <div className="brand-subtitle">AI Marketing Analytics Dashboard</div>
        </div>
        {user && (
          <>
            <nav className="nav-links">
              <NavLink to="/dashboard">Dashboard</NavLink>
              <NavLink to="/campaigns">Campaigns</NavLink>
              <NavLink to="/segments">Segments</NavLink>
              <NavLink to="/analytics">Analytics</NavLink>
              <NavLink to="/chat">AI Assistant</NavLink>
            </nav>
            <div className="header-user">
              <div>
                <div className="user-name">{user.name}</div>
                <div className="user-email">{user.email}</div>
              </div>
              <RoleBadge role={user.role} />
              <button className="secondary-btn" onClick={handleLogout}>Logout</button>
            </div>
          </>
        )}
      </div>
    </header>
  )
}
