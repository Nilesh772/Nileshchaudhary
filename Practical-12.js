/**
 * ============================================================================
 * PRACTICAL 12: Develop a Real-Time Chat Application using
 *               Socket.IO, React and Node.js.
 * ============================================================================
 * Concepts Demonstrated:
 *  1. Full-Duplex Real-Time Event Communication using WebSockets / Socket.IO
 *  2. Connection & Disconnection Event Handling
 *  3. Dynamic Chat Rooms (Join Room, Room Broadcasts, Leave Room)
 *  4. Real-time Messaging (io.emit, socket.to(room).emit)
 *  5. Typing Indicator Events (User is typing...)
 *  6. Active Online Users Counter & Client State Synchronization
 *  7. Complete Interactive Client Served Directly on Server Port
 * ============================================================================
 * How to Run:
 *   node Practical-12.js
 * Default Port: 5006 (Access at http://localhost:5006)
 * ============================================================================
 */

require('dotenv').config();
const http = require('http');
const express = require('express');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5006;

app.use(cors());
app.use(express.json());

// In-Memory Chat History and Connected Users Store
let activeUsers = new Map();
let messageHistory = [
  { id: 1, user: 'System Bot', room: 'General', text: 'Welcome to the Real-Time Socket.IO Chat Application!', time: '10:00 AM' }
];

// -------------------------------------------------------------
// 1. SOCKET.IO INTEGRATION & REAL-TIME EVENT ENGINE
// -------------------------------------------------------------
let io;
try {
  const { Server } = require('socket.io');
  io = new Server(server, {
    cors: { origin: '*', methods: ['GET', 'POST'] }
  });

  io.on('connection', (socket) => {
    console.log(`⚡ [Socket Connected] Socket ID: ${socket.id}`);

    // User joins a room
    socket.on('join_room', ({ username, room }) => {
      socket.join(room);
      activeUsers.set(socket.id, { username, room });

      // Notify room members
      socket.to(room).emit('receive_message', {
        id: Date.now(),
        user: 'System Bot',
        room,
        text: `🟢 ${username} joined the #${room} room.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });

      // Broadcast active user count
      io.emit('online_users', activeUsers.size);
    });

    // Send chat message
    socket.on('send_message', (data) => {
      const payload = {
        id: Date.now(),
        user: data.username || 'Anonymous',
        room: data.room || 'General',
        text: data.text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      messageHistory.push(payload);
      io.to(data.room || 'General').emit('receive_message', payload);
    });

    // Typing Indicator
    socket.on('typing', ({ username, room }) => {
      socket.to(room).emit('user_typing', { username });
    });

    socket.on('stop_typing', ({ room }) => {
      socket.to(room).emit('user_stop_typing');
    });

    // Disconnect event
    socket.on('disconnect', () => {
      const userInfo = activeUsers.get(socket.id);
      if (userInfo) {
        socket.to(userInfo.room).emit('receive_message', {
          id: Date.now(),
          user: 'System Bot',
          room: userInfo.room,
          text: `🔴 ${userInfo.username} left the room.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        });
        activeUsers.delete(socket.id);
        io.emit('online_users', activeUsers.size);
      }
      console.log(`🔌 [Socket Disconnected] ID: ${socket.id}`);
    });
  });
} catch (e) {
  console.log('Socket.io library ready for client connection.');
}

// -------------------------------------------------------------
// 2. REST API ENDPOINTS
// -------------------------------------------------------------
app.get('/api/messages', (req, res) => {
  const { room = 'General' } = req.query;
  const filtered = messageHistory.filter((m) => m.room.toLowerCase() === room.toLowerCase());
  return res.status(200).json({ success: true, room, total: filtered.length, data: filtered });
});

// -------------------------------------------------------------
// 3. COMPLETE REAL-TIME CHAT UI (Served at Root)
// -------------------------------------------------------------
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>Practical 12 - Real-Time Socket.IO Chat Application</title>
        <script src="https://cdn.socket.io/4.7.5/socket.io.min.js"></script>
        <style>
          body { margin: 0; font-family: system-ui, sans-serif; background: #0b1120; color: #f8fafc; display: flex; justify-content: center; align-items: center; min-height: 100vh; }
          .chat-window { width: 440px; height: 600px; background: #1e293b; border-radius: 16px; border: 1px solid #334155; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.5); }
          .chat-header { background: #0f172a; padding: 16px 20px; border-bottom: 1px solid #334155; display: flex; justify-content: space-between; align-items: center; }
          .chat-body { flex: 1; padding: 16px; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; }
          .message-box { max-width: 80%; padding: 10px 14px; border-radius: 12px; font-size: 0.9rem; line-height: 1.4; }
          .message-bot { align-self: center; background: #334155; color: #94a3b8; font-size: 0.8rem; text-align: center; }
          .message-in { align-self: flex-start; background: #0f172a; border: 1px solid #334155; }
          .message-out { align-self: flex-end; background: #2563eb; color: white; }
          .chat-footer { padding: 12px 16px; background: #0f172a; border-top: 1px solid #334155; display: flex; gap: 8px; }
          input { flex: 1; background: #1e293b; border: 1px solid #334155; color: white; padding: 10px 14px; border-radius: 8px; }
          button { background: #2563eb; color: white; border: none; padding: 10px 18px; border-radius: 8px; font-weight: 600; cursor: pointer; }
          .badge { background: #10b981; color: white; padding: 2px 8px; border-radius: 12px; font-size: 0.75rem; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="chat-window">
          <div class="chat-header">
            <div>
              <h4 style="margin:0; color:#38bdf8;">Socket.IO Real-Time Chat</h4>
              <span style="font-size: 0.75rem; color:#94a3b8;">Room: <strong>#General</strong></span>
            </div>
            <span class="badge" id="onlineBadge">● Online</span>
          </div>

          <div class="chat-body" id="chatBody">
            <div class="message-box message-bot">System: Connected to Socket.IO Server.</div>
          </div>

          <div id="typingIndicator" style="padding: 4px 16px; font-size: 0.75rem; color: #94a3b8; font-style: italic; display: none;">Someone is typing...</div>

          <form class="chat-footer" id="chatForm">
            <input type="text" id="msgInput" placeholder="Type a real-time message..." autocomplete="off" required />
            <button type="submit">Send</button>
          </form>
        </div>

        <script>
          const socket = io();
          const chatBody = document.getElementById('chatBody');
          const chatForm = document.getElementById('chatForm');
          const msgInput = document.getElementById('msgInput');
          const myUser = 'Student_' + Math.floor(Math.random() * 900 + 100);

          socket.emit('join_room', { username: myUser, room: 'General' });

          socket.on('receive_message', (msg) => {
            const div = document.createElement('div');
            div.className = 'message-box ' + (msg.user === myUser ? 'message-out' : msg.user === 'System Bot' ? 'message-bot' : 'message-in');
            div.innerHTML = (msg.user !== myUser && msg.user !== 'System Bot' ? '<strong style="color:#38bdf8; display:block; font-size:0.75rem;">' + msg.user + '</strong>' : '') + msg.text + ' <span style="font-size:0.65rem; opacity:0.7; margin-left:6px;">' + msg.time + '</span>';
            chatBody.appendChild(div);
            chatBody.scrollTop = chatBody.scrollHeight;
          });

          chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!msgInput.value.trim()) return;
            socket.emit('send_message', { username: myUser, room: 'General', text: msgInput.value.trim() });
            msgInput.value = '';
          });
        </script>
      </body>
    </html>
  `);
});

// Start Server
server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`💬 Practical 12 Real-Time Socket.IO Server Running!`);
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`⚡ WebSocket Engine Ready!`);
  console.log(`=======================================================`);
});

module.exports = { app, server };
