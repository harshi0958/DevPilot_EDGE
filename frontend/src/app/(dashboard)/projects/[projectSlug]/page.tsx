'use client';

import React, { useEffect, useState, useCallback } from 'react';
import {
  dashboardService,
  DashboardStatsResponse,
  AIExecutionItem,
} from '@/services/dashboard.service';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { ExecutionChart } from '@/components/dashboard/execution-chart';
import { RecentExecutionsTable } from '@/components/dashboard/recent-executions-table';
import { FileStatusOverview } from '@/components/dashboard/file-status-overview';
import { AlertCircle } from 'lucide-react';

interface DashboardPageProps {
  params: {
    projectSlug: string;
  };
}

export default function ProjectDashboardPage({ params }: DashboardPageProps) {
  const [statsData, setStatsData] = useState<DashboardStatsResponse | null>(null);
  const [executions, setExecutions] = useState<AIExecutionItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const projectId = 'faa9cfc8-5db7-4be3-8e23-213634465f7b';

  const loadDashboardData = useCallback(async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) setRefreshing(true);
      else setLoading(true);
      setError(null);

      const [statsRes, execsRes] = await Promise.all([
        dashboardService.getStats(projectId),
        dashboardService.getRecentExecutions(projectId, 10),
      ]);

      setStatsData(statsRes);
      setExecutions(execsRes);
    } catch (err: any) {
      console.error('Failed to load dashboard:', err);
      setError(err.message || 'Failed to fetch dashboard data');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [projectId]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  if (loading) {
    return (
      <div className="space-y-6 p-6 animate-pulse">
        <div className="h-14 rounded-lg bg-muted/60" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 rounded-xl bg-muted/60" />
          ))}
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="h-64 rounded-xl bg-muted/60 lg:col-span-2" />
          <div className="h-64 rounded-xl bg-muted/60" />
        </div>
      </div>
    );
  }

  if (error || !statsData) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-500/10 text-rose-400 mb-4">
          <AlertCircle className="h-6 w-6" />
        </div>
        <h2 className="text-lg font-semibold text-foreground">Unable to load dashboard</h2>
        <p className="mt-1 text-sm text-muted-foreground max-w-sm mb-4">
          {error || 'An unexpected error occurred while contacting the server.'}
        </p>
        <button
          onClick={() => loadDashboardData(true)}
          className="rounded-md bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Retry Request
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <DashboardHeader
        project={statsData.project}
        onRefresh={() => loadDashboardData(true)}
        isRefreshing={refreshing}
      />

      <StatsCards metrics={statsData.metrics} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <RecentExecutionsTable executions={executions} />
        </div>
        <div className="space-y-6">
          <ExecutionChart breakdown={statsData.agentExecutionBreakdown} />
          <FileStatusOverview fileCount={statsData.metrics.totalFiles} />
        </div>
      </div>
    </div>
  );
}