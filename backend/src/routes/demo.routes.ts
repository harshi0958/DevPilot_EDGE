import { Router, Request, Response } from 'express';

const router = Router();

router.get('/hello', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Hello World from DevPilot Demo Backend!',
    timestamp: new Date().toISOString(),
  });
});

export default router;