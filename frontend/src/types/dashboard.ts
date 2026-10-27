export interface DashboardMetrics {
  members: number;
  conversations: number;
  executions: number;
  files: number;
  successRate: number;
}

export interface AIExecutionSummary {
  id: string;
  status: 'PENDING' | 'RUNNING' | 'SUCCESS' | 'FAILED';
  agent: string;
  durationMs: number | null;
  createdAt: string;
  promptTokens?: number;
  completionTokens?: number;
}

export interface DashboardData {
  project: {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    createdAt: string;
    updatedAt: string;
  };
  metrics: DashboardMetrics;
  recentExecutions: AIExecutionSummary[];
}