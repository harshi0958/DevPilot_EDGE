import { Router } from 'express';
import { TaskController } from './task.controller';
import { projectAccessMiddleware } from '../../middleware/projectAccess.middleware';

const router = Router({ mergeParams: true });
const taskController = new TaskController();

router.use(projectAccessMiddleware);

router.post('/', (req, res, next) => taskController.createTask(req, res, next));
router.get('/', (req, res, next) => taskController.getTasks(req, res, next));
router.get('/:taskId', (req, res, next) => taskController.getTaskById(req, res, next));
router.patch('/:taskId', (req, res, next) => taskController.updateTask(req, res, next));
router.delete('/:taskId', (req, res, next) => taskController.deleteTask(req, res, next));

export const taskRoutes = router;