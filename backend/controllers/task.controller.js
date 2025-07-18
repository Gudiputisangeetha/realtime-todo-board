const Task = require('../models/Task');
const Log = require('../models/Log');
const User = require('../models/User');

// Create Task
exports.createTask = async (req, res) => {
  try {
    const { title, description, status, priority, assignedTo } = req.body;
    const forbiddenTitles = ['Todo', 'In Progress', 'Done'];

    if (forbiddenTitles.includes(title.trim())) {
      return res.status(400).json({ msg: 'Task title cannot match column names' });
    }

    const existingTask = await Task.findOne({ title });
    if (existingTask) {
      return res.status(400).json({ msg: 'Task title already exists' });
    }

    const newTask = new Task({
      title,
      description,
      status,
      priority,
      assignedTo,
      createdBy: req.user.id
    });

    await newTask.save();

    await Log.create({
      action: 'create',
      taskId: newTask._id,
      userId: req.user.id
    });

    // 🔥 Emit real-time task & log updates
    req.io.emit('task_created', newTask);
    req.io.emit('log_updated');

    res.status(201).json(newTask);
  } catch (err) {
    console.error('Error creating task:', err);
    res.status(500).json({ msg: 'Server Error' });
  }
};

// Get All Tasks
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    console.error('Error fetching tasks:', err);
    res.status(500).json({ msg: 'Server Error' });
  }
};

// Update Task with conflict handling
exports.updateTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const clientLastUpdated = req.body.updatedAt;

    const existingTask = await Task.findById(taskId);
    if (!existingTask) {
      return res.status(404).json({ msg: 'Task not found' });
    }

    // Conflict check
    if (
      clientLastUpdated &&
      new Date(clientLastUpdated).getTime() !== new Date(existingTask.updatedAt).getTime()
    ) {
      return res.status(409).json({
        msg: 'Conflict detected',
        serverVersion: existingTask,
        clientVersion: req.body
      });
    }

    const updates = req.body;
    const updatedTask = await Task.findByIdAndUpdate(taskId, updates, {
      new: true,
      runValidators: true
    });

    await Log.create({
      action: 'update',
      taskId: updatedTask._id,
      userId: req.user.id
    });

    // 🔥 Emit real-time task & log updates
    req.io.emit('task_updated', updatedTask);
    req.io.emit('log_updated');

    res.json(updatedTask);
  } catch (err) {
    console.error('Error updating task:', err);
    res.status(500).json({ msg: 'Server Error' });
  }
};

// Delete Task
exports.deleteTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const deleted = await Task.findByIdAndDelete(taskId);

    if (!deleted) {
      return res.status(404).json({ msg: 'Task not found' });
    }

    await Log.create({
      action: 'delete',
      taskId: taskId,
      userId: req.user.id
    });

    // 🔥 Emit real-time task & log updates
    req.io.emit('task_deleted', taskId);
    req.io.emit('log_updated');

    res.json({ msg: 'Task deleted' });
  } catch (err) {
    console.error('Error deleting task:', err);
    res.status(500).json({ msg: 'Error deleting task' });
  }
};

// Smart Assign Logic
exports.smartAssign = async (req, res) => {
  try {
    const taskId = req.params.id;

    const usersWithTaskCount = await Task.aggregate([
      { $match: { status: { $ne: 'Done' } } },
      { $group: { _id: '$assignedTo', count: { $sum: 1 } } }
    ]);

    const userTaskMap = {};
    usersWithTaskCount.forEach(u => userTaskMap[u._id?.toString()] = u.count);

    const users = await User.find();
    let leastBusyUser = null;
    let minTasks = Infinity;

    for (const user of users) {
      const taskCount = userTaskMap[user._id?.toString()] || 0;
      if (taskCount < minTasks) {
        minTasks = taskCount;
        leastBusyUser = user;
      }
    }

    if (!leastBusyUser) {
      return res.status(400).json({ msg: 'No users found' });
    }

    const task = await Task.findByIdAndUpdate(
      taskId,
      { assignedTo: leastBusyUser._id },
      { new: true }
    );

    await Log.create({
      action: 'smart-assign',
      taskId: task._id,
      userId: req.user.id
    });

    // 🔥 Emit real-time task & log updates
    req.io.emit('task_updated', task);
    req.io.emit('log_updated');

    res.json({ msg: 'Smart Assigned', task });
  } catch (err) {
    console.error('Smart Assign Error:', err);
    res.status(500).json({ msg: 'Smart Assign failed' });
  }
};
