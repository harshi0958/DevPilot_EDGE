'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { useTasks } from '@/hooks/useTasks';
import { TaskItem, CreateTaskPayload, UpdateTaskPayload } from '@/types/task';
import { TaskFilters } from '@/components/tasks/TaskFilters';
import { TaskTable } from '@/components/tasks/TaskTable';
import { TaskFormDialog } from '@/components/tasks/TaskFormDialog';
import { DeleteTaskDialog } from '@/components/tasks/DeleteTaskDialog';

export default function ProjectTasksPage() {
  const params = useParams();
  const projectId = (params?.id as string) || '';

  const {
    tasks,
    meta,
    filters,
    loading,
    error,
    setFilters,
    createTask,
    updateTask,
    deleteTask,
  } = useTasks(projectId);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeTask, setActiveTask] = useState<TaskItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<TaskItem | null>(null);

  const handleOpenCreate = () => {
    setActiveTask(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (task: TaskItem) => {
    setActiveTask(task);
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (data: CreateTaskPayload | UpdateTaskPayload) => {
    if (activeTask) {
      await updateTask(activeTask.id, data as UpdateTaskPayload);
    } else {
      await createTask(data as CreateTaskPayload);
    }
  };

  const handleConfirmDelete = async () => {
    if (deleteTarget) {
      await deleteTask(deleteTarget.id);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Task Management</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Create, track, and manage development deliverables for this project.
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-700 transition-colors"
        >
          + Create Task
        </button>
      </div>

      <TaskFilters
        filters={filters}
        onChange={(updated) => setFilters((prev) => ({ ...prev, ...updated }))}
      />

      {error && (
        <div className="p-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-md">
          {error}
        </div>
      )}

      {loading ? (
        <div className="py-12 text-center text-neutral-500 text-sm">
          Loading tasks...
        </div>
      ) : (
        <TaskTable
          tasks={tasks}
          onEdit={handleOpenEdit}
          onDelete={(task) => setDeleteTarget(task)}
        />
      )}

      {meta.totalPages > 1 && (
        <div className="flex items-center justify-between pt-4">
          <p className="text-sm text-neutral-500">
            Showing page {meta.page} of {meta.totalPages} ({meta.total} total)
          </p>
          <div className="flex gap-2">
            <button
              disabled={meta.page <= 1}
              onClick={() => setFilters((prev) => ({ ...prev, page: prev.page - 1 }))}
              className="px-3 py-1.5 border rounded text-sm disabled:opacity-50 hover:bg-neutral-50"
            >
              Previous
            </button>
            <button
              disabled={meta.page >= meta.totalPages}
              onClick={() => setFilters((prev) => ({ ...prev, page: prev.page + 1 }))}
              className="px-3 py-1.5 border rounded text-sm disabled:opacity-50 hover:bg-neutral-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      <TaskFormDialog
        isOpen={isFormOpen}
        task={activeTask}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
      />

      <DeleteTaskDialog
        isOpen={Boolean(deleteTarget)}
        taskId={deleteTarget?.id || null}
        taskTitle={deleteTarget?.title}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}