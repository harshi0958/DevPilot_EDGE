'use client';

import React from 'react';
import { TaskItem } from '@/types/task';

interface TaskTableProps {
  tasks: TaskItem[];
  onEdit: (task: TaskItem) => void;
  onDelete: (task: TaskItem) => void;
}

const statusBadgeStyles: Record<string, string> = {
  TODO: 'bg-neutral-100 text-neutral-700',
  IN_PROGRESS: 'bg-blue-100 text-blue-700',
  COMPLETED: 'bg-green-100 text-green-700',
};

const priorityBadgeStyles: Record<string, string> = {
  LOW: 'text-neutral-600 bg-neutral-100',
  MEDIUM: 'text-yellow-700 bg-yellow-100',
  HIGH: 'text-red-700 bg-red-100',
};

export const TaskTable: React.FC<TaskTableProps> = ({ tasks, onEdit, onDelete }) => {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg bg-neutral-50 border-neutral-200">
        <p className="text-neutral-500 text-sm">No tasks found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto border border-neutral-200 rounded-lg">
      <table className="min-w-full divide-y divide-neutral-200 bg-white text-sm">
        <thead className="bg-neutral-50 font-medium text-neutral-500">
          <tr>
            <th className="px-4 py-3 text-left">Title</th>
            <th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3 text-left">Priority</th>
            <th className="px-4 py-3 text-left">Due Date</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-200">
          {tasks.map((task) => (
            <tr key={task.id} className="hover:bg-neutral-50/75 transition-colors">
              <td className="px-4 py-3">
                <div className="font-medium text-neutral-900">{task.title}</div>
                {task.description && (
                  <div className="text-neutral-500 text-xs truncate max-w-xs">
                    {task.description}
                  </div>
                )}
              </td>
              <td className="px-4 py-3">
                <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${statusBadgeStyles[task.status] || ''}`}>
                  {task.status.replace('_', ' ')}
                </span>
              </td>
              <td className="px-4 py-3">
                <span className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${priorityBadgeStyles[task.priority] || ''}`}>
                  {task.priority}
                </span>
              </td>
              <td className="px-4 py-3 text-neutral-500 whitespace-nowrap">
                {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '-'}
              </td>
              <td className="px-4 py-3 text-right space-x-2 whitespace-nowrap">
                <button
                  onClick={() => onEdit(task)}
                  className="text-blue-600 hover:text-blue-800 font-medium text-xs"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(task)}
                  className="text-red-600 hover:text-red-800 font-medium text-xs"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};