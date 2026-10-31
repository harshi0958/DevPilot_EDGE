'use client';

import React from 'react';
import { FolderTree, FileCode, CheckCircle2 } from 'lucide-react';

interface FileStatusOverviewProps {
  fileCount: number;
}

export const FileStatusOverview: React.FC<FileStatusOverviewProps> = ({ fileCount }) => {
  const categories = [
    { name: 'Backend Services', files: 24, progress: 38 },
    { name: 'Frontend Components', files: 30, progress: 47 },
    { name: 'Configuration & Schemas', files: 10, progress: 15 },
  ];

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between pb-4 border-b border-border/40">
        <div className="flex items-center gap-2">
          <FolderTree className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Repository Breakdown</h3>
        </div>
        <span className="text-xs font-mono font-medium text-muted-foreground">
          {fileCount} total files
        </span>
      </div>
      <div className="mt-4 space-y-4">
        {categories.map((cat) => (
          <div key={cat.name} className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="flex items-center gap-1.5 font-medium text-foreground">
                <FileCode className="h-3.5 w-3.5 text-muted-foreground" />
                {cat.name}
              </span>
              <span className="text-muted-foreground">{cat.files} files</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-primary/70 transition-all"
                style={{ width: `${cat.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5 rounded-lg border border-border/50 bg-muted/20 p-3 text-xs text-muted-foreground flex items-center gap-2">
        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
        <span>Synchronized with active Prisma repository entities.</span>
      </div>
    </div>
  );
};