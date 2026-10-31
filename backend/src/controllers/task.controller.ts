import { Response } from 'express';
import { AuthenticatedRequest } from '../types/express';
import { TaskService } from '../services/task.service';
import {
  createTaskSchema,
  updateTaskSchema,
  updateTaskStatusSchema,
  taskQuerySchema,
} from '../validators/task.validator';

const taskService = new TaskService();

export class TaskController {
  async listTasks(req: AuthenticatedRequest, res: Response) {
    try {
      const query = taskQuerySchema.parse(req.query);
      const userId = req.user!.id;

      const tasks = await taskService.listTasks({
        userId,
        ...query,
      });

      return res.status(200).json({ success: true, data: tasks });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ success: false, errors: error.errors });
      }
      return res.status(500).json({ success: false, message: error.message || 'Internal server error' });
    }
  }

  async getTask(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      const task = await taskService.getTaskById(id, userId);
      if (!task) {
        return res.status(404).json({ success: false, message: 'Task not found' });
      }

      return res.status(200).json({ success: true, data: task });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message || 'Internal server error' });
    }
  }

  async createTask(req: AuthenticatedRequest, res: Response) {
    try {
      const body = createTaskSchema.parse(req.body);
      const userId = req.user!.id;

      const task = await taskService.createTask(userId, body);

      return res.status(201).json({ success: true, data: task });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ success: false, errors: error.errors });
      }
      return res.status(500).json({ success: false, message: error.message || 'Internal server error' });
    }
  }

  async updateTask(req: AuthenticatedRequest, res: Response) {
    try {
      const body = updateTaskSchema.parse(req.body);
      const userId = req.user!.id;
      const { id } = req.params;

      const task = await taskService.updateTask(id, userId, body);
      if (!task) {
        return res.status(404).json({ success: false, message: 'Task not found' });
      }

      return res.status(200).json({ success: true, data: task });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ success: false, errors: error.errors });
      }
      return res.status(500).json({ success: false, message: error.message || 'Internal server error' });
    }
  }

  async updateTaskStatus(req: AuthenticatedRequest, res: Response) {
    try {
      const body = updateTaskStatusSchema.parse(req.body);
      const userId = req.user!.id;
      const { id } = req.params;

      const task = await taskService.updateTaskStatus(id, userId, body.status);
      if (!task) {
        return res.status(404).json({ success: false, message: 'Task not found' });
      }

      return res.status(200).json({ success: true, data: task });
    } catch (error: any) {
      if (error.name === 'ZodError') {
        return res.status(400).json({ success: false, errors: error.errors });
      }
      return res.status(500).json({ success: false, message: error.message || 'Internal server error' });
    }
  }

  async deleteTask(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const { id } = req.params;

      const success = await taskService.deleteTask(id, userId);
      if (!success) {
        return res.status(404).json({ success: false, message: 'Task not found' });
      }

      return res.status(204).send();
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message || 'Internal server error' });
    }
  }
}