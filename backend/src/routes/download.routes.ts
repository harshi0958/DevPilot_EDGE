import { Router } from 'express';
import { downloadProjectZip } from '../controllers/download.controller';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();

router.get('/projects/:projectId/download', authenticateJWT, downloadProjectZip);

export default router;