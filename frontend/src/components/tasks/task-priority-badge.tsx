import { Priority } from '@/types/task';
import { Badge } from '@/components/ui/badge';

interface TaskPriorityBadgeProps {
  priority: Priority;
}

export function TaskPriorityBadge({ priority }: TaskPriorityBadgeProps) {
  const variants: Record<Priority, { label: string; className: string }> = {
    URGENT: { label: 'Urgent', className: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-950 dark:text-red-300' },
    HIGH: { label: 'High', className: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950 dark:text-amber-300' },
    MEDIUM: { label: 'Medium', className: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950 dark:text-blue-300' },
    LOW: { label: 'Low', className: 'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-300' },
  };

  const config = variants[priority] || variants.MEDIUM;

  return (
    <Badge variant="outline" className={`font-medium ${config.className}`}>
      {config.label}
    </Badge>
  );
}