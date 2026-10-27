'use client';

import React from 'react';
import { ProjectFileItem } from '@/types/dashboard.types';
import { FileCode, FolderGit2 } from 'lucide-react';

interface RecentFilesListProps {
  files: ProjectFileItem[];
  totalBytes: number;
}

export const RecentFilesList: React.FC<RecentFilesListProps> = ({ files, totalBytes }) => {
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div>
          <h3 className="text-base font-semibold text-foreground">Workspace Assets</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Recently updated project source files</p>
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
          <FolderGit2 className="h-3.5 w-3.5" />
          {formatSize(totalBytes)}
        </span>
      </div>

      <div className="mt-4 divide-y divide-border/40">
        {files.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center py-6">No files generated yet.</p>
        ) : (
          files.map((file) => (
            <div key={file.id} className="flex items-center justify-between py-2.5">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <FileCode className="h-4 w-4 shrink-0 text-primary" />
                <div className="truncate">
                  <p className="text-xs font-medium text-foreground truncate">{file.name}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{file.path}</p>
                </div>
              </div>
              <span className="text-[11px] text-muted-foreground ml-2 shrink-0">
                {formatSize(file.sizeBytes)}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};