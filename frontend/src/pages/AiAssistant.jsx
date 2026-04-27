import { useEffect, useState } from 'react'
import PageShell from '../components/PageShell'
import ErrorBanner from '../components/ErrorBanner'
import { api } from '../service/api'
import { useAuth } from '../context/Authenticator'

export default function AiAssistant() {
  const { user } = useAuth()
  const [prompt, setPrompt] = useState('Which customer segment should receive more budget next month?')
  const [history, setHistory] = useState([])
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const load = async () => {
    try {
      setHistory(await api.getAiHistory(user.user_id))
    } catch (err) {
      setError(err)
    }
  }

  useEffect(() => { load() }, [user.user_id])

  const submit = async (e) => {
    e.preventDefault()
    try {
      const response = await api.sendAiPrompt({ prompt, use_live_llm: false })
      setResult(response)
      setPrompt('')
      await load()
    } catch (err) {
      setError(err)
    }
  }

  return (
    <PageShell title="AI Assistant" subtitle="Ask the MCP-style analytics assistant for summaries and recommendations.">
      <ErrorBanner error={error} />
      <div className="grid-two">
        <div className="card">
          <h2>Ask a question</h2>
          <form onSubmit={submit} className="form-grid">
            <label className="form-field span-2"><span>Prompt</span><textarea rows="6" value={prompt} onChange={(e) => setPrompt(e.target.value)} /></label>
            <button className="primary-btn span-2" type="submit">Submit to AI</button>
          </form>
          {result && (
            <div className="response-card">
              <h3>Latest response</h3>
              <p>{result.response}</p>
              <p><strong>Tools used:</strong> {result.tools_used?.join(', ')}</p>
            </div>
          )}
        </div>
        <div className="card">
          <h2>Conversation history</h2>
          {history.length === 0 ? <p>No saved conversations yet.</p> : history.map((item) => (
            <div key={item.conversation_id} className="list-item">
              <div>
                <strong>{item.prompt}</strong>
                <p>{item.response}</p>
                <small>{item.timestamp}</small>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  )
}
