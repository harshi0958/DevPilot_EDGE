import { Router } from 'express';
import prisma from '../utils/prisma';
import { adminAuth } from '../middleware/adminAuth';

const router = Router();

router.use(adminAuth);

router.get('/stats', async (_req, res) => {
  try {
    const [usersCount, projectsCount, executionsCount, filesCount] = await Promise.all([
      prisma.user.count(),
      prisma.project.count(),
      prisma.aIExecution.count(),
      prisma.projectFile.count(),
    ]);

    res.json({
      success: true,
      data: {
        users: usersCount,
        projects: projectsCount,
        executions: executionsCount,
        files: filesCount,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
});

export default router;