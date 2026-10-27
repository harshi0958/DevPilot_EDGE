import { CreateStudentDto, UpdateStudentDto } from './student.schema';
import { StudentService as SharedStudentService, CreateStudentDTO, UpdateStudentDTO } from '../../services/student.service';

export class StudentService {
  async getAllStudents(search?: string, status?: string, projectId?: string) {
    if (projectId) {
      return SharedStudentService.getStudentsByProject(projectId);
    }
    return SharedStudentService.getAllStudents(search, status);
  }

  async getStudentById(id: string, projectId?: string) {
    return SharedStudentService.getStudentById(id, projectId);
  }

  async createStudent(data: CreateStudentDTO & { projectId?: string }, projectId?: string) {
    const targetProjectId = projectId || data.projectId || 'faa9cfc8-5db7-4be3-8e23-213634465f7b';
    return SharedStudentService.createStudent(targetProjectId, data);
  }

  async updateStudent(id: string, data: UpdateStudentDTO, projectId?: string) {
    return SharedStudentService.updateStudent(id, projectId, data);
  }

  async deleteStudent(id: string, projectId?: string) {
    return SharedStudentService.deleteStudent(id, projectId);
  }

  static async findAll(projectId: string, search?: string, page = 1, limit = 10) {
    const students = await SharedStudentService.getStudentsByProject(projectId);
    const filtered = search ? students.filter(s => 
      s.firstName.toLowerCase().includes(search.toLowerCase()) ||
      s.lastName.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      s.course.toLowerCase().includes(search.toLowerCase())
    ) : students;

    const skip = (page - 1) * limit;
    const paginated = filtered.slice(skip, skip + limit);

    return {
      data: paginated,
      meta: {
        total: filtered.length,
        page,
        limit,
        totalPages: Math.ceil(filtered.length / limit),
      },
    };
  }

  static async findById(id: string, projectId: string) {
    return SharedStudentService.getStudentById(id, projectId);
  }

  static async create(projectId: string, dto: CreateStudentDto & { firstName: string; lastName: string; enrollmentNo: string; course: string; status?: any }) {
    return SharedStudentService.createStudent(projectId, dto);
  }

  static async update(id: string, projectId: string, dto: UpdateStudentDto & any) {
    return SharedStudentService.updateStudent(id, projectId, dto);
  }

  static async delete(id: string, projectId: string) {
    return SharedStudentService.deleteStudent(id, projectId);
  }
}