import React, { useState, useEffect, Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';

const AdminDashboardCharts = lazy(() => import('./AdminDashboardCharts'));
import { 
  Users, 
  Briefcase, 
  Building2, 
  ShieldAlert, 
  CheckCircle, 
  FileWarning, 
  ArrowRight,
  TrendingUp,
  Award,
  UserCheck,
  Ban,
  Clock,
  History
} from 'lucide-react';

export default function AdminOverview() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await api.getAdminStats();
        setStats(data);
      } catch (e) {
        console.error("Failed to load admin platform stats:", e);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-purple-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl border border-slate-800">
        <span className="text-xs font-bold text-purple-400 uppercase tracking-wider block mb-1">
          Platform Operations & Trust Center
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Admin Cockpit
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
          Monitor platform metrics, approve recruiter registrations, moderate job postings, manage suspicious accounts, and inspect tamper-evident audit logs.
        </p>
      </div>

      {/* Real Platform Metrics (CHUNK 6) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Candidates */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-slate-500 text-xs font-medium">Total Candidates</span>
          <p className="text-3xl font-extrabold text-slate-900">{stats?.total_candidates || 0}</p>
          <div className="text-[11px] text-slate-400 flex items-center justify-between mt-1">
            <span>Verified accounts</span>
            <Link to="/admin-portal/users" className="text-purple-600 font-semibold hover:underline">Manage</Link>
          </div>
        </div>

        {/* Recruiters */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-slate-500 text-xs font-medium">Total Recruiters</span>
          <p className="text-3xl font-extrabold text-teal-600">{stats?.total_recruiters || 0}</p>
          <span className="text-[11px] text-slate-400">
            {stats?.approved_recruiters || 0} approved
          </span>
        </div>

        {/* Pending Recruiter Approvals */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-slate-500 text-xs font-medium">Pending Recruiters</span>
          <p className="text-3xl font-extrabold text-amber-500">{stats?.pending_recruiters || 0}</p>
          <Link to="/admin-portal/recruiters" className="text-[11px] font-semibold text-amber-700 hover:underline">
            Requires approval &rarr;
          </Link>
        </div>

        {/* Pending Job Postings */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-slate-500 text-xs font-medium">Pending Job Approvals</span>
          <p className="text-3xl font-extrabold text-blue-600">{stats?.pending_jobs || 0}</p>
          <Link to="/admin-portal/jobs" className="text-[11px] font-semibold text-blue-700 hover:underline">
            Review submissions &rarr;
          </Link>
        </div>

      </div>

      {/* Secondary Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <span className="text-slate-500 text-xs font-medium block">Approved Jobs Live</span>
          <span className="text-2xl font-bold text-slate-800">{stats?.approved_jobs || 0}</span>
        </div>

        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <span className="text-slate-500 text-xs font-medium block">Reported Jobs Pending</span>
          <span className="text-2xl font-bold text-rose-600">{stats?.reported_jobs_pending || 0}</span>
        </div>

        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <span className="text-slate-500 text-xs font-medium block">Suspended Accounts</span>
          <span className="text-2xl font-bold text-slate-700">{stats?.suspended_accounts || 0}</span>
        </div>

        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <span className="text-slate-500 text-xs font-medium block">Total Applications</span>
          <span className="text-2xl font-bold text-purple-700">{stats?.total_applications || 0}</span>
        </div>

      </div>

      {/* Lazy-Loaded Platform Moderation & Growth Charts */}
      <Suspense fallback={
        <div className="h-44 bg-slate-100 dark:bg-purple-950/20 rounded-3xl animate-pulse flex items-center justify-center text-xs text-slate-400">
          Loading platform metrics visualization...
        </div>
      }>
        <AdminDashboardCharts stats={stats} />
      </Suspense>

      {/* Admin Action Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Recruiter Approvals */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4 hover:border-purple-300 transition">
          <div>
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-3">
              <UserCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 mb-1">Recruiter Registration Approvals</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Verify company registration and authorize new employer profiles before they can publish opportunities.
            </p>
          </div>
          <Link
            to="/admin-portal/recruiters"
            className="text-xs font-bold text-purple-600 hover:text-purple-800 flex items-center"
          >
            Review Queue ({stats?.pending_recruiters || 0}) <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>

        {/* Job Moderation */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4 hover:border-blue-300 transition">
          <div>
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-3">
              <Briefcase className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 mb-1">Job Posting Moderation</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Screen newly submitted job descriptions, verify compensation, and approve or reject postings.
            </p>
          </div>
          <Link
            to="/admin-portal/jobs"
            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center"
          >
            Pending Review ({stats?.pending_jobs || 0}) <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>

        {/* User Management */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4 hover:border-teal-300 transition">
          <div>
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center mb-3">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 mb-1">User Account Management</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Search all candidates and recruiters, inspect account statuses, and suspend or reactivate users.
            </p>
          </div>
          <Link
            to="/admin-portal/users"
            className="text-xs font-bold text-teal-600 hover:text-teal-800 flex items-center"
          >
            Manage Accounts &rarr;
          </Link>
        </div>

        {/* Company Verifications */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4 hover:border-amber-300 transition">
          <div>
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-3">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 mb-1">Company Verifications</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Validate corporate registration proof and assign verified employer trust badges.
            </p>
          </div>
          <Link
            to="/admin-portal/verifications"
            className="text-xs font-bold text-amber-600 hover:text-amber-800 flex items-center"
          >
            Company Docs Queue &rarr;
          </Link>
        </div>

        {/* Scam Reports */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4 hover:border-rose-300 transition">
          <div>
            <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center mb-3">
              <FileWarning className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 mb-1">Scam Shield Reports</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Investigate candidate reports regarding fee requests, impersonation, or suspicious activity.
            </p>
          </div>
          <Link
            to="/admin-portal/reports"
            className="text-xs font-bold text-rose-600 hover:text-rose-800 flex items-center"
          >
            Investigate ({stats?.reported_jobs_pending || 0}) <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>

        {/* Audit Logs */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4 hover:border-slate-300 transition">
          <div>
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center mb-3">
              <History className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-900 mb-1">Platform Audit Logs</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Inspect immutable audit records of all administrative actions, approvals, and moderations.
            </p>
          </div>
          <Link
            to="/admin-portal/audit-logs"
            className="text-xs font-bold text-slate-700 hover:text-slate-900 flex items-center"
          >
            View Event Logs &rarr;
          </Link>
        </div>

      </div>

    </div>
  );
}
