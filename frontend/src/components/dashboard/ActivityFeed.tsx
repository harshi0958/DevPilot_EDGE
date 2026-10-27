'use client';

import React from 'react';
import { ActivityItem } from '@/types/dashboard.types';
import { Activity, Terminal, FileEdit } from 'lucide-react';

interface ActivityFeedProps {
  activities: ActivityItem[];
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities }) => {
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div>
          <h3 className="text-base font-semibold text-foreground">Activity Timeline</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Real-time platform and agent event logs</p>
        </div>
        <Activity className="h-4 w-4 text-muted-foreground" />
      </div>

      <div className="mt-4 space-y-4">
        {activities.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-6">No recent activity.</p>
        ) : (
          activities.map((item) => {
            const isExecution = item.type === 'EXECUTION';
            const Icon = isExecution ? Terminal : FileEdit;
            return (
              <div key={item.id} className="flex items-start gap-3">
                <div className="mt-0.5 rounded-md bg-secondary/80 p-1.5 text-foreground">
                  <Icon className="h-3.5 w-3.5" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-baseline">
                    <p className="text-xs font-semibold text-foreground">{item.title}</p>
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{item.description}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};