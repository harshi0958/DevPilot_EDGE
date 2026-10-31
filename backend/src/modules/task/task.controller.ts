import { Response, NextFunction } from 'express';
import { TaskService } from './task.service';
import { AuthenticatedRequest } from '../../middleware/projectAccess.middleware';
import { createTaskSchema, updateTaskSchema, taskQuerySchema } from './task.validation';

const taskService = new TaskService();

export class TaskController {
  async createTask(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { projectId } = req.params;
      const userId = req.user!.id;
      const validatedData = createTaskSchema.parse(req.body);

      const task = await taskService.createTask(projectId, userId, validatedData);
      res.status(201).json({ success: true, data: task });
    } catch (error) {
      next(error);
    }
  }

  async getTasks(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { projectId } = req.params;
      const query = taskQuerySchema.parse(req.query);

      const result = await taskService.getTasks(projectId, query);
      res.status(200).json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  }

  async getTaskById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { projectId, taskId } = req.params;
      const task = await taskService.getTaskById(projectId, taskId);

      if (!task) {
        res.status(404).json({ success: false, message: 'Task not found' });
        return;
      }

      res.status(200).json({ success: true, data: task });
    } catch (error) {
      next(error);
    }
  }

  async updateTask(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { projectId, taskId } = req.params;
      const validatedData = updateTaskSchema.parse(req.body);

      const updated = await taskService.updateTask(projectId, taskId, validatedData);
      if (!updated) {
        res.status(404).json({ success: false, message: 'Task not found' });
        return;
      }

      res.status(200).json({ success: true, data: updated });
    } catch (error) {
      next(error);
    }
  }

  async deleteTask(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { projectId, taskId } = req.params;
      const deleted = await taskService.deleteTask(projectId, taskId);

      if (!deleted) {
        res.status(404).json({ success: false, message: 'Task not found' });
        return;
      }

      res.status(200).json({ success: true, message: 'Task deleted successfully' });
    } catch (error) {
      next(error);
    }
  }
}