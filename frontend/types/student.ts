export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  enrollmentNo: string;
  course: string;
  status: 'ACTIVE' | 'INACTIVE' | 'GRADUATED';
  projectId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudentResponse {
  success: boolean;
  data: Student[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface SingleStudentResponse {
  success: boolean;
  data: Student;
  message?: string;
}