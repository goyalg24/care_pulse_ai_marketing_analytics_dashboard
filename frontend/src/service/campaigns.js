const BASE_URL = 'http://localhost:8080/api/campaigns';

export const campaignService = {
  getAll: async (ownerId) => {
    // Allows filtering by owner_id if needed
    const url = ownerId ? `${BASE_URL}?owner_id=${ownerId}` : BASE_URL;
    const res = await fetch(url);
    return res.json();
  },

  getById: async (id) => {
    const res = await fetch(`${BASE_URL}/${id}`);
    return res.json();
  },

  create: async (data) => {
    const res = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  update: async (id, data) => {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  delete: async (id) => {
    const res = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
    return res.json();
  }
};