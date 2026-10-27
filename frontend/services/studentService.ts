import axios from 'axios';
import { Student, StudentResponse, SingleStudentResponse } from '@/types/student';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const DEFAULT_PROJECT_ID = process.env.NEXT_PUBLIC_PROJECT_ID || 'faa9cfc8-5db7-4be3-8e23-213634465f7b';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export const studentService = {
  async getStudents(params?: { search?: string; course?: string; status?: string; page?: number; limit?: number }, projectId: string = DEFAULT_PROJECT_ID) {
    const response = await api.get<StudentResponse>(`/api/projects/${projectId}/students`, { params });
    return response.data;
  },

  async getStudentById(id: string, projectId: string = DEFAULT_PROJECT_ID) {
    const response = await api.get<SingleStudentResponse>(`/api/projects/${projectId}/students/${id}`);
    return response.data;
  },

  async createStudent(data: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>, projectId: string = DEFAULT_PROJECT_ID) {
    const response = await api.post<SingleStudentResponse>(`/api/projects/${projectId}/students`, data);
    return response.data;
  },

  async updateStudent(id: string, data: Partial<Student>, projectId: string = DEFAULT_PROJECT_ID) {
    const response = await api.put<SingleStudentResponse>(`/api/projects/${projectId}/students/${id}`, data);
    return response.data;
  },

  async deleteStudent(id: string, projectId: string = DEFAULT_PROJECT_ID) {
    const response = await api.delete<{ success: boolean; message: string }>(`/api/projects/${projectId}/students/${id}`);
    return response.data;
  },
};