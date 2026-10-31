import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const getStudents = async (req: Request, res: Response): Promise<void> => {
  try {
    const { projectId } = req.params;
    const students = await prisma.student.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json({ success: true, data: students });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch students' });
  }
};

export const getStudentById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { projectId, id } = req.params;
    const student = await prisma.student.findFirst({ where: { id, projectId } });
    if (!student) {
      res.status(404).json({ success: false, error: 'Student not found' });
      return;
    }
    res.status(200).json({ success: true, data: student });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch student' });
  }
};

export const createStudent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { projectId } = req.params;
    const { firstName, lastName, email, enrollmentNo, course, status } = req.body;
    const student = await prisma.student.create({
      data: {
        projectId,
        firstName,
        lastName,
        email,
        enrollmentNo,
        course,
        status,
      },
    });
    res.status(201).json({ success: true, data: student });
  } catch (error) {
    res.status(400).json({ success: false, error: 'Failed to create student. Email or enrollment might already exist.' });
  }
};

export const updateStudent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { projectId, id } = req.params;
    const { firstName, lastName, email, enrollmentNo, course, status } = req.body;
    const existing = await prisma.student.findFirst({ where: { id, projectId } });
    if (!existing) {
      res.status(404).json({ success: false, error: 'Student not found' });
      return;
    }
    const student = await prisma.student.update({
      where: { id },
      data: { firstName, lastName, email, enrollmentNo, course, status },
    });
    res.status(200).json({ success: true, data: student });
  } catch (error) {
    res.status(400).json({ success: false, error: 'Failed to update student' });
  }
};

export const deleteStudent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { projectId, id } = req.params;
    const existing = await prisma.student.findFirst({ where: { id, projectId } });
    if (!existing) {
      res.status(404).json({ success: false, error: 'Student not found' });
      return;
    }
    await prisma.student.delete({ where: { id } });
    res.status(200).json({ success: true, message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete student' });
  }
};