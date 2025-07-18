const Task = require('../models/Task');
const User = require('../models/User');

module.exports = async function smartAssign(taskId) {
  const users = await User.find();
  const taskCounts = {};

  for (const user of users) {
    const count = await Task.countDocuments({
      assignedUser: user._id,
      status: { $ne: 'Done' }
    });
    taskCounts[user._id] = count;
  }

  const userIdWithLeastTasks = Object.keys(taskCounts).sort((a, b) => taskCounts[a] - taskCounts[b])[0];
  const task = await Task.findByIdAndUpdate(taskId, { assignedUser: userIdWithLeastTasks }, { new: true });
  return task;
};
