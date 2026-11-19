import React from 'react';
import { TrendingUp, ShieldCheck, Activity, Award, BarChart3 } from 'lucide-react';

export default function AdminDashboardCharts({ stats }) {
  const totalUsers = (stats?.total_candidates || 0) + (stats?.total_recruiters || 0);
  const approvedRecruiterPct = stats?.total_recruiters 
    ? Math.round(((stats?.approved_recruiters || 0) / stats.total_recruiters) * 100) 
    : 100;
  
  const approvedJobPct = (stats?.approved_jobs || 0) + (stats?.pending_jobs || 0) > 0
    ? Math.round(((stats?.approved_jobs || 0) / ((stats?.approved_jobs || 0) + (stats?.pending_jobs || 0))) * 100)
    : 100;

  return (
    <div className="bg-white dark:bg-[#150f28] rounded-3xl p-6 border border-slate-200 dark:border-purple-950/50 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-purple-900/30 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-purple-600" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Platform Growth & Moderation Throughput
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time pipeline analysis and platform integrity distribution.
          </p>
        </div>
        <span className="inline-flex items-center text-[11px] font-semibold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-200/60 dark:border-emerald-800/60">
          <Activity className="w-3 h-3 mr-1" /> System Operational
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Recruiter Trust Pipeline */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-purple-950/20 border border-slate-100 dark:border-purple-900/40 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
            <span>Employer Approval Rate</span>
            <span className="font-bold text-teal-600 dark:text-teal-400">{approvedRecruiterPct}%</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-purple-950/60 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-teal-500 to-emerald-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(10, approvedRecruiterPct))}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span>Approved: {stats?.approved_recruiters || 0}</span>
            <span>Pending: {stats?.pending_recruiters || 0}</span>
          </div>
        </div>

        {/* Job Moderation Pipeline */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-purple-950/20 border border-slate-100 dark:border-purple-900/40 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
            <span>Job Publishing Clearance</span>
            <span className="font-bold text-blue-600 dark:text-blue-400">{approvedJobPct}%</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-purple-950/60 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(10, approvedJobPct))}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span>Live: {stats?.approved_jobs || 0}</span>
            <span>Pending Review: {stats?.pending_jobs || 0}</span>
          </div>
        </div>

        {/* Platform Integrity & Scam Shield */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-purple-950/20 border border-slate-100 dark:border-purple-900/40 space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
            <span>Scam Shield Status</span>
            <span className="font-bold text-purple-600 dark:text-purple-400">
              {stats?.reported_jobs_pending ? `${stats.reported_jobs_pending} Alerts` : 'Clear'}
            </span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-purple-950/60 rounded-full h-2 overflow-hidden">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${
                stats?.reported_jobs_pending > 0 
                  ? 'bg-gradient-to-r from-amber-500 to-rose-500' 
                  : 'bg-gradient-to-r from-purple-500 to-indigo-500'
              }`}
              style={{ width: stats?.reported_jobs_pending > 0 ? '65%' : '100%' }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span>Suspended: {stats?.suspended_accounts || 0}</span>
            <span>Applications: {stats?.total_applications || 0}</span>
          </div>
        </div>

      </div>
    </div>
  );
}
