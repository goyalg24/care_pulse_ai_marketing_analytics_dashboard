import { useEffect, useState } from 'react'
import PageShell from '../components/PageShell'
import ErrorBanner from '../components/ErrorBanner'
import FormField from '../components/FormField'
import { api } from '../service/api'
import { useAuth } from '../context/Authenticator'

const blank = { name: '', description: '', criteriaText: '{"region":"National","risk":"High"}' }

export default function Segments() {
  const { user } = useAuth()
  const [segments, setSegments] = useState([])
  const [form, setForm] = useState(blank)
  const [editingId, setEditingId] = useState(null)
  const [error, setError] = useState(null)

  const load = async () => {
    try {
      setSegments(await api.getSegments())
    } catch (err) {
      setError(err)
    }
  }

  useEffect(() => { load() }, [])

  const submit = async (e) => {
    e.preventDefault()
    setError(null)
    try {
      const payload = {
        name: form.name,
        description: form.description,
        criteria: JSON.parse(form.criteriaText),
        created_by: user.user_id,
      }
      if (editingId) await api.updateSegment(editingId, payload)
      else await api.createSegment(payload)
      setForm(blank)
      setEditingId(null)
      await load()
    } catch (err) {
      setError(err)
    }
  }

  const edit = (segment) => {
    setEditingId(segment.segment_id)
    setForm({
      name: segment.name,
      description: segment.description || '',
      criteriaText: JSON.stringify(segment.criteria, null, 2),
    })
  }

  const remove = async (id) => {
    try {
      await api.deleteSegment(id)
      await load()
    } catch (err) {
      setError(err)
    }
  }

  return (
    <PageShell title="Customer Segments" subtitle="Second full CRUD entity with admin-controlled updates and deletes.">
      <ErrorBanner error={error} />
      <div className="grid-two">
        <form className="card form-grid" onSubmit={submit}>
          <h2>{editingId ? 'Edit Segment' : 'Create Segment'}</h2>
          <FormField label="Name"><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></FormField>
          <label className="form-field span-2"><span>Description</span><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></label>
          <label className="form-field span-2"><span>Criteria JSON</span><textarea rows="8" value={form.criteriaText} onChange={(e) => setForm({ ...form, criteriaText: e.target.value })} /></label>
          <div className="button-row span-2">
            <button className="primary-btn" type="submit">{editingId ? 'Update segment' : 'Create segment'}</button>
            {editingId && <button className="secondary-btn" type="button" onClick={() => { setEditingId(null); setForm(blank) }}>Cancel</button>}
          </div>
        </form>
        <div className="card">
          <h2>Saved segments</h2>
          {segments.length === 0 ? <p>No segments yet.</p> : segments.map((segment) => (
            <div key={segment.segment_id} className="list-item">
              <div>
                <strong>{segment.name}</strong>
                <p>{segment.description}</p>
                <pre className="criteria-box">{JSON.stringify(segment.criteria, null, 2)}</pre>
              </div>
              <div className="button-row">
                {user.role === 'admin' && <button className="secondary-btn" onClick={() => edit(segment)}>Edit</button>}
                {user.role === 'admin' && <button className="danger-btn" onClick={() => remove(segment.segment_id)}>Delete</button>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  )
}
