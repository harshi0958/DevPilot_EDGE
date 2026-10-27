'use client';

import React from 'react';
import { DashboardMetrics } from '@/types/dashboard.types';
import { Cpu, FileCode2, Users2, MessageSquareCode } from 'lucide-react';

interface MetricCardGroupProps {
  metrics: DashboardMetrics;
}

export const MetricCardGroup: React.FC<MetricCardGroupProps> = ({ metrics }) => {
  const cards = [
    {
      title: 'AI Executions',
      value: metrics.totalExecutions.toString(),
      badge: `${metrics.successRate}% Success`,
      subtext: `${metrics.totalDurationSec}s total duration`,
      icon: Cpu,
      badgeColor: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20',
    },
    {
      title: 'Workspace Files',
      value: metrics.totalFiles.toString(),
      badge: 'Active Tree',
      subtext: 'Synchronized with Git/DB',
      icon: FileCode2,
      badgeColor: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    },
    {
      title: 'AI Conversations',
      value: metrics.totalConversations.toString(),
      badge: 'Interactive Sessions',
      subtext: 'Team prompt sessions',
      icon: MessageSquareCode,
      badgeColor: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    },
    {
      title: 'Project Members',
      value: metrics.totalMembers.toString(),
      badge: 'Collaborators',
      subtext: 'Assigned engineering roles',
      icon: Users2,
      badgeColor: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="relative overflow-hidden rounded-xl border border-border bg-card p-5 shadow-sm transition hover:shadow-md"
          >
            <div className="flex items-center justify-between pb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {card.title}
              </span>
              <div className="rounded-lg bg-secondary/80 p-2 text-foreground">
                <Icon className="h-4 w-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <div className="text-3xl font-bold tracking-tight text-foreground">{card.value}</div>
              <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${card.badgeColor}`}>
                {card.badge}
              </span>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">{card.subtext}</p>
          </div>
        );
      })}
    </div>
  );
};