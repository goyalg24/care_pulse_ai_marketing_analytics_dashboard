import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { campaignService } from '../service/campaigns.js'; 

export default function Campaigns() {
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    channel: '', 
    start_date: '',
    end_date: '',
    owner_id: 1 
  });

  const loadCampaigns = useCallback(async () => {
    try {
      const data = await campaignService.getAll();
      setCampaigns(data);
    } catch (error) {
      console.error("Failed to fetch:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    const timer = setTimeout(() => {
      if (isMounted) loadCampaigns();
    }, 0);
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [loadCampaigns]);

  const handleCreate = async (e) => {
    e.preventDefault(); 
    try {
      await campaignService.create(formData);
      setShowForm(false); 
      setFormData({ title: '', description: '', channel: '', start_date: '', end_date: '', owner_id: 1 });
      await loadCampaigns();
    } catch (error) {
      console.error("Save failed:", error);
      alert("Could not save campaign. Check console for details.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      await campaignService.delete(id);
      loadCampaigns();
    }
  };

  return (
    <>
      <Header />
      <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <button 
          onClick={() => navigate('/dashboard')}
          style={{ background: '#667eea', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '8px', cursor: 'pointer', marginBottom: '1rem' }}
        >
          ← Back to Dashboard
        </button>

        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ marginBottom: '1.5rem' }}>Marketing Campaigns</h1>
          <button 
            onClick={() => setShowForm(!showForm)}
            style={{ 
              background: showForm ? '#e53e3e' : '#48bb78', 
              color: 'white', 
              border: 'none', 
              padding: '0.75rem 1.5rem', 
              borderRadius: '8px', 
              cursor: 'pointer' 
            }}
          >
            {showForm ? 'Cancel' : '+ Create Campaign'}
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleCreate} style={{ background: '#f7fafc', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr' }}>
              <input 
                type="text" 
                placeholder="Campaign Title" 
                required 
                value={formData.title} 
                onChange={e => setFormData({...formData, title: e.target.value})} 
                style={{ padding: '0.8rem', borderRadius: '4px', border: '1px solid #ccc' }} 
              />
              
              <input 
                type="email" 
                placeholder="Your Email / Channel" 
                required 
                value={formData.channel} 
                onChange={e => setFormData({...formData, channel: e.target.value})} 
                style={{ padding: '0.8rem', borderRadius: '4px', border: '1px solid #ccc' }} 
              />

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={{ fontSize: '0.8rem', color: '#666' }}>Start Date</label>
                <input type="date" required value={formData.start_date} onChange={e => setFormData({...formData, start_date: e.target.value})} style={{ padding: '0.8rem' }} />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <label style={{ fontSize: '0.8rem', color: '#666' }}>End Date</label>
                <input type="date" required value={formData.end_date} onChange={e => setFormData({...formData, end_date: e.target.value})} style={{ padding: '0.8rem' }} />
              </div>

              <textarea 
                placeholder="Description" 
                style={{ gridColumn: 'span 2', padding: '0.8rem', borderRadius: '4px', border: '1px solid #ccc', minHeight: '80px' }} 
                value={formData.description} 
                onChange={e => setFormData({...formData, description: e.target.value})} 
              />
            </div>
            
            <button 
              type="submit" 
              style={{ marginTop: '1.5rem', background: '#48bb78', color: 'white', border: 'none', padding: '0.75rem 2rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Save Campaign
            </button>
          </form>
        )}
        
        <div style={{ marginTop: '2rem' }}>
          <h2>Active Campaigns</h2>
          
          {loading ? (
            <p>Loading...</p>
          ) : campaigns.length > 0 ? (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {campaigns.map((c) => (
                <div key={c.campaign_id} style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white' }}>
                  <div>
                    <h3 style={{ margin: 0 }}>{c.title}</h3>
                    <p style={{ margin: '0.5rem 0', color: '#666' }}>{c.description}</p>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <span style={{ background: '#edf2f7', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem' }}>{c.channel}</span>
                      <small style={{ color: '#888' }}>{c.start_date} to {c.end_date}</small>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDelete(c.campaign_id)}
                    style={{ background: '#ff4d4d', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p>No campaigns found. Start by creating one!</p>
          )}
        </div>
      </div>
    </>
  );
}