import { logClient, logClientError } from './logger'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

function getToken() {
  return localStorage.getItem('token')
}

async function request(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }
  const token = getToken()
  if (token) headers.Authorization = `Bearer ${token}`

  try {
    const res = await fetch(`${API_BASE}${path}`, { ...options, headers })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      const error = new Error(data.error || 'Request failed')
      error.details = data.details
      throw error
    }
    logClient(`api:${options.method || 'GET'}:${path}`)
    return data
  } catch (error) {
    logClientError(`api:${options.method || 'GET'}:${path}`, error)
    throw error
  }
}

export const api = {
  register: (payload) => request('/register', { method: 'POST', body: JSON.stringify(payload) }),
  login: (payload) => request('/login', { method: 'POST', body: JSON.stringify(payload) }),
  me: () => request('/me'),
  getUsers: () => request('/users'),

  getCampaigns: () => request('/campaigns'),
  getCampaign: (id) => request(`/campaigns/${id}`),
  createCampaign: (payload) => request('/campaigns', { method: 'POST', body: JSON.stringify(payload) }),
  updateCampaign: (id, payload) => request(`/campaigns/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteCampaign: (id) => request(`/campaigns/${id}`, { method: 'DELETE' }),

  getSegments: () => request('/segments'),
  getSegment: (id) => request(`/segments/${id}`),
  createSegment: (payload) => request('/segments', { method: 'POST', body: JSON.stringify(payload) }),
  updateSegment: (id, payload) => request(`/segments/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  deleteSegment: (id) => request(`/segments/${id}`, { method: 'DELETE' }),

  getReports: () => request('/reports'),
  getCampaignReports: (campaignId) => request(`/reports/campaign/${campaignId}`),
  generateReport: (payload) => request('/reports/generate', { method: 'POST', body: JSON.stringify(payload) }),

  getAiHistory: (userId) => request(`/ai/history/${userId}`),
  sendAiPrompt: (payload) => request('/ai/chat', { method: 'POST', body: JSON.stringify(payload) }),
}
