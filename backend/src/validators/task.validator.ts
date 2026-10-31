import { z } from 'zod';

export const PriorityEnum = z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']);
export const TaskStatusEnum = z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED']);

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title is too long'),
  description: z.string().max(4000, 'Description is too long').optional(),
  priority: PriorityEnum.default('MEDIUM'),
  dueDate: z.string().datetime().optional().nullable(),
  projectId: z.string().uuid().optional().nullable(),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title is too long').optional(),
  description: z.string().max(4000, 'Description is too long').optional().nullable(),
  priority: PriorityEnum.optional(),
  dueDate: z.string().datetime().optional().nullable(),
  projectId: z.string().uuid().optional().nullable(),
});

export const updateTaskStatusSchema = z.object({
  status: TaskStatusEnum,
});

export const taskQuerySchema = z.object({
  status: TaskStatusEnum.optional(),
  priority: PriorityEnum.optional(),
  search: z.string().optional(),
  projectId: z.string().uuid().optional(),
  sortBy: z.enum(['dueDate', 'priority', 'createdAt', 'title']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});