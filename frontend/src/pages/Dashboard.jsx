import { useAuth } from '../context/Authenticator'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import './Dashboard.css'

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleFeatureClick = (path) => {
    navigate(path)
  }

  return (
    <>
      <Header />
      <div className="dashboard">
        <main className="dashboard-content">
          <section className="hero-section">
            <h2>Welcome to CarePulse</h2>
            <p>This will contain more information in the future.</p>
          </section>

          <section className="features-section">
            <h3>Available Features</h3>
            <div className="features-list">
              <div className="feature-item" onClick={() => handleFeatureClick('/analytics')}>
                <span className="feature-icon">📊</span>
                <div>
                  <h4>Analytics</h4>
                  <p>View marketing information</p>
                </div>
              </div>
              <div className="feature-item" onClick={() => handleFeatureClick('/segments')}>
                <span className="feature-icon">👥</span>
                <div>
                  <h4>Segments</h4>
                  <p>Explore user segments</p>
                </div>
              </div>
              <div className="feature-item" onClick={() => handleFeatureClick('/chat')}>
                <span className="feature-icon">🤖</span>
                <div>
                  <h4>AI Assistant</h4>
                  <p>Chat with AI</p>
                </div>
              </div>
              <div className="feature-item" onClick={() => handleFeatureClick('/campaigns')}>
                <span className="feature-icon">📢</span>
                <div>
                  <h4>Campaigns</h4>
                  <p>Manage marketing campaigns</p>
                </div>
              </div>
            </div>
          </section>

          <section className="session-info">
            <h3>Session Information</h3>
            <div className="info-box">
              <p><strong>User ID:</strong> {user?.id}</p>
              <p><strong>Email:</strong> {user?.email}</p>
              <p><strong>Role:</strong> {user?.role}</p>
              <p><strong>Logged in:</strong> {new Date(user?.loginTime).toLocaleString()}</p>
            </div>
          </section>
        </main>
      </div>
    </>
  )
}