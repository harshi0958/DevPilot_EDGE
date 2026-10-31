import { Task, TaskStatus } from '@/types/task';
import { TaskPriorityBadge } from './task-priority-badge';
import { Button } from '@/components/ui/button';
import { Calendar, MoreVertical, CheckCircle2, Clock, AlertCircle, Trash2, Edit } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

interface TaskItemProps {
  task: Task;
  onStatusChange: (id: string, status: TaskStatus) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export function TaskItem({ task, onStatusChange, onEdit, onDelete }: TaskItemProps) {
  const isCompleted = task.status === 'COMPLETED';
  const isInProgress = task.status === 'IN_PROGRESS';

  const formattedDueDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    : null;

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !isCompleted;

  return (
    <div className={`group relative flex items-start gap-4 rounded-xl border bg-card p-4 shadow-sm transition-all hover:shadow-md ${isCompleted ? 'opacity-75 bg-muted/30' : ''}`}>
      <button
        type="button"
        onClick={() => onStatusChange(task.id, isCompleted ? 'PENDING' : 'COMPLETED')}
        className={`mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors ${isCompleted ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-muted-foreground hover:border-primary'}`}
      >
        {isCompleted && <CheckCircle2 className="h-3.5 w-3.5" />}
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className={`font-semibold tracking-tight ${isCompleted ? 'line-through text-muted-foreground' : ''}`}>
            {task.title}
          </h3>
          <TaskPriorityBadge priority={task.priority} />
          {task.project && (
            <span className="inline-flex items-center rounded-md bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
              {task.project.name}
            </span>
          )}
        </div>

        {task.description && (
          <p className={`mt-1 text-sm text-muted-foreground line-clamp-2 ${isCompleted ? 'line-through' : ''}`}>
            {task.description}
          </p>
        )}

        <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
          {formattedDueDate && (
            <div className={`flex items-center gap-1 ${isOverdue ? 'text-red-500 font-medium' : ''}`}>
              <Calendar className="h-3.5 w-3.5" />
              <span>{formattedDueDate}</span>
              {isOverdue && <span>(Overdue)</span>}
            </div>
          )}

          <div className="flex items-center gap-1">
            {task.status === 'COMPLETED' && <span className="text-emerald-600 flex items-center gap-1"><CheckCircle2 className="h-3 w-3"/> Completed</span>}
            {task.status === 'IN_PROGRESS' && <span className="text-blue-600 flex items-center gap-1"><Clock className="h-3 w-3"/> In Progress</span>}
            {task.status === 'PENDING' && <span className="flex items-center gap-1"><AlertCircle className="h-3 w-3"/> Pending</span>}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(task)} className="gap-2">
              <Edit className="h-4 w-4" /> Edit Task
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onStatusChange(task.id, 'IN_PROGRESS')} className="gap-2">
              <Clock className="h-4 w-4" /> Set In Progress
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(task.id)} className="gap-2 text-red-600">
              <Trash2 className="h-4 w-4" /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}