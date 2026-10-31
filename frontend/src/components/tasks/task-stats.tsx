import { Task } from '@/types/task';
import { CheckCircle2, Clock, AlertCircle, ListTodo } from 'lucide-react';

interface TaskStatsProps {
  tasks: Task[];
}

export function TaskStats({ tasks }: TaskStatsProps) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === 'COMPLETED').length;
  const inProgress = tasks.filter((t) => t.status === 'IN_PROGRESS').length;
  const urgentOrHigh = tasks.filter((t) => (t.priority === 'URGENT' || t.priority === 'HIGH') && t.status !== 'COMPLETED').length;

  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-xl border bg-card p-4 text-card-foreground shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">Total Tasks</span>
          <ListTodo className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <div className="text-2xl font-bold">{total}</div>
          <span className="text-xs text-muted-foreground">{completionRate}% completed</span>
        </div>
        <div className="mt-3 h-1.5 w-full rounded-full bg-secondary">
          <div className="h-1.5 rounded-full bg-primary transition-all duration-500" style={{ width: `${completionRate}%` }} />
        </div>
      </div>

      <div className="rounded-xl border bg-card p-4 text-card-foreground shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">Completed</span>
          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
        </div>
        <div className="mt-2 flex items-baseline">
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{completed}</div>
        </div>
      </div>

      <div className="rounded-xl border bg-card p-4 text-card-foreground shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">In Progress</span>
          <Clock className="h-4 w-4 text-blue-500" />
        </div>
        <div className="mt-2 flex items-baseline">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{inProgress}</div>
        </div>
      </div>

      <div className="rounded-xl border bg-card p-4 text-card-foreground shadow-sm">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">High Priority Active</span>
          <AlertCircle className="h-4 w-4 text-amber-500" />
        </div>
        <div className="mt-2 flex items-baseline">
          <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">{urgentOrHigh}</div>
        </div>
      </div>
    </div>
  );
}