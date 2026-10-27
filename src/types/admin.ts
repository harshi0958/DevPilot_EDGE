export interface AdminMetrics {
  totalUsers: number;
  totalProjects: number;
  totalExecutions: number;
  totalFiles: number;
}

export interface RecentExecution {
  id: string;
  status: string;
  createdAt: string;
  project?: {
    name: string;
  };
  agent?: {
    name: string;
    type: string;
  };
}

export interface AdminUser {
  id: string;
  name: string | null;
  email: string;
  role: string;
  createdAt: string;
  _count: {
    projects: number;
  };
}

export interface AdminProject {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  _count: {
    members: number;
    conversations: number;
    executions: number;
    files: number;
  };
}