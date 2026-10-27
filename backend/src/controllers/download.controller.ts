import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import path from 'path';
import fs from 'fs';

export const downloadProjectZip = async (req: Request, res: Response): Promise<void> => {
  try {
    const { projectId } = req.params;
    
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { files: true },
    });

    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    // For a real implementation, you could dynamically bundle files into a ZIP using 'archiver'
    // Here we return project metadata and file list as a downloadable JSON backup
    res.setHeader('Content-Disposition', `attachment; filename=${project.slug}-backup.json`);
    res.setHeader('Content-Type', 'application/json');
    
    res.status(200).send(JSON.stringify(project, null, 2));
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ error: 'Failed to generate download' });
  }
};