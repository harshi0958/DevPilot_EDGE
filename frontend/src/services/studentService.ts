import { Student } from '../types/student';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export class StudentService {
  static async getStudents(projectId: string): Promise<Student[]> {
    const res = await fetch(`${API_BASE_URL}/api/projects/${projectId}/students`, {
      credentials: 'include',
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message || 'Failed to fetch students');
    return json.data;
  }

  static async createStudent(projectId: string, data: any): Promise<Student> {
    const res = await fetch(`${API_BASE_URL}/api/projects/${projectId}/students`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message || 'Failed to create student');
    return json.data;
  }

  static async updateStudent(projectId: string, id: string, data: any): Promise<Student> {
    const res = await fetch(`${API_BASE_URL}/api/projects/${projectId}/students/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message || 'Failed to update student');
    return json.data;
  }

  static async deleteStudent(projectId: string, id: string): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/api/projects/${projectId}/students/${id}`, {
      method: 'DELETE',
      credentials: 'include',
    });
    const json = await res.json();
    if (!json.success) throw new Error(json.message || 'Failed to delete student');
  }
}