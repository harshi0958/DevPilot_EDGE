import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface CreateStudentDTO {
  firstName: string;
  lastName: string;
  email: string;
  enrollmentNo: string;
  course: string;
  status?: string;
}

export interface UpdateStudentDTO {
  firstName?: string;
  lastName?: string;
  email?: string;
  enrollmentNo?: string;
  course?: string;
  status?: string;
}

export class StudentService {
  static async getStudentsByProject(projectId: string) {
    return prisma.student.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async getStudentById(id: string, projectId: string) {
    return prisma.student.findFirst({
      where: { id, projectId },
    });
  }

  static async createStudent(projectId: string, data: CreateStudentDTO) {
    return prisma.student.create({
      data: {
        ...data,
        projectId,
      },
    });
  }

  static async updateStudent(id: string, projectId: string, data: UpdateStudentDTO) {
    const student = await this.getStudentById(id, projectId);
    if (!student) {
      throw new Error('Student not found');
    }

    return prisma.student.update({
      where: { id },
      data,
    });
  }

  static async deleteStudent(id: string, projectId: string) {
    const student = await this.getStudentById(id, projectId);
    if (!student) {
      throw new Error('Student not found');
    }

    return prisma.student.delete({
      where: { id },
    });
  }
}