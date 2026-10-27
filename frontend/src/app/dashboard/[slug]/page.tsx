import React from 'react';
import { Cpu, Files, MessageSquare, Activity } from 'lucide-react';
import { StatCard } from '@/components/dashboard/stat-card';
import { RecentExecutions } from '@/components/dashboard/recent-executions';
import { DashboardData } from '@/types/dashboard';

async function getDashboardData(slug: string): Promise<DashboardData | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const res = await fetch(`${baseUrl}/api/dashboard/stats/${slug}`, {
      cache: 'no-store',
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    return null;
  }
}

export default async function DashboardPage({ params }: { params: { slug: string } }) {
  const data = await getDashboardData(params.slug);

  const stats = data?.metrics ?? {
    members: 0,
    conversations: 0,
    executions: 0,
    files: 0,
    successRate: 100,
  };

  const projectName = data?.project?.name ?? 'DevPilot Demo';
  const projectDesc = data?.project?.description ?? 'Autonomous AI software engineering demo';

  return (
    <div className="min-h-screen bg-background p-6 lg:p-8 space-y-8">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{projectName}</h1>
          <p className="text-sm text-muted-foreground mt-1">{projectDesc}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-500 ring-1 ring-inset ring-emerald-500/20">
            Operational
          </span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="AI Executions"
          value={stats.executions}
          description="Total automated operations"
          icon={Cpu}
        />
        <StatCard
          title="Project Files"
          value={stats.files}
          description="Tracked repository files"
          icon={Files}
        />
        <StatCard
          title="Conversations"
          value={stats.conversations}
          description="Collaborative chat sessions"
          icon={MessageSquare}
        />
        <StatCard
          title="Success Rate"
          value={`${stats.successRate}%`}
          description="Agent task execution rate"
          icon={Activity}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentExecutions executions={data?.recentExecutions || []} />
        </div>
        <div className="space-y-6">
          <div className="rounded-xl border border-border/60 bg-card/60 p-6 shadow-sm">
            <h3 className="text-base font-semibold">Agents Overview</h3>
            <p className="text-sm text-muted-foreground mt-1 mb-4">
              Active agent instances working on this project.
            </p>
            <div className="space-y-3">
              {['Architect Agent', 'Developer Agent', 'UI/UX Agent', 'Debugger Agent', 'Testing Agent'].map((agent) => (
                <div key={agent} className="flex items-center justify-between text-sm py-1 border-b border-border/40 last:border-0">
                  <span>{agent}</span>
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}