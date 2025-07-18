// app.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const authRoutes = require('./routes/auth.routes');
const taskRoutes = require('./routes/task.routes');
const logRoutes = require('./routes/log.routes'); // ✅ New

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/logs', logRoutes); // ✅ Mount log route

module.exports = app;
