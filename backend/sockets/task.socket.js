const Task = require('../models/Task');

module.exports = (io, socket) => {
  socket.on('update_task', async () => {
    const tasks = await Task.find().populate('assignedUser', 'username');
    io.emit('tasks_updated', tasks);
  });
};
