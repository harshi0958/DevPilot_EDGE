import { Task, CreateTaskPayload, UpdateTaskPayload } from '@/types/task';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export async function getTasks(projectId: string, filterParams?: Record<string, string>): Promise<Task[]> {
  const query = filterParams ? `?${new URLSearchParams(filterParams).toString()}` : '';
  const res = await fetch(`${BASE_URL}/projects/${projectId}/tasks${query}`, {
    method: 'GET',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  });

  if (!res.ok) {
    throw new Error('Failed to fetch tasks');
  }
  const json = await res.json();
  return json.data;
}

export async function createTask(projectId: string, payload: CreateTaskPayload): Promise<Task> {
  const res = await fetch(`${BASE_URL}/projects/${projectId}/tasks`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to create task');
  }
  const json = await res.json();
  return json.data;
}

export async function updateTask(projectId: string, taskId: string, payload: UpdateTaskPayload): Promise<Task> {
  const res = await fetch(`${BASE_URL}/projects/${projectId}/tasks/${taskId}`, {
    method: 'PATCH',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to update task');
  }
  const json = await res.json();
  return json.data;
}

export async function deleteTask(projectId: string, taskId: string): Promise<void> {
  const res = await fetch(`${BASE_URL}/projects/${projectId}/tasks/${taskId}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || 'Failed to delete task');
  }
}