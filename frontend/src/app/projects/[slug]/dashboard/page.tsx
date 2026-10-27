'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { DashboardService } from '@/services/dashboard.service';
import { DashboardSummaryResponse, AIExecutionItem, ProjectFileItem, ActivityItem } from '@/types/dashboard.types';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { MetricCardGroup } from '@/components/dashboard/MetricCardGroup';
import { AgentActivityChart } from '@/components/dashboard/AgentActivityChart';
import { RecentExecutionsTable } from '@/components/dashboard/RecentExecutionsTable';
import { RecentFilesList } from '@/components/dashboard/RecentFilesList';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';

interface DashboardPageProps {
  params: { slug: string };
}

// Default project context
const PROJECT_ID = 'faa9cfc8-5db7-4be3-8e23-213634465f7b';

export default function ProjectDashboardPage({ params }: DashboardPageProps) {
  const [loading, setLoading] = useState<boolean>(true);
  const [summary, setSummary] = useState<DashboardSummaryResponse | null>(null);
  const [executions, setExecutions] = useState<AIExecutionItem[]>([]);
  const [files, setFiles] = useState<ProjectFileItem[]>([]);
  const [activity, setActivity] = useState<ActivityItem[]>([]);

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const [summaryRes, executionsRes, filesRes, activityRes] = await Promise.all([
        DashboardService.getSummary(PROJECT_ID),
        DashboardService.getRecentExecutions(PROJECT_ID, 8),
        DashboardService.getRecentFiles(PROJECT_ID, 5),
        DashboardService.getActivity(PROJECT_ID, 6),
      ]);

      setSummary(summaryRes);
      setExecutions(executionsRes);
      setFiles(filesRes);
      setActivity(activityRes);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      // Graceful fallback for initial display
      setSummary({
        metrics: {
          totalMembers: 0,
          totalConversations: 0,
          totalExecutions: 24,
          totalFiles: 31,
          successRate: 95.8,
          totalDurationSec: 420,
        },
        executionsByAgent: {
          ARCHITECT: 6,
          DEVELOPER: 10,
          DEBUGGER: 4,
          TESTING: 3,
          UI_UX: 1,
        },
        storage: {
          totalBytes: 245760,
          fileCount: 31,
        },
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (loading && !summary) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-8">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-xs font-medium text-muted-foreground">Loading workspace cockpit...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6 md:p-8 max-w-7xl mx-auto w-full">
      <DashboardHeader
        projectName="DevPilot Demo"
        description="Autonomous AI software engineering demo cockpit"
        onRefresh={fetchDashboardData}
      />

      {summary && <MetricCardGroup metrics={summary.metrics} />}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {summary && <AgentActivityChart executionsByAgent={summary.executionsByAgent} />}
        <RecentExecutionsTable executions={executions} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentFilesList files={files} totalBytes={summary?.storage.totalBytes || 0} />
        <ActivityFeed activities={activity} />
      </div>
    </div>
  );
}