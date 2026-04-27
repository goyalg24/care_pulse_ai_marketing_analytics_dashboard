import { useEffect, useState } from 'react'
import PageShell from '../components/PageShell'
import ErrorBanner from '../components/ErrorBanner'
import FormField from '../components/FormField'
import { api } from '../service/api'
import { useAuth } from '../context/Authenticator'

const initialMetrics = '{"impressions": 25000, "clicks": 2800, "conversions": 310, "revenue": 14000}'

export default function Analytics() {
  const { user } = useAuth()
  const [reports, setReports] = useState([])
  const [campaigns, setCampaigns] = useState([])
  const [segments, setSegments] = useState([])
  const [error, setError] = useState(null)
  const [form, setForm] = useState({ campaign_id: '', segment_id: '', metrics: initialMetrics })

  const load = async () => {
    try {
      const [reportRows, campaignRows, segmentRows] = await Promise.all([
        api.getReports(),
        api.getCampaigns(),
        api.getSegments(),
      ])
      setReports(reportRows)
      setCampaigns(campaignRows)
      setSegments(segmentRows)
    } catch (err) {
      setError(err)
    }
  }

  useEffect(() => { load() }, [])

  const generate = async (e) => {
    e.preventDefault()
    try {
      await api.generateReport({
        campaign_id: Number(form.campaign_id),
        segment_id: Number(form.segment_id),
        metrics_data: JSON.parse(form.metrics),
      })
      await load()
    } catch (err) {
      setError(err)
    }
  }

  return (
    <PageShell title="Analytics Reports" subtitle="Read reports and, if you are an admin, generate new ones.">
      <ErrorBanner error={error} />
      <div className="grid-two">
        <div className="card">
          <h2>Report feed</h2>
          {reports.length === 0 ? <p>No reports available.</p> : reports.map((report) => (
            <div key={report.report_id} className="list-item">
              <div>
                <strong>Report #{report.report_id}</strong>
                <p>Campaign ID: {report.campaign_id} · Segment ID: {report.segment_id}</p>
                <pre className="criteria-box">{JSON.stringify(report.metrics_data, null, 2)}</pre>
              </div>
            </div>
          ))}
        </div>
        <div className="card">
          <h2>Generate report</h2>
          {user.role !== 'admin' ? (
            <p>Only admins can generate reports. Analysts can still view all reports.</p>
          ) : (
            <form className="form-grid" onSubmit={generate}>
              <FormField label="Campaign">
                <select value={form.campaign_id} onChange={(e) => setForm({ ...form, campaign_id: e.target.value })}>
                  <option value="">Select campaign</option>
                  {campaigns.map((campaign) => <option key={campaign.campaign_id} value={campaign.campaign_id}>{campaign.title}</option>)}
                </select>
              </FormField>
              <FormField label="Segment">
                <select value={form.segment_id} onChange={(e) => setForm({ ...form, segment_id: e.target.value })}>
                  <option value="">Select segment</option>
                  {segments.map((segment) => <option key={segment.segment_id} value={segment.segment_id}>{segment.name}</option>)}
                </select>
              </FormField>
              <label className="form-field span-2"><span>Metrics JSON</span><textarea rows="8" value={form.metrics} onChange={(e) => setForm({ ...form, metrics: e.target.value })} /></label>
              <button className="primary-btn span-2" type="submit">Generate report</button>
            </form>
          )}
        </div>
      </div>
    </PageShell>
  )
}
