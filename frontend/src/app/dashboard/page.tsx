'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, MessageSquare, Cpu, FolderCode, ArrowUpRight, Activity, Clock } from 'lucide-react';

interface ProjectStats {
  membersCount: number;
  conversationsCount: number;
  executionsCount: number;
  filesCount: number;
}

interface RecentExecution {
  id: string;
  agentType: string;
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED';
  createdAt: string;
  promptSnippet: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<ProjectStats>({
    membersCount: 0,
    conversationsCount: 0,
    executionsCount: 32,
    filesCount: 50,
  });
  const [recentExecutions, setRecentExecutions] = useState<RecentExecution[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/projects/faa9cfc8-5db7-4be3-8e23-213634465f7b/dashboard', {
          credentials: 'include',
        });
        if (res.ok) {
          const data = await res.json();
          setStats(data.stats);
          setRecentExecutions(data.recentExecutions);
        }
      } catch (error) {
        console.error('Failed to load dashboard data', error);
      } finally {
        setLoading(false);
      };
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="flex flex-col gap-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">DevPilot Demo</h1>
          <p className="text-muted-foreground">
            Autonomous AI software engineering demo dashboard.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">Refresh</Button>
          <Button className="bg-primary text-primary-foreground">New Agent Task</Button>
        </div>
      </div>

      {/* Top Stat Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Project Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.membersCount}</div>
            <p className="text-xs text-muted-foreground">Collaborators active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Conversations</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.conversationsCount}</div>
            <p className="text-xs text-muted-foreground">Active AI threads</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">AI Executions</CardTitle>
            <Cpu className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.executionsCount}</div>
            <p className="text-xs text-muted-foreground">Agent generation runs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Project Files</CardTitle>
            <FolderCode className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.filesCount}</div>
            <p className="text-xs text-muted-foreground">Tracked code files</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Area */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent AI Executions</CardTitle>
                <CardDescription>Latest agent actions executed on this project</CardDescription>
              </div>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentExecutions.length === 0 ? (
                <div className="text-sm text-muted-foreground py-6 text-center">
                  No recent executions recorded.
                </div>
              ) : (
                recentExecutions.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{item.agentType}</span>
                        <Badge
                          variant={
                            item.status === 'COMPLETED'
                              ? 'default'
                              : item.status === 'FAILED'
                              ? 'destructive'
                              : 'secondary'
                          }
                        >
                          {item.status.toLowerCase()}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {item.promptSnippet}
                      </p>
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Available Agents</CardTitle>
            <CardDescription>Specialized DevPilot agent fleet</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: 'Architect Agent', role: 'System design & architecture' },
                { name: 'Developer Agent', role: 'Full-stack feature implementation' },
                { name: 'UI/UX Agent', role: 'Component design & layout styling' },
                { name: 'Debugger Agent', role: 'Issue triage & bug fixing' },
                { name: 'Testing Agent', role: 'Test suite generation & verification' },
                { name: 'Documentation Agent', role: 'API specifications & guides' },
              ].map((agent) => (
                <div
                  key={agent.name}
                  className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50 transition-colors"
                >
                  <div>
                    <div className="font-medium text-sm">{agent.name}</div>
                    <div className="text-xs text-muted-foreground">{agent.role}</div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}