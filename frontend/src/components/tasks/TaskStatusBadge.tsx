import React from 'react';
import { TaskStatus, TaskPriority } from '@/types/task';

interface BadgeProps {
  status?: TaskStatus;
  priority?: TaskPriority;
}

export const TaskStatusBadge: React.FC<BadgeProps> = ({ status, priority }) => {
  if (status) {
    const statusStyles: Record<TaskStatus, string> = {
      TODO: 'bg-slate-100 text-slate-700 border-slate-300 dark:bg-slate-800 dark:text-slate-300',
      IN_PROGRESS: 'bg-blue-100 text-blue-700 border-blue-300 dark:bg-blue-950 dark:text-blue-300',
      IN_REVIEW: 'bg-purple-100 text-purple-700 border-purple-300 dark:bg-purple-950 dark:text-purple-300',
      DONE: 'bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-950 dark:text-emerald-300',
    };
    const label = status.replace('_', ' ');
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${statusStyles[status]}`}>
        {label}
      </span>
    );
  }

  if (priority) {
    const priorityStyles: Record<TaskPriority, string> = {
      LOW: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
      MEDIUM: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400',
      HIGH: 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-400',
      URGENT: 'bg-red-100 text-red-700 font-semibold dark:bg-red-950 dark:text-red-400',
    };
    return (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${priorityStyles[priority]}`}>
        {priority}
      </span>
    );
  }

  return null;
};