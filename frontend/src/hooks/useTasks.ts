'use client';

import { useState, useEffect, useCallback } from 'react';
import { TaskItem, TaskFiltersState, TaskPaginationMeta, CreateTaskPayload, UpdateTaskPayload } from '@/types/task';
import { taskService } from '@/services/task.service';

export function useTasks(projectId: string) {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [meta, setMeta] = useState<TaskPaginationMeta>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });
  const [filters, setFilters] = useState<TaskFiltersState>({
    page: 1,
    limit: 10,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    if (!projectId) return;
    try {
      setLoading(true);
      setError(null);
      const response = await taskService.getTasks(projectId, filters);
      setTasks(response.data);
      setMeta(response.meta);
    } catch (err: any) {
      setError(err.message || 'An error occurred while loading tasks.');
    } finally {
      setLoading(false);
    }
  }, [projectId, filters]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const createTask = async (payload: CreateTaskPayload) => {
    await taskService.createTask(projectId, payload);
    await fetchTasks();
  };

  const updateTask = async (taskId: string, payload: UpdateTaskPayload) => {
    await taskService.updateTask(projectId, taskId, payload);
    await fetchTasks();
  };

  const deleteTask = async (taskId: string) => {
    await taskService.deleteTask(projectId, taskId);
    await fetchTasks();
  };

  return {
    tasks,
    meta,
    filters,
    loading,
    error,
    setFilters,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
  };
}