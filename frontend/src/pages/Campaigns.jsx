import React from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'

export default function Campaigns() {
  const navigate = useNavigate()

  return (
    <>
      <Header />
      <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <button 
          onClick={() => navigate('/dashboard')}
          style={{
            background: '#667eea',
            color: 'white',
            border: 'none',
            padding: '0.75rem 1.5rem',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1rem',
            marginBottom: '1rem'
          }}
        >
          ← Back to Dashboard
        </button>
        <h1>Marketing Campaigns</h1>
        <p>Manage and monitor marketing campaigns.</p>
        <div style={{ marginTop: '2rem' }}>
          <h2>Active Campaigns</h2>
            <p>Campaigns would go here.</p>
        </div>
      </div>
    </>
  )
}