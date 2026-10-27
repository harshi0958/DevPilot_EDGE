import express from 'express';
import cors from 'cors';
import studentRoutes from './routes/student.routes';
import dashboardRoutes from './routes/dashboard.routes';
import { prisma } from './lib/prisma';
import { DashboardService } from './services/dashboard.service';

const app = express();

app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(express.json());

// Mount student routes with project scoping
app.use('/api/projects/:projectId/students', studentRoutes);
// Backward-compatible global mount using default project resolution or query param
app.use('/api/students', (req, res, next) => {
  req.params.projectId = (req.query.projectId as string) || 'faa9cfc8-5db7-4be3-8e23-213634465f7b';
  studentRoutes(req, res, next);
});

// Dashboard routes
app.use('/api/projects/:projectId/dashboard', dashboardRoutes);

// Direct dashboard stats aggregation by project slug or id
app.get('/api/dashboard/stats/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const project = await prisma.project.findFirst({
      where: {
        OR: [{ slug }, { id: slug }],
      },
    });

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const summary = await DashboardService.getSummary(project.id);
    const recentExecutions = await DashboardService.getRecentExecutions(project.id, 5);

    return res.json({
      project: {
        id: project.id,
        name: project.name,
        slug: project.slug,
        description: project.description,
      },
      metrics: {
        members: summary.metrics.totalMembers,
        conversations: summary.metrics.totalConversations,
        executions: summary.metrics.totalExecutions,
        files: summary.metrics.totalFiles,
        successRate: summary.metrics.successRate,
      },
      recentExecutions,
      executionsByAgent: summary.executionsByAgent,
      storage: summary.storage,
    });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message || 'Failed to fetch dashboard stats' });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date() });
});

export default app;