import React from 'react';
import axios from '../api/axios';

const SmartAssignButton = ({ taskId, onSuccess }) => {
  const handleSmartAssign = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(`/tasks/${taskId}/smart-assign`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert(res.data.msg || 'Smart assigned!');
      onSuccess(); // Refresh tasks
    } catch (err) {
      console.error('Smart assign error:', err);
      alert(err.response?.data?.msg || 'Smart assign failed');
    }
  };

  return (
    <button onClick={handleSmartAssign} className="btn-smart">
      Smart Assign
    </button>
  );
};

export default SmartAssignButton;
