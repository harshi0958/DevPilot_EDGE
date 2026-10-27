import { Router } from 'express';
import { StudentController } from './student.controller';
import { authenticateToken } from '../../middleware/auth.middleware';

const router = Router();
const studentController = new StudentController();

router.use(authenticateToken);

router.get('/', (req, res) => studentController.getStudents(req, res));
router.get('/:id', (req, res) => studentController.getStudent(req, res));
router.post('/', (req, res) => studentController.createStudent(req, res));
router.put('/:id', (req, res) => studentController.updateStudent(req, res));
router.delete('/:id', (req, res) => studentController.deleteStudent(req, res));

export const studentRoutes = router;