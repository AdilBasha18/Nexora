import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Briefcase, ShieldCheck, AlertTriangle, Building, Ban, CheckCircle, Search } from 'lucide-react';

export default function JobModerationPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  async function fetchJobs() {
    setLoading(true);
    try {
      const data = await api.getJobs();
      setJobs(data.results || data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const handleJobAction = async (jobId, action, reason = '') => {
    try {
      await api.actOnJob(jobId, { action, reason });
      fetchJobs();
    } catch (e) {
      alert("Failed to perform moderation action.");
    }
  };

  const filteredJobs = jobs.filter(j => 
    j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    j.company?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto space-y-8">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
            Job Listing Moderation
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Audit public vacancies, toggle official verification status, or suspend suspicious postings.
          </p>
        </div>

        <div className="w-full sm:w-64">
          <input
            type="text"
            placeholder="Search listings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2.5 rounded-xl border border-slate-200 bg-white text-xs outline-none"
          />
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(n => (
            <div key={n} className="p-5 rounded-2xl bg-white border border-slate-200 animate-pulse h-28"></div>
          ))}
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="p-16 bg-white rounded-3xl border border-slate-200 text-center text-xs text-slate-500">
          No listings found.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-bold text-base text-navy-900">{job.title}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    job.status === 'PUBLISHED' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {job.status}
                  </span>
                  {job.is_verified && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                      <ShieldCheck className="w-3 h-3 mr-1" /> Verified Badge
                    </span>
                  )}
                  {job.has_scam_warning && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                      <AlertTriangle className="w-3 h-3 mr-1" /> Scam Warning Active
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-500 flex items-center">
                  <Building className="w-3.5 h-3.5 mr-1 text-slate-400" />
                  {job.company?.name} • {job.location} ({job.work_mode})
                </p>

                {job.has_scam_warning && (
                  <p className="text-[11px] text-amber-800 bg-amber-50 p-2 rounded-xl border border-amber-200">
                    {job.scam_warning_reason}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 shrink-0 self-end md:self-center text-xs">
                <button
                  onClick={() => handleJobAction(job.id, 'TOGGLE_VERIFY')}
                  className={`px-3 py-1.5 rounded-xl font-semibold border transition ${
                    job.is_verified 
                      ? 'border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100' 
                      : 'border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {job.is_verified ? 'Remove Verified Badge' : 'Grant Verified Badge'}
                </button>

                {job.status === 'PUBLISHED' ? (
                  <button
                    onClick={() => {
                      const reason = prompt("Enter suspension reason for Scam Shield audit:", "Suspicious payment requests or fee demands.");
                      if (reason) handleJobAction(job.id, 'SUSPEND', reason);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 font-semibold border border-red-200 flex items-center"
                  >
                    <Ban className="w-3.5 h-3.5 mr-1" /> Suspend
                  </button>
                ) : (
                  <button
                    onClick={() => handleJobAction(job.id, 'ACTIVATE')}
                    className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-semibold border border-emerald-200 flex items-center"
                  >
                    <CheckCircle className="w-3.5 h-3.5 mr-1" /> Reactivate
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

