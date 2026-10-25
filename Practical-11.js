/**
 * ============================================================================
 * PRACTICAL 11: Create a Blog Management System implementing
 *               CRUD Operations, Authentication and Role-Based Access Control.
 * ============================================================================
 * Concepts Demonstrated:
 *  1. User Authentication (Token-based Auth & Header Bearer Verification)
 *  2. Role-Based Access Control (RBAC): Admin, Author, Reader Roles
 *  3. Authorization Middleware (protect, authorize('admin', 'author'))
 *  4. Full Blog CRUD Lifecycle:
 *     - Reader: Read all published articles
 *     - Author: Write and edit their own articles
 *     - Admin: Full privilege to moderate, edit, or delete ANY article
 *  5. Interactive Dashboard for Instant Testing with Switchable User Profiles
 * ============================================================================
 * How to Run:
 *   node Practical-11.js
 * Default Port: 5005 (Access at http://localhost:5005)
 * ============================================================================
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5005;

app.use(cors());
app.use(express.json());

// -------------------------------------------------------------
// 1. DATA STORES: USERS & BLOG ARTICLES
// -------------------------------------------------------------
const users = [
  { id: 1, name: 'Siddharth Admin', email: 'admin@blog.com', role: 'admin', token: 'token-admin-123' },
  { id: 2, name: 'Priya Author', email: 'author@blog.com', role: 'author', token: 'token-author-456' },
  { id: 3, name: 'Kunal Reader', email: 'reader@blog.com', role: 'reader', token: 'token-reader-789' }
];

let blogs = [
  {
    id: 1,
    title: 'Architecting Scalable Microservices with Node.js',
    content: 'Microservices architecture decomposes monolithic systems into modular, self-contained business domains...',
    authorId: 2,
    authorName: 'Priya Author',
    published: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    title: 'Mastering MongoDB Indexes & Aggregation Framework',
    content: 'Compound indexes, partial filter expressions, and pipeline stages provide maximum query efficiency...',
    authorId: 2,
    authorName: 'Priya Author',
    published: true,
    createdAt: new Date().toISOString()
  }
];

let nextBlogId = 3;

// -------------------------------------------------------------
// 2. AUTHENTICATION & ROLE-BASED ACCESS CONTROL (RBAC) MIDDLEWARE
// -------------------------------------------------------------
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access Denied: No Authentication Token Provided.' });
  }

  const user = users.find((u) => u.token === token);
  if (!user) {
    return res.status(403).json({ success: false, message: 'Invalid or Expired Token.' });
  }

  req.user = user;
  next();
};

const authorizeRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Your role [${req.user ? req.user.role : 'none'}] is not permitted to perform this action. Required: [${allowedRoles.join(', ')}]`
      });
    }
    next();
  };
};

// -------------------------------------------------------------
// 3. AUTHENTICATION ROUTES
// -------------------------------------------------------------
app.post('/api/auth/login', (req, res) => {
  const { email } = req.body;
  const user = users.find((u) => u.email.toLowerCase() === (email || '').toLowerCase());

  if (!user) {
    return res.status(404).json({ success: false, message: 'User not found. Use admin@blog.com, author@blog.com, or reader@blog.com.' });
  }

  return res.status(200).json({
    success: true,
    message: `Logged in successfully as ${user.role.toUpperCase()}`,
    user: { id: user.id, name: user.name, email: user.email, role: user.role, token: user.token }
  });
});

// -------------------------------------------------------------
// 4. BLOG CRUD ENDPOINTS WITH RBAC ENFORCEMENT
// -------------------------------------------------------------

// READ: Public / Readers can access all published blogs
app.get('/api/blogs', (req, res) => {
  return res.status(200).json({
    success: true,
    total: blogs.length,
    data: blogs
  });
});

// CREATE: Only Author or Admin can create blog posts
app.post('/api/blogs', authenticateToken, authorizeRole('author', 'admin'), (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ success: false, message: 'Title and content are required.' });
  }

  const newPost = {
    id: nextBlogId++,
    title: title.trim(),
    content: content.trim(),
    authorId: req.user.id,
    authorName: req.user.name,
    published: true,
    createdAt: new Date().toISOString()
  };

  blogs.unshift(newPost);

  return res.status(201).json({
    success: true,
    message: 'Blog post created successfully.',
    data: newPost
  });
});

// UPDATE: Author can update OWN post; Admin can update ANY post
app.put('/api/blogs/:id', authenticateToken, authorizeRole('author', 'admin'), (req, res) => {
  const blogId = parseInt(req.params.id, 10);
  const post = blogs.find((b) => b.id === blogId);

  if (!post) {
    return res.status(404).json({ success: false, message: 'Blog post not found.' });
  }

  // Ownership Check: Author can only edit their own post
  if (req.user.role === 'author' && post.authorId !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Forbidden: Authors are only authorized to edit their own posts.'
    });
  }

  if (req.body.title) post.title = req.body.title.trim();
  if (req.body.content) post.content = req.body.content.trim();

  return res.status(200).json({
    success: true,
    message: `Blog post #${blogId} updated successfully.`,
    data: post
  });
});

// DELETE: Author can delete OWN post; Admin can delete ANY post
app.delete('/api/blogs/:id', authenticateToken, authorizeRole('author', 'admin'), (req, res) => {
  const blogId = parseInt(req.params.id, 10);
  const index = blogs.findIndex((b) => b.id === blogId);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Blog post not found.' });
  }

  const post = blogs[index];

  // Ownership Check
  if (req.user.role === 'author' && post.authorId !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: 'Forbidden: Authors cannot delete articles written by other creators.'
    });
  }

  const deleted = blogs.splice(index, 1)[0];

  return res.status(200).json({
    success: true,
    message: `Blog post "${deleted.title}" deleted by ${req.user.role}.`,
    data: deleted
  });
});

// -------------------------------------------------------------
// 5. INTERACTIVE TESTING UI
// -------------------------------------------------------------
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Practical 11 - RBAC Blog Management System</title>
        <style>
          body { font-family: system-ui, sans-serif; background: #090e1a; color: #f8fafc; padding: 32px; }
          .container { max-width: 900px; margin: 0 auto; background: #1a2234; padding: 28px; border-radius: 12px; border: 1px solid #2d3748; }
          h1 { color: #f59e0b; margin-top: 0; }
          .roles-box { display: flex; gap: 12px; margin-bottom: 24px; }
          .btn-role { padding: 8px 16px; border-radius: 6px; border: none; cursor: pointer; font-weight: bold; }
          .admin { background: #ef4444; color: white; }
          .author { background: #3b82f6; color: white; }
          .reader { background: #10b981; color: white; }
          .blog-card { background: #0f172a; padding: 16px; border-radius: 8px; margin-bottom: 12px; border: 1px solid #334155; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Practical 11: Blog System with Role-Based Access Control (RBAC)</h1>
          <p>Demonstrates Authentication and Permission Enforcements between <strong>Admin</strong>, <strong>Author</strong>, and <strong>Reader</strong>.</p>
          
          <h3>Available Roles for Testing:</h3>
          <div class="roles-box">
            <div class="btn-role admin">👑 Admin: Full Access</div>
            <div class="btn-role author">✍️ Author: Write / Edit Own</div>
            <div class="btn-role reader">📖 Reader: View Only</div>
          </div>

          <hr style="border: 1px solid #334155; margin: 20px 0;" />
          <h3>Active Blog Posts (${blogs.length})</h3>
          ${blogs
            .map(
              (b) => `
            <div class="blog-card">
              <div style="display:flex; justify-content:space-between; color:#94a3b8; font-size:0.85rem;">
                <span>Author: <strong>${b.authorName}</strong></span>
                <span>ID: #${b.id}</span>
              </div>
              <h3 style="margin: 8px 0; color:#38bdf8;">${b.title}</h3>
              <p style="margin: 0; font-size: 0.9rem; color:#cbd5e1;">${b.content}</p>
            </div>
          `
            )
            .join('')}
        </div>
      </body>
    </html>
  `);
});

// Start Server
app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🛡️ Practical 11 RBAC Blog System Server Running!`);
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`📡 Blog API: http://localhost:${PORT}/api/blogs`);
  console.log(`=======================================================`);
});

module.exports = app;
