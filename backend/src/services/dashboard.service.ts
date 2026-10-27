import { prisma } from '../lib/prisma';

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
    const [totalMembers, totalConversations, totalExecutions, successfulExecutions, totalFiles, filesAggregate, executionsByAgentRaw, durationAggregate] = await Promise.all([
      prisma.projectMember.count({ where: { projectId } }),
      prisma.conversation.count({ where: { projectId } }),
      prisma.aIExecution.count({ where: { projectId } }),
      prisma.aIExecution.count({ where: { projectId, status: 'COMPLETED' } }),
      prisma.projectFile.count({ where: { projectId } }),
      prisma.projectFile.aggregate({
        where: { projectId },
        _sum: { sizeBytes: true },
      }),
      prisma.aIExecution.groupBy({
        by: ['agentType'],
        where: { projectId },
        _count: { agentType: true },
      }),
      prisma.aIExecution.aggregate({
        where: { projectId },
        _sum: { durationMs: true },
      }),
    ]);

    const executionsByAgent: Record<string, number> = {};
    executionsByAgentRaw.forEach((entry) => {
      executionsByAgent[entry.agentType] = entry._count.agentType;
    });

    const successRate = totalExecutions > 0 ? Number(((successfulExecutions / totalExecutions) * 100).toFixed(1)) : 100;
    const totalDurationSec = Math.round((durationAggregate._sum.durationMs || 0) / 1000);

    return {
      metrics: {
        totalMembers,
        totalConversations,
        totalExecutions,
        totalFiles,
        successRate,
        totalDurationSec,
      },
      executionsByAgent,
      storage: {
        totalBytes: filesAggregate._sum.sizeBytes || 0,
        fileCount: totalFiles,
      },
    };
  }

  public static async getRecentExecutions(projectId: string, limit: number = 10) {
    return prisma.aIExecution.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: {
        id: true,
        agentType: true,
        status: true,
        promptTokens: true,
        completionTokens: true,
        durationMs: true,
        createdAt: true,
      },
    });
  }

  public static async getRecentFiles(projectId: string, limit: number = 6) {
    return prisma.projectFile.findMany({
      where: { projectId },
      orderBy: { updatedAt: 'desc' },
      take: limit,
      select: {
        id: true,
        name: true,
        path: true,
        sizeBytes: true,
        mimeType: true,
        updatedAt: true,
      },
    });
  }

  public static async getActivity(projectId: string, limit: number = 10) {
    const executions = await prisma.aIExecution.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      select: {
        id: true,
        agentType: true,
        status: true,
        createdAt: true,
      },
    });

    const files = await prisma.projectFile.findMany({
      where: { projectId },
      orderBy: { updatedAt: 'desc' },
      take: limit,
      select: {
        id: true,
        name: true,
        path: true,
        updatedAt: true,
      },
    });

    const activityEvents = [
      ...executions.map((e) => ({
        id: `exec-${e.id}`,
        type: 'EXECUTION',
        title: `AI Task: ${e.agentType}`,
        description: `Status: ${e.status}`,
        timestamp: e.createdAt instanceof Date ? e.createdAt : new Date(e.createdAt),
      })),
      ...files.map((f) => ({
        id: `file-${f.id}`,
        type: 'FILE_UPDATE',
        title: `File modified: ${f.name}`,
        description: f.path,
        timestamp: f.updatedAt instanceof Date ? f.updatedAt : new Date(f.updatedAt),
      })),
    ];

    activityEvents.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    return activityEvents.slice(0, limit);
  }
}