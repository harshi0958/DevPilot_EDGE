'use client';

import React from 'react';
import { Cpu } from 'lucide-react';

interface ExecutionChartProps {
  breakdown: Record<string, number>;
}

export const ExecutionChart: React.FC<ExecutionChartProps> = ({ breakdown }) => {
  const entries = Object.entries(breakdown);
  const total = entries.reduce((acc, [, val]) => acc + val, 0);

  const agentColors: Record<string, string> = {
    ARCHITECT: 'bg-indigo-500 text-indigo-400',
    DEVELOPER: 'bg-blue-500 text-blue-400',
    DEBUGGER: 'bg-rose-500 text-rose-400',
    TESTING: 'bg-amber-500 text-amber-400',
    UI_UX: 'bg-purple-500 text-purple-400',
    DOCUMENTATION: 'bg-emerald-500 text-emerald-400',
  };

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between pb-4 border-b border-border/40">
        <div className="flex items-center gap-2">
          <Cpu className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Agent Execution Distribution</h3>
        </div>
        <span className="text-xs text-muted-foreground font-mono">Total: {total} runs</span>
      </div>

      <div className="mt-4 space-y-4">
        {entries.length === 0 ? (
          <div className="py-6 text-center text-xs text-muted-foreground">
            No agent executions recorded yet.
          </div>
        ) : (
          entries.map(([agentType, count]) => {
            const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
            const colorClass = agentColors[agentType] || 'bg-zinc-500 text-zinc-400';
            const [bgBar] = colorClass.split(' ');

            return (
              <div key={agentType} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-foreground tracking-wide">{agentType}</span>
                  <span className="text-muted-foreground">
                    {count} runs ({percentage}%)
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-secondary/60">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${bgBar}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};