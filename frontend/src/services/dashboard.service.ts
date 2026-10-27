import { DashboardSummaryResponse, AIExecutionItem, ProjectFileItem, ActivityItem } from '@/types/dashboard.types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export class DashboardService {
  public static async getSummary(projectId: string): Promise<DashboardSummaryResponse> {
    const response = await fetch(`${API_BASE}/projects/${projectId}/dashboard/summary`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      cache: 'no-store',
    });
    if (!response.ok) {
      throw new Error(`Failed to load dashboard summary: ${response.statusText}`);
    }
    const result = await response.json();
    return result.data;
  }

  public static async getRecentExecutions(projectId: string, limit: number = 8): Promise<AIExecutionItem[]> {
    const response = await fetch(`${API_BASE}/projects/${projectId}/dashboard/executions?limit=${limit}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      cache: 'no-store',
    });
    if (!response.ok) {
      throw new Error(`Failed to load executions: ${response.statusText}`);
    }
    const result = await response.json();
    return result.data;
  }

  public static async getRecentFiles(projectId: string, limit: number = 6): Promise<ProjectFileItem[]> {
    const response = await fetch(`${API_BASE}/projects/${projectId}/dashboard/files?limit=${limit}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      cache: 'no-store',
    });
    if (!response.ok) {
      throw new Error(`Failed to load files: ${response.statusText}`);
    }
    const result = await response.json();
    return result.data;
  }

  public static async getActivity(projectId: string, limit: number = 8): Promise<ActivityItem[]> {
    const response = await fetch(`${API_BASE}/projects/${projectId}/dashboard/activity?limit=${limit}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      cache: 'no-store',
    });
    if (!response.ok) {
      throw new Error(`Failed to load activities: ${response.statusText}`);
    }
    const result = await response.json();
    return result.data;
  }
}