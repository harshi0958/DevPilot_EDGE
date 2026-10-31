export interface DashboardMetrics {
  totalMembers: number;
  totalConversations: number;
  totalExecutions: number;
  totalFiles: number;
  totalTokensConsumed: number;
  avgDurationMs: number;
  successRatePercentage: number;
}

export interface ProjectDetails {
  id: string;
  name: string;
  slug: string;
  description?: string;
  createdAt: string;
}

export interface DashboardStatsResponse {
  project: ProjectDetails;
  metrics: DashboardMetrics;
  agentExecutionBreakdown: Record<string, number>;
}

export interface AIExecutionItem {
  id: string;
  projectId: string;
  agentId: string;
  status: 'QUEUED' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  promptTokens: number;
  responseTokens: number;
  durationMs: number;
  createdAt: string;
  agent: {
    id: string;
    name: string;
    type: string;
  };
}

export interface TimelineItem {
  id: string;
  type: 'EXECUTION' | 'FILE' | 'MESSAGE';
  title: string;
  status: string;
  timestamp: string;
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';

export const dashboardService = {
  async getStats(projectId: string): Promise<DashboardStatsResponse> {
    const res = await fetch(`${BACKEND_URL}/api/v1/projects/${projectId}/dashboard/stats`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch stats: ${res.statusText}`);
    }
    const json = await res.json();
    return json.data;
  },

  async getRecentExecutions(projectId: string, limit: number = 10): Promise<AIExecutionItem[]> {
    const res = await fetch(
      `${BACKEND_URL}/api/v1/projects/${projectId}/dashboard/recent-executions?limit=${limit}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      }
    );
    if (!res.ok) {
      throw new Error(`Failed to fetch executions: ${res.statusText}`);
    }
    const json = await res.json();
    return json.data;
  },

  async getActivityTimeline(projectId: string): Promise<TimelineItem[]> {
    const res = await fetch(
      `${BACKEND_URL}/api/v1/projects/${projectId}/dashboard/activity-timeline`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      }
    );
    if (!res.ok) {
      throw new Error(`Failed to fetch activity: ${res.statusText}`);
    }
    const json = await res.json();
    return json.data;
  },
};