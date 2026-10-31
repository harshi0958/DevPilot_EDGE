import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const { projectId } = req.params;

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        createdAt: true,
      },
    });

    if (!project) {
      res.status(404).json({ success: false, message: 'Project not found' });
      return;
    }

    const [
      totalMembers,
      totalTasks,
      completedTasks,
      totalStudents,
    ] = await prisma.$transaction([
      prisma.projectMember.count({ where: { projectId } }),
      prisma.taskItem.count({ where: { projectId } }),
      prisma.taskItem.count({ where: { projectId, status: 'COMPLETED' } }),
      prisma.student.count({ where: { projectId } }),
    ]);

    const successRatePercentage =
      totalTasks > 0
        ? parseFloat(((completedTasks / totalTasks) * 100).toFixed(1))
        : 100;

    res.status(200).json({
      success: true,
      data: {
        project,
        metrics: {
          totalMembers,
          totalConversations: 0,
          totalExecutions: totalTasks,
          totalFiles: totalStudents,
          totalTokensConsumed: 0,
          avgDurationMs: 0,
          successRatePercentage,
        },
        agentExecutionBreakdown: {},
      },
    });
  } catch (error) {
    console.error('Error in getDashboardStats:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve dashboard stats' });
  }
};

export const getRecentExecutions = async (req: Request, res: Response): Promise<void> => {
  try {
    const { projectId } = req.params;
    const limit = Math.min(parseInt(req.query.limit as string, 10) || 10, 50);

    const recentTasks = await prisma.taskItem.findMany({
      where: { projectId },
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
      success: true,
      data: recentTasks,
    });
  } catch (error) {
    console.error('Error in getRecentExecutions:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve recent executions' });
  }
};

export const getActivityTimeline = async (req: Request, res: Response): Promise<void> => {
  try {
    const { projectId } = req.params;

    const [recentTasks, recentStudents] = await prisma.$transaction([
      prisma.taskItem.findMany({
        where: { projectId },
        take: 10,
        orderBy: { updatedAt: 'desc' },
      }),
      prisma.student.findMany({
        where: { projectId },
        take: 5,
        orderBy: { updatedAt: 'desc' },
      }),
    ]);

    const timeline = [
      ...recentTasks.map((item) => ({
        id: `task-${item.id}`,
        type: 'TASK',
        title: `Task: ${item.title}`,
        status: item.status,
        timestamp: item.updatedAt,
      })),
      ...recentStudents.map((student) => ({
        id: `student-${student.id}`,
        type: 'STUDENT',
        title: `Student: ${student.firstName} ${student.lastName}`,
        status: student.status,
        timestamp: student.updatedAt,
      })),
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    res.status(200).json({
      success: true,
      data: timeline.slice(0, 15),
    });
  } catch (error) {
    console.error('Error in getActivityTimeline:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve activity timeline' });
  }
};