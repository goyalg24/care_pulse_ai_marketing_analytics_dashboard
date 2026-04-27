import { useEffect, useState } from 'react'
import PageShell from '../components/PageShell'
import { useAuth } from '../context/Authenticator'
import { api } from '../service/api'
import ErrorBanner from '../components/ErrorBanner'

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({ campaigns: 0, segments: 0, reports: 0, ai: 0 })
  const [error, setError] = useState(null)

  useEffect(() => {
    const load = async () => {
      try {
        const [campaigns, segments, reports, ai] = await Promise.all([
          api.getCampaigns(),
          api.getSegments(),
          api.getReports(),
          api.getAiHistory(user.user_id),
        ])
        setStats({ campaigns: campaigns.length, segments: segments.length, reports: reports.length, ai: ai.length })
      } catch (err) {
        setError(err)
      }
    }
    load()
  }, [user.user_id])

  return (
    <PageShell title="Dashboard" subtitle="Overview of your marketing operations and AI activity.">
      <ErrorBanner error={error} />
      <div className="stats-grid">
        <div className="card stat-card"><h3>{stats.campaigns}</h3><p>Campaigns</p></div>
        <div className="card stat-card"><h3>{stats.segments}</h3><p>Customer Segments</p></div>
        <div className="card stat-card"><h3>{stats.reports}</h3><p>Analytics Reports</p></div>
        <div className="card stat-card"><h3>{stats.ai}</h3><p>AI Conversations</p></div>
      </div>
      <div className="grid-two">
        <div className="card">
          <h2>Current session</h2>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
          <p><strong>Access:</strong> {user.role === 'admin' ? 'Can manage users, reports, and deletions' : 'Can create and manage owned campaigns and segments'}</p>
        </div>
        <div className="card">
          <h2>Workflow</h2>
          <ol>
            <li>Create campaigns and segments.</li>
            <li>Generate analytics reports from real entities.</li>
            <li>Ask the AI assistant to summarize results.</li>
            <li>Review saved AI conversation history.</li>
          </ol>
        </div>
      </div>
    </PageShell>
  )
}
