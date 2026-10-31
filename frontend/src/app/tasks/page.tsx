'use client'

import { useState, useEffect, useCallback } from 'react';
import { Task, TaskStatus, Priority, TaskFiltersState, CreateTaskDTO } from '@/types/task';
import { taskApi } from '@/services/task.api';
import { TaskStats } from '@/components/tasks/task-stats';
import { TaskItem } from '@/components/tasks/task-item';
import { TaskFormDialog } from '@/components/tasks/task-form-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<TaskFiltersState>({});
  const [searchQuery, setSearchQuery] = useState('');
  
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      const data = await taskApi.list(filters);
      setTasks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSearchQuery(val);
    setFilters((prev) => ({ ...prev, search: val || undefined }));
  };

  const handleStatusTab = (status?: TaskStatus) => {
    setFilters((prev) => ({ ...prev, status }));
  };

  const handlePriorityFilter = (priority?: string) => {
    setFilters((prev) => ({ ...prev, priority: priority === 'ALL' ? undefined : (priority as Priority) }));
  };

  const handleStatusChange = async (id: string, status: TaskStatus) => {
    try {
      const updated = await taskApi.updateStatus(id, status);
      setTasks((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    try {
      await taskApi.delete(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleFormSubmit = async (data: CreateTaskDTO) => {
    if (selectedTask) {
      const updated = await taskApi.update(selectedTask.id, data);
      setTasks((prev) => prev.map((t) => (t.id === selectedTask.id ? updated : t)));
    } else {
      const created = await taskApi.create(data);
      setTasks((prev) => [created, ...prev]);
    }
    setSelectedTask(null);
  };

  const openCreateDialog = () => {
    setSelectedTask(null);
    setDialogOpen(true);
  };

  const openEditDialog = (task: Task) => {
    setSelectedTask(task);
    setDialogOpen(true);
  };

  return (
    <div className="container mx-auto py-8 space-y-8 max-w-5xl">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">To-Do Tasks</h1>
          <p className="text-muted-foreground">Manage your workflow, track priorities, and accomplish goals.</p>
        </div>
        <Button onClick={openCreateDialog} className="gap-2">
          <Plus className="h-4 w-4" /> New Task
        </Button>
      </div>

      <TaskStats tasks={tasks} />

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
          <Button
            variant={!filters.status ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleStatusTab(undefined)}
          >
            All
          </Button>
          <Button
            variant={filters.status === 'PENDING' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleStatusTab('PENDING')}
          >
            Pending
          </Button>
          <Button
            variant={filters.status === 'IN_PROGRESS' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleStatusTab('IN_PROGRESS')}
          >
            In Progress
          </Button>
          <Button
            variant={filters.status === 'COMPLETED' ? 'default' : 'outline'}
            size="sm"
            onClick={() => handleStatusTab('COMPLETED')}
          >
            Completed
          </Button>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-9"
            />
          </div>

          <Select value={filters.priority || 'ALL'} onValueChange={handlePriorityFilter}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Priorities</SelectItem>
              <SelectItem value="URGENT">Urgent</SelectItem>
              <SelectItem value="HIGH">High</SelectItem>
              <SelectItem value="MEDIUM">Medium</SelectItem>
              <SelectItem value="LOW">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-16 border rounded-xl bg-card">
          <h3 className="text-lg font-semibold">No tasks found</h3>
          <p className="text-sm text-muted-foreground mt-1">Get started by creating a new task.</p>
          <Button onClick={openCreateDialog} variant="outline" className="mt-4 gap-2">
            <Plus className="h-4 w-4" /> Create Task
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onStatusChange={handleStatusChange}
              onEdit={openEditDialog}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <TaskFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        task={selectedTask}
        onSubmit={handleFormSubmit}
      />
    </div>
  );
}