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
  Clock
} from 'lucide-react';

export default function ManageJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

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
      setJobs(jobs.map(j => j.id === jobId ? { ...j, status: newStatus } : j));
    } catch (e) {
      console.error(e);
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

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
            Manage Posted Vacancies ({jobs.length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Toggle listing availability, monitor applicant counts, and edit job specifications.
          </p>
        </div>

        <Link
          to="/recruiter/jobs/new"
          className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow transition flex items-center shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 mr-1.5" /> Post New Role
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(n => (
            <div key={n} className="p-5 rounded-2xl bg-white border border-slate-200 animate-pulse h-28"></div>
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="p-16 bg-white rounded-3xl border border-slate-200 text-center text-xs text-slate-500">
          <Briefcase className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          No vacancies posted yet. Click 'Post New Role' to create your first listing.
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-bold text-base text-navy-900">{job.title}</h3>
                  {job.is_verified && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-100 text-blue-800">
                      <ShieldCheck className="w-3 h-3 mr-1" /> Verified
                    </span>
                  )}
                  {job.has_scam_warning && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-800">
                      <AlertTriangle className="w-3 h-3 mr-1" /> Under Review
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-500">
                  {job.location} • {job.work_mode?.toLowerCase()} • Posted on {new Date(job.created_at).toLocaleDateString()}
                </p>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(job.required_skills || []).map(s => (
                    <span key={s} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Status and Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 shrink-0 self-end md:self-center">
                <Link
                  to={`/recruiter/applicants?job=${job.id}`}
                  className="px-3.5 py-2 rounded-xl bg-teal-50 text-teal-800 hover:bg-teal-100 font-bold text-xs flex items-center transition"
                >
                  <Users className="w-3.5 h-3.5 mr-1.5" />
                  {job.application_count || 0} Applicants
                </Link>

                <select
                  value={job.status}
                  onChange={(e) => handleStatusChange(job.id, e.target.value)}
                  className="p-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold outline-none"
                >
                  <option value="PUBLISHED">Published</option>
                  <option value="PAUSED">Paused</option>
                  <option value="CLOSED">Closed</option>
                </select>

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

