'use client';

import React from 'react';

interface AgentActivityChartProps {
  executionsByAgent: Record<string, number>;
}

export const AgentActivityChart: React.FC<AgentActivityChartProps> = ({ executionsByAgent }) => {
  const entries = Object.entries(executionsByAgent);
  const total = entries.reduce((acc, [, val]) => acc + val, 0) || 1;

  const agentColorMap: Record<string, { bar: string; text: string }> = {
    ARCHITECT: { bar: 'bg-indigo-500', text: 'text-indigo-400' },
    DEVELOPER: { bar: 'bg-cyan-500', text: 'text-cyan-400' },
    DEBUGGER: { bar: 'bg-rose-500', text: 'text-rose-400' },
    TESTING: { bar: 'bg-amber-500', text: 'text-amber-400' },
    UI_UX: { bar: 'bg-purple-500', text: 'text-purple-400' },
    DOCUMENTATION: { bar: 'bg-emerald-500', text: 'text-emerald-400' },
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div>
          <h3 className="text-base font-semibold text-foreground">AI Agent Allocation</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Execution distribution across specialized agents</p>
        </div>
        <span className="text-xs font-medium text-muted-foreground">{total} Total Runs</span>
      </div>

      <div className="mt-6 space-y-4">
        {entries.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">No execution history recorded yet.</p>
        ) : (
          entries.map(([agent, count]) => {
            const percentage = Math.round((count / total) * 100);
            const colors = agentColorMap[agent] || { bar: 'bg-slate-500', text: 'text-slate-400' };
            return (
              <div key={agent} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className={`font-semibold tracking-wide ${colors.text}`}>{agent}</span>
                  <span className="text-muted-foreground">
                    {count} runs ({percentage}%)
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${colors.bar}`}
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