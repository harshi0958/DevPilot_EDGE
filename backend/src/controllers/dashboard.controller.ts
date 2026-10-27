import { Request, Response } from 'express';
import { DashboardService } from '../services/dashboard.service';

export class DashboardController {
  public static async getSummary(req: Request, res: Response): Promise<void> {
    try {
      const { projectId } = req.params;
      if (!projectId) {
        res.status(400).json({ success: false, message: 'Project ID is required' });
        return;
      }

      const summary = await DashboardService.getSummary(projectId);
      res.status(200).json({
        success: true,
        data: summary,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch dashboard summary',
      });
    }
  }

  public static async getExecutions(req: Request, res: Response): Promise<void> {
    try {
      const { projectId } = req.params;
      const limit = parseInt(req.query.limit as string, 10) || 10;

      const executions = await DashboardService.getRecentExecutions(projectId, limit);
      res.status(200).json({
        success: true,
        data: executions,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch recent executions',
      });
    }
  }

  public static async getFiles(req: Request, res: Response): Promise<void> {
    try {
      const { projectId } = req.params;
      const limit = parseInt(req.query.limit as string, 10) || 6;

      const files = await DashboardService.getRecentFiles(projectId, limit);
      res.status(200).json({
        success: true,
        data: files,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch recent project files',
      });
    }
  }

  public static async getActivity(req: Request, res: Response): Promise<void> {
    try {
      const { projectId } = req.params;
      const limit = parseInt(req.query.limit as string, 10) || 10;

      const activity = await DashboardService.getActivity(projectId, limit);
      res.status(200).json({
        success: true,
        data: activity,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to fetch recent activity',
      });
    }
  }
}