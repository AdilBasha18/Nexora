import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { 
  Sparkles, 
  Building, 
  MapPin, 
  Briefcase, 
  CheckCircle, 
  AlertTriangle, 
  Bookmark, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export default function CandidateRecommendedJobsPage() {
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRecommendations() {
      try {
        const data = await api.getRecommendedJobs(20);
        setRecommended(data.results || data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadRecommendations();
  }, []);

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto space-y-8">
      
      <div>
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Explainable Algorithmic Match</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
          Recommended Jobs For You
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Ranked using skill taxonomy, required vs preferred qualifications, and work mode preferences.
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(n => (
            <div key={n} className="p-6 rounded-2xl bg-white border border-slate-200 animate-pulse h-40"></div>
          ))}
        </div>
      ) : recommended.length === 0 ? (
        <div className="p-16 bg-white rounded-3xl border border-slate-200 text-center text-xs text-slate-500">
          No job matches found. Complete your profile skills to view recommendations.
        </div>
      ) : (
        <div className="space-y-4">
          {recommended.map(({ job, match }) => (
            <div
              key={job.id}
              className="bg-white p-6 rounded-3xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-1 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link to={`/jobs/${job.id}`} className="font-bold text-base text-navy-900 hover:text-blue-600">
                      {job.title}
                    </Link>
                    {job.is_verified && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-100 text-blue-800">
                        <ShieldCheck className="w-3 h-3 mr-1" /> Verified
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 flex items-center">
                    <Building className="w-3.5 h-3.5 mr-1 text-slate-400" />
                    {job.company?.name} • {job.location} ({job.work_mode?.toLowerCase()})
                  </p>
                </div>

                {/* Match Score Badge */}
                <div className="flex items-center space-x-2 bg-blue-50 px-3.5 py-1.5 rounded-xl border border-blue-100 self-start">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span className="font-bold text-xs text-blue-900">
                    {match.match_score}% Match
                  </span>
                </div>
              </div>

              {/* Match Reasons */}
              {match.reasons && match.reasons.length > 0 && (
                <div className="p-3 rounded-xl bg-slate-50 text-xs text-slate-700 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Why this matches:
                  </span>
                  <ul className="space-y-0.5 list-disc list-inside">
                    {match.reasons.map((r, rIdx) => (
                      <li key={rIdx}>{r}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Skills matched vs missing */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
                <div>
                  <span className="text-[10px] font-bold uppercase text-emerald-700 block mb-1">
                    Matched Skills ({match.matched_skills?.length || 0}):
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {match.matched_skills?.map(s => (
                      <span key={s} className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[11px] font-medium">
                        ✓ {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase text-amber-700 block mb-1">
                    Missing Target Skills ({match.missing_required_skills?.length || 0}):
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {match.missing_required_skills?.length > 0 ? (
                      match.missing_required_skills.map(s => (
                        <span key={s} className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 text-[11px] font-medium">
                          + {s}
                        </span>
                      ))
                    ) : (
                      <span className="text-[11px] text-slate-400">All required skills met!</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">
                  {job.is_salary_disclosed && job.salary_min ? (
                    `₹${Number(job.salary_min).toLocaleString('en-IN')} - ₹${Number(job.salary_max).toLocaleString('en-IN')} per annum`
                  ) : (
                    'Competitive Salary'
                  )}
                </span>
                <Link
                  to={`/jobs/${job.id}`}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition"
                >
                  View Details & Apply
                </Link>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}

