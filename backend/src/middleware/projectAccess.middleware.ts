import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export async function projectAccessMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user?.id;
    const projectId = req.params.projectId;

    if (!userId) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    if (!projectId) {
      res.status(400).json({ success: false, message: 'Project ID is required' });
      return;
    }

    const membership = await prisma.projectMember.findFirst({
      where: {
        projectId,
        userId,
      },
    });

    if (!membership) {
      res.status(403).json({ success: false, message: 'Access denied: You are not a member of this project' });
      return;
    }

    next();
  } catch (error) {
    next(error);
  }
}