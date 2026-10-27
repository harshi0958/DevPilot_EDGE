'use client';

import React from 'react';
import { AIExecutionItem } from '@/types/dashboard.types';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';

interface RecentExecutionsTableProps {
  executions: AIExecutionItem[];
}

export const RecentExecutionsTable: React.FC<RecentExecutionsTableProps> = ({ executions }) => {
  const renderStatus = (status: AIExecutionItem['status']) => {
    switch (status) {
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-medium text-emerald-500">
            <CheckCircle2 className="h-3 w-3" /> Success
          </span>
        );
      case 'FAILED':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 px-2 py-0.5 text-xs font-medium text-rose-500">
            <AlertCircle className="h-3 w-3" /> Failed
          </span>
        );
      case 'IN_PROGRESS':
      case 'PENDING':
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-500">
            <Clock className="h-3 w-3 animate-spin" /> Running
          </span>
        );
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div>
          <h3 className="text-base font-semibold text-foreground">Recent AI Executions</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Live telemetry and generation statuses</p>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-border/60 text-muted-foreground">
              <th className="pb-2 font-medium">Agent</th>
              <th className="pb-2 font-medium">Status</th>
              <th className="pb-2 font-medium">Tokens</th>
              <th className="pb-2 font-medium">Duration</th>
              <th className="pb-2 font-medium text-right">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {executions.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-6 text-center text-muted-foreground">
                  No executions found.
                </td>
              </tr>
            ) : (
              executions.map((exec) => (
                <tr key={exec.id} className="hover:bg-muted/40 transition-colors">
                  <td className="py-3 font-medium text-foreground">{exec.agentType}</td>
                  <td className="py-3">{renderStatus(exec.status)}</td>
                  <td className="py-3 text-muted-foreground">
                    {exec.promptTokens && exec.completionTokens ? exec.promptTokens + exec.completionTokens : '--'}
                  </td>
                  <td className="py-3 text-muted-foreground">
                    {exec.durationMs ? `${(exec.durationMs / 1000).toFixed(2)}s` : '--'}
                  </td>
                  <td className="py-3 text-right text-muted-foreground">
                    {new Date(exec.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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