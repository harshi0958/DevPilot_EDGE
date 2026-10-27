import { Router, Response } from 'express';
import prisma from '../lib/prisma';
import { requireAdmin, AuthenticatedRequest } from '../middleware/adminAuth';

const router = Router();

router.use(requireAdmin);

router.get('/metrics', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const [totalUsers, totalProjects, totalExecutions, totalFiles, recentExecutions] = await Promise.all([
      prisma.user.count(),
      prisma.project.count(),
      prisma.aIExecution.count(),
      prisma.projectFile.count(),
      prisma.aIExecution.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          project: { select: { name: true } },
          agent: { select: { name: true, type: true } }
        }
      })
    ]);

    res.json({
      metrics: {
        totalUsers,
        totalProjects,
        totalExecutions,
        totalFiles
      },
      recentExecutions
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch admin metrics' });
  }
});

router.get('/users', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: {
          select: { projects: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ users });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

router.get('/projects', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const projects = await prisma.project.findMany({
      include: {
        _count: {
          select: {
            members: true,
            conversations: true,
            executions: true,
            files: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ projects });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

export default router;