import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { 
  Users, 
  Briefcase, 
  Building2, 
  ShieldAlert, 
  CheckCircle, 
  FileWarning, 
  ArrowRight,
  TrendingUp,
  Award
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
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-purple-950 to-navy-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <span className="text-xs font-bold text-purple-400 uppercase tracking-wider block mb-1">
          Operations & Moderation Center
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Platform Administration
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
          Review pending employer credentials, moderate reported job postings, maintain knowledge documents, and audit administrative events.
        </p>
      </div>

      {/* Real Platform Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-slate-500 text-xs font-medium">Candidates</span>
          <p className="text-3xl font-extrabold text-navy-900">{stats?.total_candidates || 0}</p>
          <span className="text-[11px] text-slate-400">Registered profiles</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-slate-500 text-xs font-medium">Recruiters</span>
          <p className="text-3xl font-extrabold text-teal-600">{stats?.total_recruiters || 0}</p>
          <span className="text-[11px] text-slate-400">Registered employers</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-slate-500 text-xs font-medium">Active Jobs</span>
          <p className="text-3xl font-extrabold text-blue-600">{stats?.active_jobs || 0}</p>
          <span className="text-[11px] text-slate-400">Published vacancies</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-slate-500 text-xs font-medium">Pending Verifications</span>
          <p className="text-3xl font-extrabold text-amber-500">{stats?.pending_verifications || 0}</p>
          <span className="text-[11px] text-slate-400">Awaiting document check</span>
        </div>

      </div>

      {/* Moderation Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-3">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-navy-900 mb-1">Company Verifications</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Verify legal corporate registration and tax IDs to award the official Verified Employer badge.
            </p>
          </div>
          <Link
            to="/admin-portal/verifications"
            className="text-xs font-bold text-purple-600 hover:text-purple-800 flex items-center"
          >
            Review Queue ({stats?.pending_verifications || 0}) <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-3">
              <FileWarning className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-navy-900 mb-1">Job Scam Shield Reports</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Investigate candidate-reported postings regarding payment requests, fake recruiters, or misleading terms.
            </p>
          </div>
          <Link
            to="/admin-portal/reports"
            className="text-xs font-bold text-amber-700 hover:text-amber-900 flex items-center"
          >
            Investigate Reports ({stats?.reported_jobs_pending || 0}) <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-3">
              <Briefcase className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-navy-900 mb-1">Job Moderation</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Browse all job postings on the platform, manually grant verified badges, or suspend scam postings.
            </p>
          </div>
          <Link
            to="/admin-portal/jobs"
            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center"
          >
            Browse Listings <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>

      </div>

    </div>
  );
}

