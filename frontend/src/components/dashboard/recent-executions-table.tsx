'use client';

import React from 'react';
import { AIExecutionItem } from '@/services/dashboard.service';
import { Activity, Clock, Cpu } from 'lucide-react';

interface RecentExecutionsTableProps {
  executions: AIExecutionItem[];
}

export const RecentExecutionsTable: React.FC<RecentExecutionsTableProps> = ({ executions }) => {
  const getStatusBadge = (status: AIExecutionItem['status']) => {
    switch (status) {
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-400 border border-emerald-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            COMPLETED
          </span>
        );
      case 'RUNNING':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-sky-500/10 px-2 py-0.5 text-xs font-medium text-sky-400 border border-sky-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-sky-400 animate-pulse" />
            RUNNING
          </span>
        );
      case 'FAILED':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 px-2 py-0.5 text-xs font-medium text-rose-400 border border-rose-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
            FAILED
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-zinc-500/10 px-2 py-0.5 text-xs font-medium text-zinc-400 border border-zinc-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-zinc-400" />
            QUEUED
          </span>
        );
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
      <div className="flex items-center justify-between border-b border-border/40 p-4">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Recent AI Executions</h3>
        </div>
        <span className="text-xs text-muted-foreground">Latest agent events</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-muted/40 text-muted-foreground border-b border-border/40">
            <tr>
              <th className="py-2.5 px-4 font-medium">Agent</th>
              <th className="py-2.5 px-4 font-medium">Status</th>
              <th className="py-2.5 px-4 font-medium">Tokens (P/R)</th>
              <th className="py-2.5 px-4 font-medium">Duration</th>
              <th className="py-2.5 px-4 font-medium">Executed At</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40 font-mono">
            {executions.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-6 text-center text-muted-foreground">
                  No recent executions found.
                </td>
              </tr>
            ) : (
              executions.map((item) => (
                <tr key={item.id} className="hover:bg-muted/20 transition-colors">
                  <td className="py-3 px-4 font-sans font-medium text-foreground flex items-center gap-2">
                    <Cpu className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{item.agent?.name || item.agent?.type || 'AI Agent'}</span>
                  </td>
                  <td className="py-3 px-4 font-sans">{getStatusBadge(item.status)}</td>
                  <td className="py-3 px-4 text-muted-foreground">
                    {item.promptTokens} / {item.responseTokens}
                  </td>
                  <td className="py-3 px-4 text-muted-foreground flex items-center gap-1 mt-1.5">
                    <Clock className="h-3 w-3 inline-block" />
                    <span>{item.durationMs}ms</span>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground font-sans">
                    {new Date(item.createdAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};