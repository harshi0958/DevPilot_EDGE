import React from 'react';
import { AIExecutionSummary } from '@/types/dashboard';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bot, CheckCircle2, Clock, AlertTriangle, Loader2 } from 'lucide-react';

interface RecentExecutionsProps {
  executions: AIExecutionSummary[];
}

export const RecentExecutions: React.FC<RecentExecutionsProps> = ({ executions }) => {
  const getStatusBadge = (status: AIExecutionSummary['status']) => {
    switch (status) {
      case 'SUCCESS':
        return (
          <Badge variant="outline" className="border-emerald-500/30 text-emerald-500 bg-emerald-500/10 gap-1">
            <CheckCircle2 className="h-3 w-3" /> Success
          </Badge>
        );
      case 'RUNNING':
        return (
          <Badge variant="outline" className="border-blue-500/30 text-blue-500 bg-blue-500/10 gap-1">
            <Loader2 className="h-3 w-3 animate-spin" /> Running
          </Badge>
        );
      case 'FAILED':
        return (
          <Badge variant="outline" className="border-rose-500/30 text-rose-500 bg-rose-500/10 gap-1">
            <AlertTriangle className="h-3 w-3" /> Failed
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="border-amber-500/30 text-amber-500 bg-amber-500/10 gap-1">
            <Clock className="h-3 w-3" /> Pending
          </Badge>
        );
    }
  };

  return (
    <Card className="border-border/60 bg-card/60 shadow-sm">
      <CardHeader>
        <CardTitle className="text-base font-semibold">Recent Agent Activity</CardTitle>
        <CardDescription>Latest AI execution pipelines triggered across the project.</CardDescription>
      </CardHeader>
      <CardContent>
        {executions.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            No agent executions recorded yet.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Agent</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead className="text-right">Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {executions.map((exec) => (
                <TableRow key={exec.id}>
                  <TableCell className="font-medium flex items-center gap-2">
                    <Bot className="h-4 w-4 text-muted-foreground" />
                    <span>{exec.agent}</span>
                  </TableCell>
                  <TableCell>{getStatusBadge(exec.status)}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {exec.durationMs ? `${(exec.durationMs / 1000).toFixed(2)}s` : '—'}
                  </TableCell>
                  <TableCell className="text-right text-sm text-muted-foreground">
                    {new Date(exec.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};