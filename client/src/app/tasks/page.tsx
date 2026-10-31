'use client';

import React, { useEffect, useState } from 'react';
import { Task, Priority } from '../../types/task';
import { taskService } from '../../services/task.service';
import { TaskItem } from '../../components/tasks/TaskItem';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Plus, Search } from 'lucide-react';

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('ALL');
  const [filterCompleted, setFilterCompleted] = useState<string>('ALL');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('MEDIUM');
  const [dueDate, setDueDate] = useState('');

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await taskService.getTasks();
      setTasks(data);
    } catch (error) {
      console.error('Failed to load tasks', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingTask(null);
    setTitle('');
    setDescription('');
    setPriority('MEDIUM');
    setDueDate('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (task: Task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description || '');
    setPriority(task.priority);
    setDueDate(task.dueDate ? task.dueDate.split('T')[0] : '');
    setIsModalOpen(true);
  };

  const handleSaveTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      if (editingTask) {
        await taskService.updateTask(editingTask.id, {
          title,
          description,
          priority,
          dueDate: dueDate || null,
        });
      } else {
        await taskService.createTask({
          title,
          description,
          priority,
          dueDate: dueDate || undefined,
        });
      }
      setIsModalOpen(false);
      fetchTasks();
    } catch (error) {
      console.error('Failed to save task', error);
    }
  };

  const handleToggleTask = async (id: string, completed: boolean) => {
    try {
      await taskService.updateTask(id, { completed });
      setTasks(tasks.map((t) => (t.id === id ? { ...t, completed } : t)));
    } catch (error) {
      console.error('Failed to update task status', error);
    }
  };

  const handleDeleteTask = async (id: string) => {
    try {
      await taskService.deleteTask(id);
      setTasks(tasks.filter((t) => t.id !== id));
    } catch (error) {
      console.error('Failed to delete task', error);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesPriority = filterPriority === 'ALL' || task.priority === filterPriority;
    const matchesCompleted = filterCompleted === 'ALL' || 
      (filterCompleted === 'COMPLETED' && task.completed) || 
      (filterCompleted === 'PENDING' && !task.completed);

    return matchesSearch && matchesPriority && matchesCompleted;
  });

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">My Tasks</h1>
        <Button onClick={handleOpenCreateModal}>
          <Plus className="mr-2 h-4 w-4" /> Add Task
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <select
          className="px-3 py-2 rounded-md border bg-background text-sm"
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
        >
          <option value="ALL">All Priorities</option>
          <option value="LOW">Low</option>
          <option value="MEDIUM">Medium</option>
          <option value="HIGH">High</option>
        </select>
        <select
          className="px-3 py-2 rounded-md border bg-background text-sm"
          value={filterCompleted}
          onChange={(e) => setFilterCompleted(e.target.value)}
        >
          <option value="ALL">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="COMPLETED">Completed</option>
        </select>
      </div>

      {loading ? (
        <p className="text-center py-8 text-muted-foreground">Loading tasks...</p>
      ) : filteredTasks.length === 0 ? (
        <p className="text-center py-8 text-muted-foreground">No tasks found.</p>
      ) : (
        <div>
          {filteredTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={handleToggleTask}
              onEdit={handleOpenEditModal}
              onDelete={handleDeleteTask}
            />
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-card p-6 rounded-lg w-full max-w-md shadow-lg border">
            <h2 className="text-xl font-bold mb-4">
              {editingTask ? 'Edit Task' : 'Create Task'}
            </h2>
            <form onSubmit={handleSaveTask}>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Task title"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <textarea
                    className="w-full mt-1 px-3 py-2 rounded-md border bg-background text-sm resize-none h-20"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Task description (optional)"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Priority</label>
                  <select
                    className="w-full mt-1 px-3 py-2 rounded-md border bg-background text-sm"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as Priority)}
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Due Date</label>
                  <Input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingTask ? 'Save Changes' : 'Create Task'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}