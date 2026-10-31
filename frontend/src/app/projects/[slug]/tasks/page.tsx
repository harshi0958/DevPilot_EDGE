import React from 'react';
import { TaskBoard } from '@/components/tasks/TaskBoard';

interface PageProps {
  params: {
    slug: string;
  };
}

export default function ProjectTasksPage({ params }: PageProps) {
  // In the DevPilot platform, the slug is resolved to the project or uses projectId directly
  const projectId = 'faa9cfc8-5db7-4be3-8e23-213634465f7b';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Project Tasks
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage sprint items, assignments, and track development workflow for {params.slug}.
          </p>
        </div>

        <TaskBoard projectId={projectId} />
      </div>
    </div>
  );
}