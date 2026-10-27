import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller';

const router = Router({ mergeParams: true });

router.get('/summary', DashboardController.getSummary);
router.get('/executions', DashboardController.getExecutions);
router.get('/files', DashboardController.getFiles);
router.get('/activity', DashboardController.getActivity);

export default router;