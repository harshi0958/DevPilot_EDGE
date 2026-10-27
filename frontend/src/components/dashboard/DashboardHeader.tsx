'use client';

import React from 'react';
import { Play, Sparkles, RefreshCw } from 'lucide-react';

interface DashboardHeaderProps {
  projectName: string;
  description?: string;
  onRefresh?: () => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  projectName,
  description,
  onRefresh,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-border">
      <div>
        <div className="flex items-center gap-2.5">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{projectName}</h1>
          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 border border-primary/20 px-2.5 py-0.5 text-xs font-semibold text-primary">
            <Sparkles className="h-3 w-3" /> Autonomous AI Active
          </span>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          {description || 'Autonomous AI software engineering demo cockpit'}
        </p>
      </div>

      <div className="flex items-center gap-2.5">
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="inline-flex items-center justify-center rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-foreground hover:bg-secondary transition"
            title="Refresh metrics"
          >
            <RefreshCw className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
            Refresh
          </button>
        )}
        <button
          className="inline-flex items-center justify-center rounded-lg bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground shadow hover:bg-primary/90 transition"
        >
          <Play className="h-3.5 w-3.5 mr-1.5 fill-current" />
          Run AI Agent
        </button>
      </div>
    </div>
  );
};