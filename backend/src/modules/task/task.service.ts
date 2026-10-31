import { PrismaClient, Prisma } from '@prisma/client';
import { CreateTaskInput, UpdateTaskInput, TaskQueryInput } from './task.validation';

const prisma = new PrismaClient();

export class TaskService {
  async createTask(projectId: string, userId: string, data: CreateTaskInput) {
    return prisma.taskItem.create({
      data: {
        title: data.title,
        description: data.description,
        status: data.status,
        priority: data.priority,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
        projectId,
        createdById: userId,
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async getTasks(projectId: string, query: TaskQueryInput) {
    const { page, limit, status, priority, search, sortBy, sortOrder } = query;
    const skip = (page - 1) * limit;

    const where: Prisma.TaskItemWhereInput = {
      projectId,
      ...(status && { status }),
      ...(priority && { priority }),
      ...(search && {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    const [total, tasks] = await Promise.all([
      prisma.taskItem.count({ where }),
      prisma.taskItem.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          createdBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
    ]);

    return {
      data: tasks,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getTaskById(projectId: string, taskId: string) {
    return prisma.taskItem.findFirst({
      where: {
        id: taskId,
        projectId,
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async updateTask(projectId: string, taskId: string, data: UpdateTaskInput) {
    const existing = await prisma.taskItem.findFirst({
      where: { id: taskId, projectId },
    });

    if (!existing) {
      return null;
    }

    return prisma.taskItem.update({
      where: { id: taskId },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.status !== undefined && { status: data.status }),
        ...(data.priority !== undefined && { priority: data.priority }),
        ...(data.dueDate !== undefined && {
          dueDate: data.dueDate ? new Date(data.dueDate) : null,
        }),
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async deleteTask(projectId: string, taskId: string) {
    const existing = await prisma.taskItem.findFirst({
      where: { id: taskId, projectId },
    });

    if (!existing) {
      return null;
    }

    return prisma.taskItem.delete({
      where: { id: taskId },
    });
  }
}