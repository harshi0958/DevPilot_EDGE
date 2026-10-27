import { Router } from 'express';
import { StudentController } from '../controllers/student.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router({ mergeParams: true });

router.use(authenticateToken);

router.get('/', StudentController.list);
router.post('/', StudentController.create);
router.get('/:id', StudentController.getOne);
router.put('/:id', StudentController.update);
router.delete('/:id', StudentController.remove);

export default router;