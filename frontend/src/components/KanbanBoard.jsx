// src/components/KanbanBoard.jsx
import React from 'react';
import TaskCard from './TaskCard';

const KanbanBoard = ({ tasks, onDragEnd }) => {
  const columns = ['Todo', 'In Progress', 'Done'];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {columns.map((col) => (
        <div
          key={col}
          className="bg-white rounded-lg shadow p-3"
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => onDragEnd(e, col)}
        >
          <h2 className="text-xl font-semibold mb-3">{col}</h2>
          {tasks
            .filter((task) => task.status === col)
            .map((task) => (
              <TaskCard key={task._id} task={task} />
            ))}
        </div>
      ))}
    </div>
  );
};

export default KanbanBoard;
