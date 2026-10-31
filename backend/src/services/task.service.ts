import { PrismaClient, Priority, TaskStatus } from '@prisma/client';

const prisma = new PrismaClient();

interface ListTasksParams {
  userId: string;
  status?: TaskStatus;
  priority?: Priority;
  search?: string;
  projectId?: string;
  sortBy?: 'dueDate' | 'priority' | 'createdAt' | 'title';
  sortOrder?: 'asc' | 'desc';
}

export class TaskService {
  async listTasks(params: ListTasksParams) {
    const { userId, status, priority, search, projectId, sortBy = 'createdAt', sortOrder = 'desc' } = params;

    const where: any = { userId };
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (projectId) where.projectId = projectId;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    return prisma.task.findMany({
      where,
      orderBy: { [sortBy]: sortOrder },
      include: {
        project: {
          select: { id: true, name: true, slug: true }
        }
      }
    });
  }

  async getTaskById(id: string, userId: string) {
    return prisma.task.findFirst({
      where: { id, userId },
      include: {
        project: {
          select: { id: true, name: true, slug: true }
        }
      }
    });
  }

  async createTask(userId: string, data: {
    title: string;
    description?: string | null;
    priority?: Priority;
    dueDate?: string | null;
    projectId?: string | null;
  }) {
    return prisma.task.create({
      data: {
        title: data.title,
        description: data.description,
        priority: data.priority || 'MEDIUM',
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        projectId: data.projectId,
        userId,
      },
      include: {
        project: {
          select: { id: true, name: true, slug: true }
        }
      }
    });
  }

  async updateTask(id: string, userId: string, data: {
    title?: string;
    description?: string | null;
    priority?: Priority;
    dueDate?: string | null;
    projectId?: string | null;
  }) {
    const task = await this.getTaskById(id, userId);
    if (!task) return null;

    return prisma.task.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.priority !== undefined && { priority: data.priority }),
        ...(data.dueDate !== undefined && { dueDate: data.dueDate ? new Date(data.dueDate) : null }),
        ...(data.projectId !== undefined && { projectId: data.projectId }),
      },
      include: {
        project: {
          select: { id: true, name: true, slug: true }
        }
      }
    });
  }

  async updateTaskStatus(id: string, userId: string, status: TaskStatus) {
    const task = await this.getTaskById(id, userId);
    if (!task) return null;

    const isCompleted = status === 'COMPLETED';
    return prisma.task.update({
      where: { id },
      data: {
        status,
        completedAt: isCompleted ? new Date() : null,
      },
      include: {
        project: {
          select: { id: true, name: true, slug: true }
        }
      }
    });
  }

  async deleteTask(id: string, userId: string) {
    const task = await this.getTaskById(id, userId);
    if (!task) return false;

    await prisma.task.delete({ where: { id } });
    return true;
  }
}