// src/components/DropZone.jsx
import React from 'react';
import { useDrop } from 'react-dnd';
import TaskCard from './TaskCard';

const DropZone = ({ status, tasks, onDropTask }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'TASK',
    drop: (item) => onDropTask(item.id, status),
    collect: (monitor) => ({
      isOver: monitor.isOver()
    })
  }));

  const dropZoneStyle = {
    backgroundColor: isOver ? '#e0f7ff' : '#f9fafb',
    border: '2px dashed #ddd',
    borderRadius: '12px',
    padding: '1rem',
    boxShadow: isOver
      ? '0 4px 12px rgba(0,0,0,0.1)'
      : '0 2px 6px rgba(0,0,0,0.05)',
    transition: 'all 0.2s ease-in-out',
    minHeight: '400px',
    flex: 1,
    display: 'flex',
    flexDirection: 'column'
  };

  const columnTitleStyle = {
    textAlign: 'center',
    marginBottom: '1rem',
    fontWeight: 'bold',
    fontSize: '1.1rem',
    color: '#333'
  };

  return (
    <div ref={drop} style={dropZoneStyle}>
      <h2 style={columnTitleStyle}>{status}</h2>
      
<div
  ref={drop}
  className={`drop-zone`}
  style={{
    backgroundColor: isOver ? '#e0f7ff' : '#f9fafb',
    border: '2px dashed #ddd',
    borderRadius: '12px',
    padding: '1rem',
    boxShadow: isOver
      ? '0 4px 12px rgba(0,0,0,0.1)'
      : '0 2px 6px rgba(0,0,0,0.05)',
    minHeight: '400px',
    flex: 1,
    display: 'flex',
    flexDirection: 'column'
  }}
>

        {tasks.map(task => (
          <TaskCard key={task._id} task={task} />
        ))}
      </div>
    </div>
  );
};

export default DropZone;
