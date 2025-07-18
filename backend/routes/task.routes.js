const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Correct usage: function passed directly
router.post('/', authMiddleware, taskController.createTask);

router.get('/', authMiddleware, taskController.getTasks);
router.put('/:id', authMiddleware, taskController.updateTask);
router.delete('/:id', authMiddleware, taskController.deleteTask);
router.post('/:id/smart-assign', authMiddleware, taskController.smartAssign);

module.exports = router;
