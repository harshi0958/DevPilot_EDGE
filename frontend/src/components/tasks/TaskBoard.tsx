import React, { useState, useEffect, useCallback } from 'react';
import { Task, TaskStatus, CreateTaskPayload } from '@/types/task';
import { getTasks, createTask, updateTask, deleteTask } from '@/lib/api/tasks';
import { TaskCard } from './TaskCard';
import { TaskDialog } from './TaskDialog';

interface TaskBoardProps {
  projectId: string;
}

const COLUMNS: { key: TaskStatus; label: string }[] = [
  { key: 'TODO', label: 'To Do' },
  { key: 'IN_PROGRESS', label: 'In Progress' },
  { key: 'IN_REVIEW', label: 'In Review' },
  { key: 'DONE', label: 'Done' },
];

export const TaskBoard: React.FC<TaskBoardProps> = ({ projectId }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [search, setSearch] = useState<string>('');

  const loadTasks = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getTasks(projectId, search ? { search } : undefined);
      setTasks(data);
    } catch (err) {
      console.error('Failed to load tasks:', err);
    } finally {
      setIsLoading(false);
    }
  }, [projectId, search]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    // Optimistic UI update
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
    try {
      await updateTask(projectId, taskId, { status: newStatus });
    } catch (err) {
      console.error('Failed to update status:', err);
      loadTasks();
    }
  };

  const handleDelete = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    try {
      await deleteTask(projectId, taskId);
    } catch (err) {
      console.error('Failed to delete task:', err);
      loadTasks();
    }
  };

  const handleSave = async (payload: CreateTaskPayload) => {
    if (selectedTask) {
      await updateTask(projectId, selectedTask.id, payload);
    } else {
      await createTask(projectId, payload);
    }
    loadTasks();
  };

  return (
    <div className="space-y-6">
      {/* Controls Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:w-72">
          <input
            type="text"
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-2 border rounded-md text-sm border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          onClick={() => {
            setSelectedTask(null);
            setDialogOpen(true);
          }}
          className="w-full sm:w-auto px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors shadow-sm"
        >
          + Add Task
        </button>
      </div>

      {/* Board Columns */}
      {isLoading ? (
        <div className="flex items-center justify-center h-48 text-slate-500">
          Loading tasks...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {COLUMNS.map((col) => {
            const columnTasks = tasks.filter((t) => t.status === col.key);
            return (
              <div
                key={col.key}
                className="bg-slate-50 dark:bg-slate-950/50 rounded-lg p-3 border border-slate-200 dark:border-slate-800 flex flex-col gap-3"
              >
                <div className="flex items-center justify-between font-medium text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider px-1">
                  <span>{col.label}</span>
                  <span className="bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-full px-2 py-0.5 text-xs">
                    {columnTasks.length}
                  </span>
                </div>
                <div className="flex flex-col gap-2 min-h-[150px]">
                  {columnTasks.length === 0 ? (
                    <div className="text-xs text-slate-400 dark:text-slate-600 text-center py-6 italic">
                      No tasks
                    </div>
                  ) : (
                    columnTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onEdit={(t) => {
                          setSelectedTask(t);
                          setDialogOpen(true);
                        }}
                        onStatusChange={handleStatusChange}
                        onDelete={handleDelete}
                      />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <TaskDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSave}
        initialData={selectedTask}
      />
    </div>
  );
};