// src/components/TaskCard.jsx
import React from 'react';
import axios from '../api/axios';
import { useDrag } from 'react-dnd';

const TaskCard = ({ task }) => {
  const [{ isDragging }, dragRef] = useDrag(() => ({
    type: 'TASK',
    item: { id: task._id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  }));

  const handleSmartAssign = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/tasks/${task._id}/smart-assign`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // No need to fetch tasks — socket will update automatically
    } catch (err) {
      console.error('Smart assign failed:', err);
      alert('Smart assign failed');
    }
  };

  return (
    <div
      ref={dragRef}
      className={`task-card ${isDragging ? 'dragging' : ''}`}
    >
      <h4 className="task-title">{task.title}</h4>
      <p className="task-desc">{task.description}</p>
      <p className="task-meta">Priority: {task.priority}</p>

      <button className="assign-btn" onClick={handleSmartAssign}>
        🎯 Smart Assign
      </button>
    </div>
  );
};

export default TaskCard;
