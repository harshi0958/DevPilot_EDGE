export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface Task {
  id: string;
  title: string;
  description?: string | null;
  priority: Priority;
  completed: boolean;
  dueDate?: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskDTO {
  title: string;
  description?: string;
  priority?: Priority;
  dueDate?: string;
}

export interface UpdateTaskDTO {
  title?: string;
  description?: string | null;
  priority?: Priority;
  completed?: boolean;
  dueDate?: string | null;
}