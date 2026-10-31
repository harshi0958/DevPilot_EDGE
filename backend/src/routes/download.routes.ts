import { Router } from 'express';
import { downloadProjectZip } from '../controllers/download.controller';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router({ mergeParams: true });

router.get('/', authenticateJWT, downloadProjectZip);

export default router;