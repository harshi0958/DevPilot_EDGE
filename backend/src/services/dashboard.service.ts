import prisma from '../utils/prisma';

export interface DashboardSummaryData {
  metrics: {
    totalMembers: number;
    totalConversations: number;
    totalExecutions: number;
    totalFiles: number;
    successRate: number;
    totalDurationSec: number;
  };
  executionsByAgent: Record<string, number>;
  storage: {
    totalBytes: number;
    fileCount: number;
  };
}

export class DashboardService {
  public static async getSummary(projectId: string): Promise<DashboardSummaryData> {
    const [totalMembers, totalTasks, completedTasks, totalStudents] = await Promise.all([
      prisma.projectMember.count({ where: { projectId } }),
      prisma.taskItem.count({ where: { projectId } }),
      prisma.taskItem.count({ where: { projectId, status: 'COMPLETED' } }),
      prisma.student.count({ where: { projectId } }),
    ]);

    const successRate = totalTasks > 0 ? Number(((completedTasks / totalTasks) * 100).toFixed(1)) : 100;

    return {
      metrics: {
        totalMembers,
        totalConversations: 0,
        totalExecutions: totalTasks,
        totalFiles: totalStudents,
        successRate,
        totalDurationSec: 0,
      },
      executionsByAgent: {},
      storage: {
        totalBytes: 0,
        fileCount: totalStudents,
      },
    };
  }

  public static async getRecentExecutions(projectId: string, limit: number = 10) {
    return prisma.taskItem.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: {
        id: true,
        title: true,
        status: true,
        priority: true,
        dueDate: true,
        createdAt: true,
      },
    });
  }

  public static async getRecentFiles(projectId: string, limit: number = 6) {
    return prisma.student.findMany({
      where: { projectId },
      orderBy: { updatedAt: 'desc' },
      take: limit,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        enrollmentNo: true,
        course: true,
        updatedAt: true,
      },
    });
  }

  public static async getActivity(projectId: string, limit: number = 10) {
    const tasks = await prisma.taskItem.findMany({
      where: { projectId },
      orderBy: { updatedAt: 'desc' },
      take: limit,
      select: {
        id: true,
        title: true,
        status: true,
        updatedAt: true,
      },
    });

    const students = await prisma.student.findMany({
      where: { projectId },
      orderBy: { updatedAt: 'desc' },
      take: limit,
      select: {
        id: true,
        firstName: true,
        lastName: true,
        updatedAt: true,
      },
    });

    const activityEvents = [
      ...tasks.map((t) => ({
        id: `task-${t.id}`,
        type: 'TASK',
        title: `Task: ${t.title}`,
        description: `Status: ${t.status}`,
        timestamp: t.updatedAt instanceof Date ? t.updatedAt : new Date(t.updatedAt),
      })),
      ...students.map((s) => ({
        id: `student-${s.id}`,
        type: 'STUDENT',
        title: `Student: ${s.firstName} ${s.lastName}`,
        description: `Student record updated`,
        timestamp: s.updatedAt instanceof Date ? s.updatedAt : new Date(s.updatedAt),
      })),
    ];

    activityEvents.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    return activityEvents.slice(0, limit);
  }
}