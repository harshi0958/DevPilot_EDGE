import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dashboardRoutes from './routes/dashboard.routes';
import studentRoutes from './routes/student.routes';
import taskRoutes from './routes/task.routes';
import downloadRoutes from './routes/download.routes';
import demoRoutes from './routes/demo.routes';

const app = express();

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// API Routes standardized under /api/v1
app.use('/api/v1/projects/:projectId/dashboard', dashboardRoutes);
app.use('/api/v1/projects/:projectId/students', studentRoutes);
app.use('/api/v1/projects/:projectId/tasks', taskRoutes);
app.use('/api/v1/projects/:projectId/download', downloadRoutes);
app.use('/api/v1/demo', demoRoutes);

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

export default app;