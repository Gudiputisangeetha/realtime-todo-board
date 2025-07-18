// components/ActivityLog.jsx

import React, { useEffect, useState } from 'react';
import axios from '../api/axios';

const ActivityLog = () => {
  const [logs, setLogs] = useState([]);

  const fetchLogs = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('/logs', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLogs(res.data);
    } catch (err) {
      console.error('Error fetching logs:', err);
    }
  };

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 15000); // Poll every 15 sec
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        padding: '1.2rem',
        borderRadius: '8px',
        boxShadow: '0 1px 6px rgba(0,0,0,0.1)',
        maxHeight: '320px',
        overflowY: 'auto'
      }}
    >
      <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
        Recent Activity
      </h2>
      <ul style={{ listStyleType: 'disc', paddingLeft: '1.5rem' }}>
        {logs.length === 0 ? (
          <li style={{ color: '#666' }}>No activity yet.</li>
        ) : (
          logs.map((log) => (
            <li key={log._id} style={{ marginBottom: '0.5rem', color: '#333' }}>
              <span style={{ fontWeight: '600', color: '#1d4ed8' }}>
                {log.userId?.username || 'Someone'}
              </span>{' '}
              performed <em>{log.action}</em> on task{' '}
              <strong>{log.taskId?.title || 'Deleted Task'}</strong>{' '}
              at {new Date(log.timestamp).toLocaleTimeString()}
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default ActivityLog;
