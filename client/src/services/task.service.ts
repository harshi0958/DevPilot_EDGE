import { Task, CreateTaskDTO, UpdateTaskDTO } from '../types/task';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const taskService = {
  async getTasks(completed?: boolean, priority?: string): Promise<Task[]> {
    const params = new URLSearchParams();
    if (completed !== undefined) params.append('completed', String(completed));
    if (priority) params.append('priority', priority);

    const res = await fetch(`${API_URL}/tasks?${params.toString()}`, {
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to fetch tasks');
    return res.json();
  },

  async createTask(data: CreateTaskDTO): Promise<Task> {
    const res = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to create task');
    return res.json();
  },

  async updateTask(id: string, data: UpdateTaskDTO): Promise<Task> {
    const res = await fetch(`${API_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to update task');
    return res.json();
  },

  async deleteTask(id: string): Promise<void> {
    const res = await fetch(`${API_URL}/tasks/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    if (!res.ok) throw new Error('Failed to delete task');
  },
};