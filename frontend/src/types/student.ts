export type StudentStatus = 'ACTIVE' | 'INACTIVE' | 'GRADUATED' | 'SUSPENDED';

export interface Student {
  id: string;
  projectId: string;
  firstName: string;
  lastName: string;
  email: string;
  enrollmentNo: string;
  course: string;
  status: StudentStatus;
  createdAt: string;
  updatedAt: string;
}

export type CreateStudentInput = Omit<Student, 'id' | 'projectId' | 'createdAt' | 'updatedAt'>;
export type UpdateStudentInput = Partial<CreateStudentInput>;

export interface StudentResponse {
  success: boolean;
  data: Student[];
}

export interface SingleStudentResponse {
  success: boolean;
  data: Student;
}