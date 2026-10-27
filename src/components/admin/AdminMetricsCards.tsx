import { Users, FolderGit2, Cpu, FileCode2 } from 'lucide-react';
import { AdminMetrics } from '@/types/admin';

interface Props {
  metrics: AdminMetrics;
}

export default function AdminMetricsCards({ metrics }: Props) {
  const cards = [
    {
      title: 'Total Users',
      value: metrics.totalUsers,
      icon: Users,
      description: 'Registered platform users'
    },
    {
      title: 'Active Projects',
      value: metrics.totalProjects,
      icon: FolderGit2,
      description: 'Total active repositories'
    },
    {
      title: 'AI Executions',
      value: metrics.totalExecutions,
      icon: Cpu,
      description: 'Agent workflow actions run'
    },
    {
      title: 'Generated Files',
      value: metrics.totalFiles,
      icon: FileCode2,
      description: 'Managed code files'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="p-5 rounded-lg border border-slate-800 bg-slate-900/60 backdrop-blur text-slate-100 flex flex-col justify-between space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-400">{card.title}</span>
              <Icon className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <div className="text-3xl font-bold">{card.value}</div>
              <p className="text-xs text-slate-500 mt-1">{card.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}