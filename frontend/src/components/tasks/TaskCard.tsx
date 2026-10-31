import React from 'react';
import { Task, TaskStatus } from '@/types/task';
import { TaskStatusBadge } from './TaskStatusBadge';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onDelete: (taskId: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onStatusChange, onDelete }) => {
  return (
    <div className="p-4 rounded-lg border border-slate-200 bg-white dark:bg-slate-900 dark:border-slate-800 shadow-sm hover:shadow transition-shadow flex flex-col gap-2">
      <div className="flex items-start justify-between gap-2">
        <h4
          onClick={() => onEdit(task)}
          className="text-sm font-semibold text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer line-clamp-2"
        >
          {task.title}
        </h4>
        <TaskStatusBadge priority={task.priority} />
      </div>

      {task.description && (
        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
          {task.description}
        </p>
      )}

      <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          {task.assignee ? (
            <span className="inline-block px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-slate-700 dark:text-slate-300">
              {task.assignee.name || task.assignee.email}
            </span>
          ) : (
            <span className="italic text-slate-400">Unassigned</span>
          )}
        </div>

        <div className="flex items-center gap-1">
          <select
            value={task.status}
            onChange={(e) => onStatusChange(task.id, e.target.value as TaskStatus)}
            className="text-xs bg-transparent border border-slate-200 dark:border-slate-700 rounded px-1.5 py-0.5"
          >
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="IN_REVIEW">In Review</option>
            <option value="DONE">Done</option>
          </select>
          <button
            onClick={() => onDelete(task.id)}
            className="text-red-500 hover:text-red-700 px-1 py-0.5 rounded transition-colors"
            title="Delete Task"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
};