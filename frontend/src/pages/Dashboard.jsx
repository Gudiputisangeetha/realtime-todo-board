// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import DropZone from '../components/DropZone';
import ActivityLog from '../components/ActivityLog';
import { useNavigate } from 'react-router-dom';
import socket from '../socket';

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();
  const columns = ['Todo', 'In Progress', 'Done'];

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/tasks', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(res.data);
    } catch (err) {
      if (err.response?.status === 401) navigate('/login');
      else console.error('Fetch tasks error:', err);
    }
  };

  // Handle task move between columns
  const handleDropTask = async (taskId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const task = tasks.find((t) => t._id === taskId);

      await axios.put(
        `/tasks/${taskId}`,
        {
          status: newStatus,
          updatedAt: task.updatedAt, // for conflict detection
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
    } catch (err) {
      if (err.response?.status === 409) {
        const { serverVersion, clientVersion } = err.response.data;
        const confirm = window.confirm(
          '⚠️ Conflict detected! This task was updated elsewhere.\n\nClick OK to overwrite with your version.\nClick Cancel to use the server version.'
        );

        const token = localStorage.getItem('token');

        if (confirm) {
          await axios.put(
            `/tasks/${taskId}`,
            {
              ...clientVersion,
              status: newStatus
            },
            {
              headers: { Authorization: `Bearer ${token}` }
            }
          );
        }
        // else do nothing, socket will update view
      } else {
        console.error('Error updating task status:', err);
      }
    }
  };

  useEffect(() => {
    fetchTasks();

    // Real-time updates from socket
    socket.on('tasks_updated', fetchTasks);

    return () => {
      socket.off('tasks_updated', fetchTasks);
    };
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>📋 Task Board</h1>

      <div style={styles.boardWrapper}>
        {columns.map((col) => (
          <DropZone
            key={col}
            status={col}
            tasks={tasks.filter((t) => t.status === col)}
            onDropTask={handleDropTask}
          />
        ))}
      </div>

      <div style={styles.logWrapper}>
        <ActivityLog />
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '1.5rem',
    backgroundColor: '#f0f4f8',
    minHeight: '100vh',
    boxSizing: 'border-box'
  },
  header: {
    fontSize: '1.75rem',
    fontWeight: 'bold',
    marginBottom: '1rem',
    textAlign: 'center',
    color: '#1e293b'
  },
  boardWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginBottom: '2rem',
  },
  logWrapper: {
    marginTop: '2rem'
  }
};

export default Dashboard;
