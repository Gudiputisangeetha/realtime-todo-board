// src/components/TaskForm.jsx

import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import './TaskForm.css';

const TaskForm = ({ existingTask = null, onSuccess }) => {
  const [title, setTitle] = useState(existingTask?.title || '');
  const [description, setDescription] = useState(existingTask?.description || '');
  const [status, setStatus] = useState(existingTask?.status || 'Todo');
  const [priority, setPriority] = useState(existingTask?.priority || 'Low');
  const [assignedTo, setAssignedTo] = useState(existingTask?.assignedTo?._id || '');
  const [updatedAt, setUpdatedAt] = useState(existingTask?.updatedAt || '');
  const [users, setUsers] = useState([]);
  const [conflict, setConflict] = useState(null);

  const isEditing = !!existingTask;
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('/users', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(res.data);
      } catch (err) {
        console.error('Error fetching users', err);
      }
    };
    fetchUsers();
  }, [token]);

  const handleSubmit = async (e, force = false) => {
    e.preventDefault();
    const taskData = { title, description, status, priority, assignedTo };

    if (isEditing) taskData.updatedAt = updatedAt;

    try {
      if (isEditing) {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        if (force) delete taskData.updatedAt; // override without checking
        const res = await axios.put(`/tasks/${existingTask._id}`, taskData, config);
        onSuccess();
      } else {
        await axios.post('/tasks', taskData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        onSuccess();
      }
    } catch (err) {
      if (err.response?.status === 409) {
        setConflict({
          server: err.response.data.serverVersion,
          client: err.response.data.clientVersion
        });
      } else {
        alert(err.response?.data?.msg || 'Error submitting task');
      }
    }
  };

  const handleOverride = async () => {
    await handleSubmit({ preventDefault: () => {} }, true); // bypass updatedAt
    setConflict(null);
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <h2>{isEditing ? 'Edit Task' : 'Create Task'}</h2>

      <label>Title</label>
      <input value={title} onChange={(e) => setTitle(e.target.value)} required />

      <label>Description</label>
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} />

      <label>Status</label>
      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option>Todo</option>
        <option>In Progress</option>
        <option>Done</option>
      </select>

      <label>Priority</label>
      <select value={priority} onChange={(e) => setPriority(e.target.value)}>
        <option>Low</option>
        <option>Medium</option>
        <option>High</option>
      </select>

      <label>Assign To</label>
      <select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)}>
        <option value="">-- Select User --</option>
        {users.map((user) => (
          <option key={user._id} value={user._id}>{user.name}</option>
        ))}
      </select>

      <button type="submit">{isEditing ? 'Update Task' : 'Create Task'}</button>

      {conflict && (
        <div className="conflict-warning">
          <p><strong>Conflict Detected!</strong> This task was modified by someone else.</p>
          <p><strong>Your Version:</strong> {conflict.client.title}</p>
          <p><strong>Server Version:</strong> {conflict.server.title}</p>
          <button type="button" onClick={handleOverride}>Override Server Version</button>
          <button type="button" onClick={() => setConflict(null)}>Cancel</button>
        </div>
      )}
    </form>
  );
};

export default TaskForm;
