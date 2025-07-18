const Log = require('../models/Log');

exports.getRecentLogs = async (req, res) => {
  const logs = await Log.find().sort({ timestamp: -1 }).limit(20).populate('userId', 'username');
  res.json(logs);
};
