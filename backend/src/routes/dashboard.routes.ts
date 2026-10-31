import { Router } from 'express';
import {
  getDashboardStats,
  getRecentExecutions,
  getActivityTimeline,
} from '../controllers/dashboard.controller';
import { requireAuth } from '../middleware/auth.middleware';
import { projectAccessMiddleware } from '../middleware/projectAccess.middleware';

const router = Router({ mergeParams: true });

router.use(requireAuth);
router.use(projectAccessMiddleware);

router.get('/stats', getDashboardStats);
router.get('/recent-executions', getRecentExecutions);
router.get('/activity-timeline', getActivityTimeline);

export default router;