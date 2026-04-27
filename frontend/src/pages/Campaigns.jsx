import { useEffect, useState } from 'react'
import PageShell from '../components/PageShell'
import { api } from '../service/api'
import { useAuth } from '../context/Authenticator'
import ErrorBanner from '../components/ErrorBanner'
import FormField from '../components/FormField'

const emptyForm = { title: '', description: '', channel: '', start_date: '', end_date: '' }

export default function Campaigns() {
  const { user } = useAuth()
  const [campaigns, setCampaigns] = useState([])
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState(null)

  const load = async () => {
    try {
      setCampaigns(await api.getCampaigns())
    } catch (err) {
      setError(err)
    }
  }

  useEffect(() => { load() }, [])

  const submit = async (e) => {
    e.preventDefault()
    setError(null)
    try {
      if (editingId) await api.updateCampaign(editingId, { ...form, owner_id: user.user_id })
      else await api.createCampaign({ ...form, owner_id: user.user_id })
      setForm(emptyForm)
      setEditingId(null)
      await load()
    } catch (err) {
      setError(err)
    }
  }

  const edit = (campaign) => {
    setEditingId(campaign.campaign_id)
    setForm({
      title: campaign.title,
      description: campaign.description || '',
      channel: campaign.channel || '',
      start_date: campaign.start_date || '',
      end_date: campaign.end_date || '',
    })
  }

  const remove = async (id) => {
    try {
      await api.deleteCampaign(id)
      await load()
    } catch (err) {
      setError(err)
    }
  }

  return (
    <PageShell title="Campaign Management" subtitle="Full CRUD for campaigns with role-based deletion.">
      <ErrorBanner error={error} />
      <div className="grid-two">
        <form className="card form-grid" onSubmit={submit}>
          <h2>{editingId ? 'Edit Campaign' : 'Create Campaign'}</h2>
          <FormField label="Title"><input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></FormField>
          <FormField label="Channel"><input value={form.channel} onChange={(e) => setForm({ ...form, channel: e.target.value })} /></FormField>
          <FormField label="Start date"><input type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} /></FormField>
          <FormField label="End date"><input type="date" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} /></FormField>
          <label className="form-field span-2"><span>Description</span><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
          <div className="button-row span-2">
            <button className="primary-btn" type="submit">{editingId ? 'Update campaign' : 'Create campaign'}</button>
            {editingId && <button className="secondary-btn" type="button" onClick={() => { setEditingId(null); setForm(emptyForm) }}>Cancel</button>}
          </div>
        </form>
        <div className="card">
          <h2>Current campaigns</h2>
          {campaigns.length === 0 ? <p>No campaigns yet.</p> : campaigns.map((campaign) => (
            <div key={campaign.campaign_id} className="list-item">
              <div>
                <strong>{campaign.title}</strong>
                <p>{campaign.description}</p>
                <small>{campaign.channel} · {campaign.start_date} to {campaign.end_date}</small>
              </div>
              <div className="button-row">
                <button className="secondary-btn" onClick={() => edit(campaign)}>Edit</button>
                {user.role === 'admin' && <button className="danger-btn" onClick={() => remove(campaign.campaign_id)}>Delete</button>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  )
}
