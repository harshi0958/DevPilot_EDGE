import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth.middleware';
import prisma from '../utils/prisma';

export const adminAuth = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const userId = req.user?.id;
    const projectId = req.params.projectId;

    if (!userId) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    if (!projectId) {
      res.status(400).json({ success: false, message: 'Project ID required' });
      return;
    }

    const member = await prisma.projectMember.findFirst({
      where: { userId, projectId },
    });

    if (!member || (!['ADMIN', 'OWNer', 'OWNER'].includes(member.role))) {
      res.status(403).json({ success: false, message: 'Forbidden: Admin access required' });
      return;
    }

    next();
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'Server error' });
  }
};