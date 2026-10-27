'use client';

import { useEffect, useState } from 'react';
import AdminMetricsCards from '@/components/admin/AdminMetricsCards';
import { AdminMetrics, RecentExecution } from '@/types/admin';

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<AdminMetrics | null>(null);
  const [executions, setExecutions] = useState<RecentExecution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const res = await fetch('http://localhost:5000/api/admin/metrics', {
          credentials: 'include'
        });

        if (!res.ok) {
          throw new Error('Failed to load admin metrics');
        }

        const data = await res.json();
        setMetrics(data.metrics);
        setExecutions(data.recentExecutions);
      } catch (err: any) {
        setError(err.message || 'Error loading dashboard');
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="text-slate-400 p-4">Loading admin dashboard metrics...</div>;
  }

  if (error) {
    return (
      <div className="p-4 bg-red-950/30 border border-red-800 rounded text-red-300">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-white">Dashboard Overview</h2>
        <p className="text-slate-400 text-sm mt-1">
          Live system statistics and agent activity.
        </p>
      </div>

      {metrics && <AdminMetricsCards metrics={metrics} />}

      <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Recent AI Executions</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="border-b border-slate-800 text-xs uppercase text-slate-400">
              <tr>
                <th className="py-3 px-4">Project</th>
                <th className="py-3 px-4">Agent</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Executed At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {executions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-4 px-4 text-center text-slate-500">
                    No recent executions found.
                  </td>
                </tr>
              ) : (
                executions.map((exec) => (
                  <tr key={exec.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4 font-medium text-slate-200">
                      {exec.project?.name || 'Unknown'}
                    </td>
                    <td className="py-3 px-4">
                      {exec.agent?.name || 'Agent'}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-xs bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        {exec.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400">
                      {new Date(exec.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}