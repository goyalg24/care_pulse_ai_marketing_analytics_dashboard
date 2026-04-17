import React from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'

export default function Segments() {
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
        <h1>Customer Segments</h1>
        <p>Explore customer segments and their characteristics.</p>
        <div style={{ marginTop: '2rem' }}>
          <h2>Available Segments</h2>
            <p>Segments would go here.</p>
        </div>
      </div>
    </>
  )
}