const http = require('http');
const mongoose = require('mongoose');
const app = require('./app');
const { Server } = require('socket.io');
require('dotenv').config();

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE'] }
});

// ✅ Attach io to each request
app.use((req, res, next) => {
  req.io = io;
  next();
});

// ✅ Mongo + Server startup
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    server.listen(process.env.PORT, () =>
      console.log(`🚀 Server on port ${process.env.PORT}`)
    );
  })
  .catch(err => console.error('❌ Mongo Error', err));

// ✅ Socket connection setup
io.on('connection', (socket) => {
  console.log('🟢 New client:', socket.id);
  require('./sockets/task.socket')(io, socket);
});
