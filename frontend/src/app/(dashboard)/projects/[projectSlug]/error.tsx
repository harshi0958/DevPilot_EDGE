'use client';

import React, { useEffect } from 'react';
import { AlertCircle, RefreshCcw } from 'lucide-react';

interface ErrorBoundaryProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function DashboardError({ error, reset }: ErrorBoundaryProps) {
  useEffect(() => {
    console.error('Project Dashboard error caught:', error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center p-6 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-3">
        <AlertCircle className="h-6 w-6" />
      </div>
      <h2 className="text-lg font-semibold tracking-tight text-foreground">
        Dashboard Loading Error
      </h2>
      <p className="mt-1 text-sm text-muted-foreground max-w-md">
        {error.message || 'An unexpected failure occurred while fetching the project status.'}
      </p>
      <button
        onClick={() => reset()}
        className="mt-4 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
      >
        <RefreshCcw className="h-3.5 w-3.5" />
        Try Again
      </button>
    </div>
  );
}