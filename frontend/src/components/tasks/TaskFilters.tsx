'use client';

import React from 'react';
import { TaskFiltersState, TaskPriority, TaskStatus } from '@/types/task';

interface TaskFiltersProps {
  filters: TaskFiltersState;
  onChange: (updated: Partial<TaskFiltersState>) => void;
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({ filters, onChange }) => {
  return (
    <div className="flex flex-wrap gap-4 items-center justify-between py-4">
      <div className="flex flex-1 items-center gap-2 max-w-sm">
        <input
          type="text"
          placeholder="Search tasks..."
          value={filters.search || ''}
          onChange={(e) => onChange({ search: e.target.value || undefined, page: 1 })}
          className="w-full px-3 py-2 border rounded-md text-sm border-neutral-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={filters.status || ''}
          onChange={(e) => onChange({ status: (e.target.value as TaskStatus) || undefined, page: 1 })}
          className="px-3 py-2 border rounded-md text-sm bg-white border-neutral-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Statuses</option>
          <option value="TODO">To Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
        </select>

        <select
          value={filters.priority || ''}
          onChange={(e) => onChange({ priority: (e.target.value as TaskPriority) || undefined, page: 1 })}
          className="px-3 py-2 border rounded-md text-sm bg-white border-neutral-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Priorities</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </select>
      </div>
    </div>
  );
};