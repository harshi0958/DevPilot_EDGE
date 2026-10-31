import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { StudentService } from '../services/student.service';

export class StudentController {
  static async list(req: AuthRequest, res: Response) {
    try {
      const { projectId } = req.params;
      const students = await StudentService.getStudentsByProject(projectId);
      return res.json({ success: true, data: students });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message || 'Internal server error' });
    }
  }

  static async getOne(req: AuthRequest, res: Response) {
    try {
      const { projectId, id } = req.params;
      const student = await StudentService.getStudentById(id, projectId);
      if (!student) {
        return res.status(404).json({ success: false, message: 'Student not found' });
      }
      return res.json({ success: true, data: student });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message || 'Internal server error' });
    }
  }

  static async create(req: AuthRequest, res: Response) {
    try {
      const { projectId } = req.params;
      const { firstName, lastName, email, enrollmentNo, course, status } = req.body;

      if (!firstName || !lastName || !email || !enrollmentNo || !course) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
      }

      const student = await StudentService.createStudent(projectId, {
        firstName,
        lastName,
        email,
        enrollmentNo,
        course,
        status,
      });

      return res.status(201).json({ success: true, data: student });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message || 'Failed to create student' });
    }
  }

  static async update(req: AuthRequest, res: Response) {
    try {
      const { projectId, id } = req.params;
      const { firstName, lastName, email, enrollmentNo, course, status } = req.body;

      const student = await StudentService.updateStudent(id, projectId, {
        firstName,
        lastName,
        email,
        enrollmentNo,
        course,
        status,
      });

      return res.json({ success: true, data: student });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message || 'Failed to update student' });
    }
  }

  static async remove(req: AuthRequest, res: Response) {
    try {
      const { projectId, id } = req.params;
      await StudentService.deleteStudent(id, projectId);
      return res.json({ success: true, message: 'Student deleted successfully' });
    } catch (error: any) {
      return res.status(400).json({ success: false, message: error.message || 'Failed to delete student' });
    }
  }
}