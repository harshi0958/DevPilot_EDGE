import { z } from 'zod';

export const TaskStatusEnum = z.enum(['TODO', 'IN_PROGRESS', 'COMPLETED']);
export const TaskPriorityEnum = z.enum(['LOW', 'MEDIUM', 'HIGH']);

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title too long'),
  description: z.string().optional(),
  status: TaskStatusEnum.optional().default('TODO'),
  priority: TaskPriorityEnum.optional().default('MEDIUM'),
  assigneeId: z.string().uuid().optional().nullable(),
  dueDate: z.string().datetime().optional().nullable(),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().optional().nullable(),
  status: TaskStatusEnum.optional(),
  priority: TaskPriorityEnum.optional(),
  assigneeId: z.string().uuid().optional().nullable(),
  dueDate: z.string().datetime().optional().nullable(),
});

export const listTasksQuerySchema = z.object({
  status: TaskStatusEnum.optional(),
  priority: TaskPriorityEnum.optional(),
  assigneeId: z.string().uuid().optional(),
  search: z.string().optional(),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type ListTasksQuery = z.infer<typeof listTasksQuerySchema>;