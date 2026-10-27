import { ReactNode } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-950 font-sans antialiased text-slate-100">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <header className="h-14 border-b border-slate-800 px-8 flex items-center justify-between bg-slate-950/70 backdrop-blur">
          <h1 className="text-sm font-semibold tracking-wide uppercase text-slate-400">
            System Management Console
          </h1>
          <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
            System Operational
          </div>
        </header>
        <main className="flex-1 p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}