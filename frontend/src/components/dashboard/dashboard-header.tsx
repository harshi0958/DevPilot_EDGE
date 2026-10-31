'use client';

import React from 'react';
import { ProjectDetails } from '@/services/dashboard.service';
import { Terminal, RefreshCw, Cpu } from 'lucide-react';

interface DashboardHeaderProps {
  project: ProjectDetails;
  onRefresh: () => void;
  isRefreshing: boolean;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  project,
  onRefresh,
  isRefreshing,
}) => {
  return (
    <div className="flex flex-col gap-4 border-b border-border/40 pb-5 md:flex-row md:items-center md:justify-between">
      <div>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Cpu className="h-5 w-5" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{project.name}</h1>
          <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
            Active
          </span>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          {project.description || 'Autonomous AI software engineering demo environment'}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-md border border-border bg-card/50 px-3 py-1.5 text-xs text-muted-foreground font-mono">
          <Terminal className="h-3.5 w-3.5 text-primary" />
          <span>ID: {project.id.slice(0, 8)}...</span>
        </div>
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted focus:outline-none disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>
    </div>
  );
};