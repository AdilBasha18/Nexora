import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { 
  Briefcase, 
  ShieldCheck, 
  AlertTriangle, 
  Building, 
  Ban, 
  CheckCircle, 
  Search, 
  XCircle,
  Clock,
  ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function JobModerationPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('PENDING_REVIEW');
  const [searchTerm, setSearchTerm] = useState('');
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, [statusFilter]);

  async function fetchJobs() {
    setLoading(true);
    try {
      const data = await api.getAdminJobs(statusFilter === 'ALL' ? '' : statusFilter, searchTerm);
      setJobs(data.results || data);
    } catch (e) {
      console.error("Error fetching jobs for moderation:", e);
    } finally {
      setLoading(false);
    }
  }

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  const handleJobAction = async (jobId, action) => {
    let reason = '';
    if (action === 'REJECT') {
      reason = prompt("Provide specific feedback/reason for rejecting this job posting (sent to recruiter):");
      if (!reason) return;
    } else if (action === 'SUSPEND') {
      reason = prompt("Enter suspension reason / scam warning:");
      if (!reason) return;
    }

    setProcessingId(jobId);
    try {
      await api.actOnJob(jobId, { action, reason });
      fetchJobs();
    } catch (e) {
      alert("Failed to perform moderation action on job.");
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusBadge = (status, hasScamWarning) => {
    if (hasScamWarning) {
      return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">Scam Warning</span>;
    }
    switch (status) {
      case 'PENDING_REVIEW':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">Pending Approval</span>;
      case 'APPROVED':
      case 'PUBLISHED':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">Approved</span>;
      case 'REJECTED':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700">Rejected</span>;
      case 'SUSPENDED':
      case 'CLOSED':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700">{status}</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">{status}</span>;
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Job Posting Moderation
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review new recruiter job submissions, inspect compensation and responsibilities, and approve or reject before going live to candidates.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Status Filters */}
        <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
          {[
            { id: 'PENDING_REVIEW', label: 'Pending Review' },
            { id: 'APPROVED', label: 'Approved' },
            { id: 'REJECTED', label: 'Rejected' },
            { id: 'SUSPENDED', label: 'Suspended' },
            { id: 'ALL', label: 'All Jobs' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                statusFilter === tab.id
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex items-center space-x-2 w-full sm:w-72">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search title or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs outline-none focus:border-purple-500"
            />
          </div>
          <button
            type="submit"
            className="px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-purple-700 transition"
          >
            Filter
          </button>
        </form>

      </div>

      {/* Jobs Listing */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(n => (
            <div key={n} className="p-6 rounded-2xl bg-white border border-slate-200 animate-pulse h-32"></div>
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="p-16 bg-white rounded-3xl border border-slate-200 text-center text-xs text-slate-500 space-y-2">
          <Briefcase className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="font-semibold text-slate-700">No job postings found</p>
          <p className="text-slate-400">There are no job listings matching the selected status filter.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 hover:border-slate-300 transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                
                <div className="space-y-2 flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-base text-slate-900">{job.title}</h3>
                    {getStatusBadge(job.status, job.has_scam_warning)}
                    {job.is_verified && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200">
                        <ShieldCheck className="w-3 h-3 mr-1 text-teal-600" /> Verified Listing
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-500 flex items-center">
                    <Building className="w-3.5 h-3.5 mr-1 text-slate-400" />
                    <span className="font-semibold text-slate-700">{job.company?.name}</span>
                    <span className="mx-2">•</span>
                    <span>{job.location} ({job.work_mode?.toLowerCase()})</span>
                    <span className="mx-2">•</span>
                    <span>Submitted on {new Date(job.created_at).toLocaleDateString()}</span>
                  </p>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {job.description}
                  </p>

                  {job.rejection_reason && (
                    <div className="p-3 bg-red-50 rounded-xl border border-red-200 text-xs text-red-700">
                      <strong>Rejection Feedback:</strong> {job.rejection_reason}
                    </div>
                  )}

                  {job.has_scam_warning && (
                    <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-xs text-rose-700 flex items-start space-x-2">
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <div>
                        <strong>Flagged by Scam Shield:</strong> {job.scam_warning_reason}
                      </div>
                    </div>
                  )}

                  {/* Skills tags */}
                  {job.required_skills && job.required_skills.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {job.required_skills.map((s, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px]">
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Moderation Actions */}
                <div className="flex flex-wrap sm:flex-col gap-2 shrink-0">
                  {job.status === 'PENDING_REVIEW' && (
                    <>
                      <button
                        onClick={() => handleJobAction(job.id, 'APPROVE')}
                        disabled={processingId === job.id}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center justify-center space-x-1.5"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Approve & Publish</span>
                      </button>
                      <button
                        onClick={() => handleJobAction(job.id, 'REJECT')}
                        disabled={processingId === job.id}
                        className="px-4 py-2 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-700 rounded-xl text-xs font-semibold transition flex items-center justify-center space-x-1.5"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    </>
                  )}

                  {(job.status === 'APPROVED' || job.status === 'PUBLISHED') && (
                    <>
                      <button
                        onClick={() => handleJobAction(job.id, 'SUSPEND')}
                        disabled={processingId === job.id}
                        className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-semibold transition flex items-center space-x-1"
                      >
                        <Ban className="w-3.5 h-3.5" />
                        <span>Suspend Job</span>
                      </button>
                      <button
                        onClick={() => handleJobAction(job.id, 'TOGGLE_VERIFY')}
                        disabled={processingId === job.id}
                        className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition"
                      >
                        {job.is_verified ? 'Remove Verified' : 'Mark Verified'}
                      </button>
                    </>
                  )}

                  {job.status === 'SUSPENDED' && (
                    <button
                      onClick={() => handleJobAction(job.id, 'APPROVE')}
                      disabled={processingId === job.id}
                      className="px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-semibold transition"
                    >
                      Reactivate Job
                    </button>
                  )}
                </div>

              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
