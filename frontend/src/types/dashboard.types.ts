export interface DashboardMetrics {
  totalMembers: number;
  totalConversations: number;
  totalExecutions: number;
  totalFiles: number;
  successRate: number;
  totalDurationSec: number;
}

export interface DashboardSummaryResponse {
  metrics: DashboardMetrics;
  executionsByAgent: Record<string, number>;
  storage: {
    totalBytes: number;
    fileCount: number;
  };
}

export interface AIExecutionItem {
  id: string;
  agentType: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  promptTokens?: number | null;
  completionTokens?: number | null;
  durationMs?: number | null;
  createdAt: string;
}

export interface ProjectFileItem {
  id: string;
  name: string;
  path: string;
  sizeBytes: number;
  mimeType?: string | null;
  updatedAt: string;
}

export interface ActivityItem {
  id: string;
  type: 'EXECUTION' | 'FILE_UPDATE' | 'NOTIFICATION';
  title: string;
  description: string;
  timestamp: string;
}