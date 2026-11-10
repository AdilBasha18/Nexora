import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { Bookmark, Building, MapPin, Briefcase, Trash2, ArrowRight } from 'lucide-react';

export default function CandidateSavedJobsPage() {
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSaved();
  }, []);

  async function fetchSaved() {
    setLoading(true);
    try {
      const data = await api.getSavedJobs();
      setSavedJobs(data.results || data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const handleUnsave = async (jobId) => {
    try {
      await api.toggleSaveJob(jobId);
      setSavedJobs(savedJobs.filter(s => s.job.id !== jobId));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
          Saved Job Listings ({savedJobs.length})
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review bookmarked positions and complete your applications.
        </p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2].map(n => (
            <div key={n} className="p-5 rounded-2xl bg-white border border-slate-200 animate-pulse h-28"></div>
          ))}
        </div>
      ) : savedJobs.length === 0 ? (
        <div className="p-16 bg-white rounded-3xl border border-slate-200 text-center text-xs text-slate-500">
          <Bookmark className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          No saved jobs yet. Browse the job board to save positions you want to revisit.
        </div>
      ) : (
        <div className="space-y-4">
          {savedJobs.map((item) => (
            <div
              key={item.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 hover:shadow-sm transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <Link to={`/jobs/${item.job.id}`} className="font-bold text-base text-navy-900 hover:text-blue-600">
                  {item.job.title}
                </Link>
                <p className="text-xs text-slate-500 flex items-center">
                  <Building className="w-3.5 h-3.5 mr-1 text-slate-400" />
                  {item.job.company?.name} • {item.job.location} ({item.job.work_mode?.toLowerCase()})
                </p>
                <p className="text-[11px] text-slate-400">
                  Saved on {new Date(item.saved_at).toLocaleDateString()}
                </p>
              </div>

              <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                <Link
                  to={`/jobs/${item.job.id}`}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition"
                >
                  Apply Now
                </Link>
                <button
                  onClick={() => handleUnsave(item.job.id)}
                  className="p-2 rounded-xl text-slate-400 hover:text-red-600 transition"
                  title="Remove from saved"
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

