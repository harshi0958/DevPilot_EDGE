import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import { StudentService } from '../../services/student.service';

const studentService = new StudentService();

export class StudentController {
  async getStudents(req: AuthRequest, res: Response) {
    try {
      const { search, status } = req.query;
      const students = await studentService.getAllStudents(
        search as string,
        status as string
      );
      return res.json(students);
    } catch (error: any) {
      return res.status(500).json({ error: error.message || 'Internal server error' });
    }
  }

  async getStudent(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const student = await studentService.getStudentById(id);
      
      if (!student) {
        return res.status(404).json({ error: 'Student not found' });
      }

      return res.json(student);
    } catch (error: any) {
      return res.status(500).json({ error: error.message || 'Internal server error' });
    }
  }

  async createStudent(req: AuthRequest, res: Response) {
    try {
      const student = await studentService.createStudent(req.body);
      return res.status(201).json(student);
    } catch (error: any) {
      return res.status(400).json({ error: error.message || 'Invalid input data' });
    }
  }

  async updateStudent(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const student = await studentService.updateStudent(id, req.body);

      if (!student) {
        return res.status(404).json({ error: 'Student not found' });
      }

      return res.json(student);
    } catch (error: any) {
      return res.status(400).json({ error: error.message || 'Invalid input data' });
    }
  }

  async deleteStudent(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const student = await studentService.deleteStudent(id);

      if (!student) {
        return res.status(404).json({ error: 'Student not found' });
      }

      return res.json({ message: 'Student deleted successfully' });
    } catch (error: any) {
      return res.status(500).json({ error: error.message || 'Internal server error' });
    }
  }
}