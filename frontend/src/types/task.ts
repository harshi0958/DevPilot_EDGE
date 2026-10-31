export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';

export interface TaskProject {
  id: string;
  name: string;
  slug: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string | null;
  priority: Priority;
  status: TaskStatus;
  dueDate?: string | null;
  completedAt?: string | null;
  userId: string;
  projectId?: string | null;
  project?: TaskProject | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskDTO {
  title: string;
  description?: string;
  priority?: Priority;
  dueDate?: string;
  projectId?: string;
}

export interface UpdateTaskDTO {
  title?: string;
  description?: string;
  priority?: Priority;
  dueDate?: string;
  projectId?: string;
}

export interface TaskFiltersState {
  status?: TaskStatus;
  priority?: Priority;
  search?: string;
  projectId?: string;
  sortBy?: 'dueDate' | 'priority' | 'createdAt' | 'title';
  sortOrder?: 'asc' | 'desc';
}