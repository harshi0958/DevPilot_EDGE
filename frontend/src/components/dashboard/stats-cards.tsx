'use client';

import React from 'react';
import { DashboardMetrics } from '@/services/dashboard.service';
import { Users, Bot, Files, MessagesSquare, Zap, CheckCircle2 } from 'lucide-react';

interface StatsCardsProps {
  metrics: DashboardMetrics;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ metrics }) => {
  const cards = [
    {
      title: 'AI Executions',
      value: metrics.totalExecutions,
      description: `${metrics.successRatePercentage}% success rate`,
      icon: Bot,
      accent: 'text-sky-500',
      bg: 'bg-sky-500/10',
    },
    {
      title: 'Project Files',
      value: metrics.totalFiles,
      description: 'Tracked repository files',
      icon: Files,
      accent: 'text-amber-500',
      bg: 'bg-amber-500/10',
    },
    {
      title: 'Tokens Consumed',
      value: metrics.totalTokensConsumed.toLocaleString(),
      description: `Avg ${metrics.avgDurationMs}ms execution time`,
      icon: Zap,
      accent: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
    },
    {
      title: 'Active Discussions',
      value: metrics.totalConversations,
      description: `${metrics.totalMembers} team members`,
      icon: MessagesSquare,
      accent: 'text-violet-500',
      bg: 'bg-violet-500/10',
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, idx) => {
        const IconComponent = card.icon;
        return (
          <div
            key={idx}
            className="relative overflow-hidden rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:border-border/80 hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {card.title}
              </span>
              <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${card.bg}`}>
                <IconComponent className={`h-4 w-4 ${card.accent}`} />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-2xl font-bold tracking-tight text-foreground">{card.value}</div>
              <p className="mt-1 text-xs text-muted-foreground flex items-center gap-1.5">
                <CheckCircle2 className="h-3 w-3 text-emerald-500 inline-block" />
                {card.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};