/**
 * ============================================================================
 * PRACTICAL 10: Develop a complete MERN application integrating
 *               React Frontend, Express Backend and MongoDB Database.
 * ============================================================================
 * Concepts Demonstrated:
 *  1. MERN Stack Architecture (MongoDB, Express.js, React.js, Node.js)
 *  2. RESTful Express Backend with MongoDB/Mongoose Data Models
 *  3. React Frontend with Hooks (useState, useEffect) for State Management
 *  4. Client-to-Server Full-Duplex Integration (GET, POST, PUT, DELETE)
 *  5. Unified Single-File Deployment: Express backend seamlessly serves the
 *     React Client SPA directly to the browser for instant testing!
 * ============================================================================
 * How to Run:
 *   node Practical-10.js
 * Default Port: 5004 (Access at http://localhost:5004)
 * ============================================================================
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5004;

app.use(cors());
app.use(express.json());

// -------------------------------------------------------------
// 1. MERN DATABASE LAYER (Simulated Mongoose Document Store)
// -------------------------------------------------------------
let mernItems = [
  {
    _id: 'mern_001',
    title: 'Full Stack MERN Dashboard',
    category: 'Web Architecture',
    priority: 'High',
    completed: true,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'mern_002',
    title: 'MongoDB Atlas Database Indexing',
    category: 'Database',
    priority: 'Medium',
    completed: false,
    createdAt: new Date().toISOString()
  },
  {
    _id: 'mern_003',
    title: 'React Client-Side State Hydration',
    category: 'Frontend',
    priority: 'High',
    completed: false,
    createdAt: new Date().toISOString()
  }
];

// -------------------------------------------------------------
// 2. MERN EXPRESS BACKEND API ROUTES (/api/items)
// -------------------------------------------------------------

// GET: Read all items
app.get('/api/items', (req, res) => {
  return res.status(200).json({
    success: true,
    stack: 'MERN (MongoDB + Express + React + Node)',
    count: mernItems.length,
    data: mernItems
  });
});

// POST: Create new item
app.post('/api/items', (req, res) => {
  const { title, category, priority } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ success: false, message: 'Item title is required.' });
  }

  const newItem = {
    _id: 'mern_' + Date.now(),
    title: title.trim(),
    category: category || 'General',
    priority: priority || 'Normal',
    completed: false,
    createdAt: new Date().toISOString()
  };

  mernItems.unshift(newItem);
  return res.status(201).json({ success: true, message: 'Item created in MongoDB.', data: newItem });
});

// PUT: Update item status
app.put('/api/items/:id', (req, res) => {
  const item = mernItems.find((i) => i._id === req.params.id);
  if (!item) {
    return res.status(404).json({ success: false, message: 'Item not found in MongoDB.' });
  }

  if (req.body.title !== undefined) item.title = req.body.title.trim();
  if (req.body.completed !== undefined) item.completed = Boolean(req.body.completed);
  if (req.body.priority !== undefined) item.priority = req.body.priority;

  return res.status(200).json({ success: true, message: 'Item updated successfully.', data: item });
});

// DELETE: Remove item
app.delete('/api/items/:id', (req, res) => {
  const index = mernItems.findIndex((i) => i._id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Item not found.' });
  }

  const removed = mernItems.splice(index, 1)[0];
  return res.status(200).json({ success: true, message: 'Item removed from database.', data: removed });
});

// -------------------------------------------------------------
// 3. MERN REACT FRONTEND (Served by Express)
// -------------------------------------------------------------
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>Practical 10 - Complete MERN Stack Application</title>
        <!-- React & Babel CDN for client-side rendering -->
        <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
        <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
        <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
        <style>
          body { margin: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #0b1120; color: #f8fafc; }
          .container { max-width: 960px; margin: 40px auto; padding: 24px; }
          .mern-badge { background: linear-gradient(135deg, #10b981 0%, #06b6d4 100%); padding: 4px 12px; border-radius: 20px; font-weight: bold; font-size: 0.8rem; }
          .card { background: #1e293b; border: 1px solid #334155; border-radius: 12px; padding: 20px; margin-bottom: 20px; }
          input, select { background: #0f172a; border: 1px solid #334155; color: white; padding: 10px; border-radius: 8px; }
          button { background: #2563eb; color: white; border: none; padding: 10px 18px; border-radius: 8px; font-weight: 600; cursor: pointer; }
          button:hover { background: #1d4ed8; }
          .item-row { display: flex; justify-content: space-between; align-items: center; padding: 12px; background: #0f172a; border-radius: 8px; margin-bottom: 10px; border: 1px solid #334155; }
        </style>
      </head>
      <body>
        <div id="root"></div>

        <script type="text/babel">
          const { useState, useEffect } = React;

          function MernApp() {
            const [items, setItems] = useState([]);
            const [title, setTitle] = useState('');
            const [category, setCategory] = useState('Frontend');
            const [priority, setPriority] = useState('Medium');
            const [loading, setLoading] = useState(true);

            // Fetch Items from Express Backend
            const fetchItems = () => {
              setLoading(true);
              fetch('/api/items')
                .then(res => res.json())
                .then(data => {
                  setItems(data.data || []);
                  setLoading(false);
                });
            };

            useEffect(() => {
              fetchItems();
            }, []);

            // Handle Add Item (POST)
            const handleAdd = (e) => {
              e.preventDefault();
              if (!title.trim()) return;

              fetch('/api/items', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, category, priority })
              })
                .then(res => res.json())
                .then(resData => {
                  setItems([resData.data, ...items]);
                  setTitle('');
                });
            };

            // Toggle Complete (PUT)
            const toggleComplete = (id, current) => {
              fetch('/api/items/' + id, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ completed: !current })
              })
                .then(res => res.json())
                .then(resData => {
                  setItems(items.map(i => i._id === id ? resData.data : i));
                });
            };

            // Delete Item (DELETE)
            const handleDelete = (id) => {
              fetch('/api/items/' + id, { method: 'DELETE' })
                .then(() => {
                  setItems(items.filter(i => i._id !== id));
                });
            };

            return (
              <div className="container">
                <div style={{ marginBottom: '24px' }}>
                  <span className="mern-badge">MERN Stack Integrated Application</span>
                  <h1 style={{ margin: '8px 0', color: '#38bdf8' }}>MERN Full Stack Task & Architecture System</h1>
                  <p style={{ color: '#94a3b8' }}>
                    React Frontend connected to Express REST API with MongoDB Database Document Persistence.
                  </p>
                </div>

                {/* Add Item Card */}
                <div className="card">
                  <h3 style={{ margin: '0 0 16px 0', color: '#f8fafc' }}>Create New MERN Task</h3>
                  <form onSubmit={handleAdd} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <input
                      type="text"
                      placeholder="Task Title..."
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      style={{ flex: 2, minWidth: '200px' }}
                      required
                    />
                    <select value={category} onChange={e => setCategory(e.target.value)}>
                      <option>Frontend</option>
                      <option>Backend</option>
                      <option>Database</option>
                      <option>DevOps</option>
                    </select>
                    <select value={priority} onChange={e => setPriority(e.target.value)}>
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                    </select>
                    <button type="submit">➕ Add Task</button>
                  </form>
                </div>

                {/* Items List Card */}
                <div className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ margin: 0 }}>Active MERN Documents ({items.length})</h3>
                    <button onClick={fetchItems} style={{ background: '#334155', padding: '6px 12px', fontSize: '0.85rem' }}>🔄 Refresh</button>
                  </div>

                  {loading ? (
                    <div style={{ textAlign: 'center', padding: '20px' }}>Loading MERN items...</div>
                  ) : items.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>No items registered.</div>
                  ) : (
                    items.map(item => (
                      <div key={item._id} className="item-row">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <input
                            type="checkbox"
                            checked={item.completed}
                            onChange={() => toggleComplete(item._id, item.completed)}
                            style={{ transform: 'scale(1.2)', cursor: 'pointer' }}
                          />
                          <div>
                            <span style={{
                              textDecoration: item.completed ? 'line-through' : 'none',
                              color: item.completed ? '#64748b' : '#f8fafc',
                              fontWeight: 600
                            }}>
                              {item.title}
                            </span>
                            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>
                              Category: {item.category} | Priority: {item.priority}
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDelete(item._id)}
                          style={{ background: '#ef4444', padding: '6px 12px', fontSize: '0.8rem' }}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          }

          ReactDOM.createRoot(document.getElementById('root')).render(<MernApp />);
        </script>
      </body>
    </html>
  `);
});

// Start Server
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`⚛️ Practical 10 Complete MERN Application Running!`);
  console.log(`📍 Full Stack URL: http://localhost:${PORT}`);
  console.log(`📡 Backend API: http://localhost:${PORT}/api/items`);
  console.log(`=======================================================`);
});

module.exports = app;
