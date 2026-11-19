import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { 
  Briefcase, 
  Users, 
  Plus, 
  Trash2, 
  ShieldCheck, 
  Building, 
  AlertTriangle,
  Clock,
  CheckCircle,
  XCircle,
  Filter,
  ExternalLink,
  Edit
} from 'lucide-react';

export default function ManageJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    fetchJobs();
  }, []);

  async function fetchJobs() {
    setLoading(true);
    try {
      const data = await api.getRecruiterJobs();
      setJobs(data.results || data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const handleStatusChange = async (jobId, newStatus) => {
    try {
      await api.updateJob(jobId, { status: newStatus });
      fetchJobs();
    } catch (e) {
      alert("Failed to update status. Note that editing details sends the job for approval.");
    }
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job listing?")) return;
    try {
      await api.deleteJob(jobId);
      setJobs(jobs.filter(j => j.id !== jobId));
    } catch (e) {
      console.error(e);
    }
  };

  const filteredJobs = jobs.filter(j => {
    if (statusFilter === 'ALL') return true;
    if (statusFilter === 'APPROVED') return j.status === 'APPROVED' || j.status === 'PUBLISHED';
    return j.status === statusFilter;
  });

  const getStatusBadge = (status, scamWarning) => {
    if (scamWarning) {
      return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200">Flagged by Moderator</span>;
    }
    switch (status) {
      case 'PENDING_REVIEW':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 flex items-center"><Clock className="w-3 h-3 mr-1" /> Pending Admin Review</span>;
      case 'APPROVED':
      case 'PUBLISHED':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center"><CheckCircle className="w-3 h-3 mr-1" /> Approved & Live</span>;
      case 'REJECTED':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 flex items-center"><XCircle className="w-3 h-3 mr-1" /> Revision Needed</span>;
      case 'DRAFT':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">Draft</span>;
      case 'CLOSED':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-500">Closed</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">{status}</span>;
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Job Posting Management & Approval Tracker
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Monitor admin verification standing, inspect applicant pipelines, and manage active vacancies.
          </p>
        </div>

        <Link
          to="/recruiter/jobs/new"
          className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow transition flex items-center shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 mr-1.5" /> Post New Role
        </Link>
      </div>

      {/* CHUNK 5: Status Filter Tabs */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap gap-2">
        {[
          { id: 'ALL', label: `All Jobs (${jobs.length})` },
          { id: 'APPROVED', label: `Approved & Live (${jobs.filter(j => j.status === 'APPROVED' || j.status === 'PUBLISHED').length})` },
          { id: 'PENDING_REVIEW', label: `Pending Review (${jobs.filter(j => j.status === 'PENDING_REVIEW').length})` },
          { id: 'REJECTED', label: `Revision Needed (${jobs.filter(j => j.status === 'REJECTED').length})` },
          { id: 'DRAFT', label: `Drafts (${jobs.filter(j => j.status === 'DRAFT').length})` },
          { id: 'CLOSED', label: `Closed (${jobs.filter(j => j.status === 'CLOSED').length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
              statusFilter === tab.id
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(n => (
            <div key={n} className="p-5 rounded-2xl bg-white border border-slate-200 animate-pulse h-28"></div>
          ))}
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="p-16 bg-white rounded-3xl border border-slate-200 text-center text-xs text-slate-500 space-y-2">
          <Briefcase className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="font-semibold text-slate-700">No job postings found</p>
          <p className="text-slate-400">There are no job listings matching the selected status filter.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-slate-300 transition"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-bold text-base text-slate-900">{job.title}</h3>
                  {getStatusBadge(job.status, job.has_scam_warning)}
                  {job.is_verified && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-800 border border-teal-200">
                      <ShieldCheck className="w-3 h-3 mr-1 text-teal-600" /> Verified
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-500">
                  {job.location} • {job.work_mode?.toLowerCase()} • Submitted on {new Date(job.created_at).toLocaleDateString()}
                </p>

                {job.status === 'PENDING_REVIEW' && (
                  <p className="text-[11px] text-amber-700 bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                    <strong>Pending Review:</strong> This job has been submitted to the Nexora trust and safety moderation team. Once approved, it will automatically appear in candidate searches.
                  </p>
                )}

                {job.rejection_reason && (
                  <div className="p-3 bg-red-50 rounded-xl border border-red-200 text-xs text-red-700">
                    <strong>Moderator Feedback:</strong> {job.rejection_reason}
                  </div>
                )}

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(job.required_skills || []).map((s, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Status and Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 shrink-0 self-end md:self-center">
                <Link
                  to={`/recruiter/applicants?job=${job.id}`}
                  className="px-3.5 py-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-xs flex items-center transition"
                >
                  <Users className="w-3.5 h-3.5 mr-1.5" />
                  {job.application_count || 0} Applicants
                </Link>

                {(job.status === 'APPROVED' || job.status === 'PUBLISHED') && (
                  <Link
                    to={`/jobs/${job.id}`}
                    className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:text-slate-900 transition"
                    title="View Public Listing"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                )}

                {job.status !== 'CLOSED' ? (
                  <button
                    onClick={() => handleStatusChange(job.id, 'CLOSED')}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
                  >
                    Close Listing
                  </button>
                ) : (
                  <button
                    onClick={() => handleStatusChange(job.id, 'PENDING_REVIEW')}
                    className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold transition"
                  >
                    Reopen
                  </button>
                )}

                <button
                  onClick={() => handleDelete(job.id)}
                  className="p-2 rounded-xl text-slate-400 hover:text-red-600 transition"
                  title="Delete job"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
