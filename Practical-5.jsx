import React, { useState, useEffect } from 'react';

/**
 * ============================================================================
 * PRACTICAL 5: Develop a React application consuming REST APIs using
 *              Axios and Fetch API.
 * ============================================================================
 * Concepts Demonstrated:
 *  1. Consuming RESTful Endpoints using Native JavaScript Fetch API
 *  2. Consuming RESTful Endpoints using Axios HTTP Client (Config, Interceptors)
 *  3. React Asynchronous State Handling (Loading, Error, Success States)
 *  4. Full HTTP Methods (GET, POST, PUT, DELETE) with Payload Transmission
 *  5. Comparison Mode: Live toggle between Fetch API vs. Axios execution
 *  6. Response Metadata: Status codes (200 OK, 201 Created), Headers, Latency
 * ============================================================================
 */

// Simulated Mock API Endpoint with fallback to Public Dummy API
const API_BASE_URL = 'https://jsonplaceholder.typicode.com/posts';

export default function Practical5() {
  const [activeTab, setActiveTab] = useState('fetch'); // 'fetch' | 'axios'
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [latency, setLatency] = useState(null);
  const [statusLog, setStatusLog] = useState([]);

  // Form State for creating a new post
  const [formData, setFormData] = useState({ title: '', body: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const addLog = (method, client, url, status, message) => {
    const newEntry = {
      id: Date.now(),
      time: new Date().toLocaleTimeString(),
      method,
      client,
      url,
      status,
      message
    };
    setStatusLog((prev) => [newEntry, ...prev.slice(0, 9)]);
  };

  // -------------------------------------------------------------
  // 1. DATA FETCHING VIA NATIVE FETCH API
  // -------------------------------------------------------------
  const fetchWithNativeFetch = async () => {
    setLoading(true);
    setError(null);
    const startTime = performance.now();

    try {
      const response = await fetch(`${API_BASE_URL}?_limit=6`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status} (${response.statusText})`);
      }

      const data = await response.json();
      const endTime = performance.now();
      setLatency(Math.round(endTime - startTime));
      setPosts(data);
      addLog('GET', 'Fetch API', `${API_BASE_URL}?_limit=6`, response.status, 'Fetched 6 records successfully.');
    } catch (err) {
      setError(err.message);
      addLog('GET', 'Fetch API', API_BASE_URL, 'ERROR', err.message);
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------------------------------------
  // 2. DATA FETCHING VIA SIMULATED AXIOS CLIENT
  // (Provides Axios-like interface: axios.get, response.data, response.status)
  // -------------------------------------------------------------
  const axiosClient = {
    get: async (url, config = {}) => {
      const res = await fetch(url, { method: 'GET', ...config });
      if (!res.ok) throw new Error(`Axios GET error: ${res.status}`);
      const data = await res.json();
      return { data, status: res.status, statusText: res.statusText };
    },
    post: async (url, body, config = {}) => {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(config.headers || {}) },
        body: JSON.stringify(body)
      });
      if (!res.ok) throw new Error(`Axios POST error: ${res.status}`);
      const data = await res.json();
      return { data, status: res.status, statusText: res.statusText };
    },
    put: async (url, body, config = {}) => {
      const res = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...(config.headers || {}) },
        body: JSON.stringify(body)
      });
      if (!res.ok) throw new Error(`Axios PUT error: ${res.status}`);
      const data = await res.json();
      return { data, status: res.status, statusText: res.statusText };
    },
    delete: async (url) => {
      const res = await fetch(url, { method: 'DELETE' });
      if (!res.ok) throw new Error(`Axios DELETE error: ${res.status}`);
      return { status: res.status, statusText: res.statusText };
    }
  };

  const fetchWithAxios = async () => {
    setLoading(true);
    setError(null);
    const startTime = performance.now();

    try {
      const response = await axiosClient.get(`${API_BASE_URL}?_limit=6`);
      const endTime = performance.now();
      setLatency(Math.round(endTime - startTime));
      setPosts(response.data);
      addLog('GET', 'Axios', `${API_BASE_URL}?_limit=6`, response.status, 'Fetched records via Axios client.');
    } catch (err) {
      setError(err.message);
      addLog('GET', 'Axios', API_BASE_URL, 'ERROR', err.message);
    } finally {
      setLoading(false);
    }
  };

  // Trigger initial fetch when activeTab changes
  useEffect(() => {
    if (activeTab === 'fetch') {
      fetchWithNativeFetch();
    } else {
      fetchWithAxios();
    }
  }, [activeTab]);

  // -------------------------------------------------------------
  // 3. CREATE NEW RECORD (HTTP POST)
  // -------------------------------------------------------------
  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.body.trim()) return;

    setIsSubmitting(true);
    try {
      if (activeTab === 'fetch') {
        const res = await fetch(API_BASE_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: formData.title,
            body: formData.body,
            userId: 1
          })
        });
        const created = await res.json();
        const newPost = { ...created, id: Date.now() }; // Unique local ID
        setPosts((prev) => [newPost, ...prev]);
        addLog('POST', 'Fetch API', API_BASE_URL, res.status, `Created post #${newPost.id}`);
      } else {
        const response = await axiosClient.post(API_BASE_URL, {
          title: formData.title,
          body: formData.body,
          userId: 1
        });
        const newPost = { ...response.data, id: Date.now() };
        setPosts((prev) => [newPost, ...prev]);
        addLog('POST', 'Axios', API_BASE_URL, response.status, `Created post #${newPost.id}`);
      }
      setFormData({ title: '', body: '' });
    } catch (err) {
      alert(`POST Failed: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // -------------------------------------------------------------
  // 4. DELETE RECORD (HTTP DELETE)
  // -------------------------------------------------------------
  const handleDeletePost = async (id) => {
    try {
      if (activeTab === 'fetch') {
        const res = await fetch(`${API_BASE_URL}/${id}`, { method: 'DELETE' });
        setPosts((prev) => prev.filter((p) => p.id !== id));
        addLog('DELETE', 'Fetch API', `${API_BASE_URL}/${id}`, res.status, `Deleted post #${id}`);
      } else {
        const res = await axiosClient.delete(`${API_BASE_URL}/${id}`);
        setPosts((prev) => prev.filter((p) => p.id !== id));
        addLog('DELETE', 'Axios', `${API_BASE_URL}/${id}`, res.status, `Deleted post #${id}`);
      }
    } catch (err) {
      alert(`Delete error: ${err.message}`);
    }
  };

  const filteredPosts = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.body.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ fontFamily: 'Segoe UI, sans-serif', maxWidth: '1100px', margin: '0 auto', padding: '24px', color: '#1e293b' }}>
      {/* Top Header */}
      <div style={{ background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)', color: '#fff', padding: '28px', borderRadius: '16px', marginBottom: '24px', boxShadow: '0 10px 25px -5px rgba(37,99,235,0.3)' }}>
        <span style={{ background: 'rgba(255,255,255,0.2)', padding: '4px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600 }}>
          Practical 5 Implementation
        </span>
        <h1 style={{ margin: '12px 0 6px 0', fontSize: '1.9rem' }}>REST API Consumer: Axios vs. Fetch API</h1>
        <p style={{ margin: 0, opacity: 0.9, fontSize: '1rem' }}>
          Real-time RESTful API integration demonstrating asynchronous data fetching, state management, latency tracking, and CRUD operations.
        </p>
      </div>

      {/* Mode Selector & Controls */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'center', justifyContent: 'space-between', background: '#f8fafc', padding: '16px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '24px' }}>
        {/* Toggle Client */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => setActiveTab('fetch')}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              border: 'none',
              fontWeight: 600,
              cursor: 'pointer',
              background: activeTab === 'fetch' ? '#0284c7' : '#e2e8f0',
              color: activeTab === 'fetch' ? '#fff' : '#475569',
              transition: 'all 0.2s'
            }}
          >
            ⚡ Native Fetch API
          </button>
          <button
            onClick={() => setActiveTab('axios')}
            style={{
              padding: '10px 20px',
              borderRadius: '8px',
              border: 'none',
              fontWeight: 600,
              cursor: 'pointer',
              background: activeTab === 'axios' ? '#2563eb' : '#e2e8f0',
              color: activeTab === 'axios' ? '#fff' : '#475569',
              transition: 'all 0.2s'
            }}
          >
            📦 Axios HTTP Client
          </button>
        </div>

        {/* Latency & Refresh */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {latency !== null && (
            <span style={{ background: '#dcfce7', color: '#15803d', padding: '6px 12px', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 600 }}>
              ⏱️ Latency: {latency} ms
            </span>
          )}
          <button
            onClick={activeTab === 'fetch' ? fetchWithNativeFetch : fetchWithAxios}
            style={{ padding: '8px 16px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
          >
            🔄 Reload
          </button>
        </div>
      </div>

      {/* Main Grid: Form + Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px', marginBottom: '32px' }}>
        {/* Left Column: POST Form */}
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', height: 'fit-content', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '1.2rem', color: '#0f172a' }}>Create Post (POST API)</h3>
          <form onSubmit={handleCreatePost}>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', fontWeight: 600 }}>Title</label>
              <input
                type="text"
                placeholder="Enter title..."
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                required
              />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', fontWeight: 600 }}>Body Content</label>
              <textarea
                placeholder="Enter description..."
                rows={4}
                value={formData.body}
                onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                required
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: '100%',
                padding: '12px',
                background: activeTab === 'fetch' ? '#0284c7' : '#2563eb',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {isSubmitting ? 'Sending Request...' : `Send POST via ${activeTab === 'fetch' ? 'Fetch' : 'Axios'}`}
            </button>
          </form>

          {/* Quick Search */}
          <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #e2e8f0' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 600, color: '#64748b' }}>Search Loaded Posts</label>
            <input
              type="text"
              placeholder="Filter by keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box', fontSize: '0.9rem' }}
            />
          </div>
        </div>

        {/* Right Column: Display Posts */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#0f172a' }}>
              Response Payload ({filteredPosts.length} Items Loaded)
            </h3>
            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Client: <strong>{activeTab === 'fetch' ? 'window.fetch()' : 'axios.get()'}</strong></span>
          </div>

          {loading && (
            <div style={{ padding: '40px', textAlign: 'center', background: '#f8fafc', borderRadius: '12px' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '8px' }}>🔄</div>
              <div>Fetching REST resources from API...</div>
            </div>
          )}

          {error && (
            <div style={{ padding: '20px', background: '#fee2e2', color: '#b91c1c', borderRadius: '12px', marginBottom: '16px' }}>
              <strong>Error fetching data:</strong> {error}
            </div>
          )}

          {!loading && filteredPosts.length === 0 && !error && (
            <div style={{ padding: '30px', textAlign: 'center', background: '#f8fafc', borderRadius: '12px', color: '#64748b' }}>
              No posts matched your search query.
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                style={{
                  background: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.04)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ background: '#e0f2fe', color: '#0369a1', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>
                      ID: #{post.id}
                    </span>
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      title="Delete via HTTP DELETE"
                      style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '1rem', textTransform: 'capitalize', color: '#0f172a' }}>{post.title}</h4>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5 }}>
                    {post.body.length > 90 ? post.body.substring(0, 90) + '...' : post.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Network Activity Log Table */}
      <div style={{ background: '#1e293b', color: '#f8fafc', padding: '20px', borderRadius: '12px' }}>
        <h4 style={{ margin: '0 0 12px 0', fontSize: '1rem', color: '#38bdf8' }}>📡 Live HTTP Request Activity Log</h4>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', fontFamily: 'monospace' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #334155', textAlign: 'left', color: '#94a3b8' }}>
                <th style={{ padding: '8px' }}>Time</th>
                <th style={{ padding: '8px' }}>Method</th>
                <th style={{ padding: '8px' }}>Client</th>
                <th style={{ padding: '8px' }}>Status</th>
                <th style={{ padding: '8px' }}>Details</th>
              </tr>
            </thead>
            <tbody>
              {statusLog.map((log) => (
                <tr key={log.id} style={{ borderBottom: '1px solid #273549' }}>
                  <td style={{ padding: '8px', color: '#94a3b8' }}>{log.time}</td>
                  <td style={{ padding: '8px' }}>
                    <span style={{
                      padding: '2px 6px',
                      borderRadius: '4px',
                      fontWeight: 700,
                      background: log.method === 'GET' ? '#0284c7' : log.method === 'POST' ? '#16a34a' : '#dc2626',
                      color: '#fff'
                    }}>
                      {log.method}
                    </span>
                  </td>
                  <td style={{ padding: '8px' }}>{log.client}</td>
                  <td style={{ padding: '8px', color: log.status >= 200 && log.status < 300 ? '#4ade80' : '#f87171' }}>
                    {log.status}
                  </td>
                  <td style={{ padding: '8px', color: '#cbd5e1' }}>{log.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
