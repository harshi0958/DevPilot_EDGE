import { z } from 'zod';

export const createStudentSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name cannot exceed 100 characters').trim(),
  email: z.string().email('Invalid email format').toLowerCase().trim(),
  course: z.string().min(2, 'Course must be at least 2 characters').max(100, 'Course cannot exceed 100 characters').trim(),
});

export const updateStudentSchema = createStudentSchema.partial();

export const queryStudentSchema = z.object({
  search: z.string().optional().default(''),
  page: z.string().optional().transform(val => (val ? parseInt(val, 10) : 1)),
  limit: z.string().optional().transform(val => (val ? parseInt(val, 10) : 10)),
});

export type CreateStudentDto = z.infer<typeof createStudentSchema>;
export type UpdateStudentDto = z.infer<typeof updateStudentSchema>;