import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { 
  Briefcase, 
  Calendar, 
  Clock, 
  Building, 
  MapPin, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  FileText,
  ExternalLink
} from 'lucide-react';

export default function CandidateApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [withdrawingId, setWithdrawingId] = useState(null);

  useEffect(() => {
    fetchApplications();
  }, []);

  async function fetchApplications() {
    setLoading(true);
    try {
      const data = await api.getMyApplications();
      setApplications(data.results || data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const handleWithdraw = async (appId) => {
    if (!window.confirm("Are you sure you want to withdraw this application?")) return;
    setWithdrawingId(appId);
    try {
      await api.withdrawApplication(appId);
      fetchApplications();
    } catch (err) {
      alert(err.data?.error || "Failed to withdraw application.");
    } finally {
      setWithdrawingId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'SUBMITTED':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700">Submitted</span>;
      case 'UNDER_REVIEW':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700">Under Review</span>;
      case 'SHORTLISTED':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-teal-50 text-teal-800">Shortlisted</span>;
      case 'INTERVIEW':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 animate-pulse">Interview Scheduled</span>;
      case 'OFFERED':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-900 font-extrabold">Job Offered 🎉</span>;
      case 'REJECTED':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600">Not Selected</span>;
      case 'WITHDRAWN':
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-50 text-red-700">Withdrawn</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700">{status}</span>;
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto space-y-8">
      
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
          Application Tracking
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Monitor your candidacies, status updates from verified recruiters, and scheduled interviews in real time.
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map(n => (
            <div key={n} className="p-6 rounded-2xl bg-white border border-slate-200 animate-pulse h-36"></div>
          ))}
        </div>
      ) : applications.length === 0 ? (
        <div className="p-16 bg-white rounded-3xl border border-slate-200 text-center space-y-3">
          <Briefcase className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800">No active applications yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Explore verified opportunities matching your skills and submit applications with your primary resume.
          </p>
          <Link
            to="/jobs"
            className="inline-flex px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-xs shadow-sm hover:bg-blue-700 transition"
          >
            Explore Jobs
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div
              key={app.id}
              className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-base font-bold text-navy-900">
                      {app.job?.title}
                    </h3>
                    {getStatusBadge(app.status)}
                  </div>
                  <p className="text-xs text-slate-500 mt-1 flex items-center">
                    <Building className="w-3.5 h-3.5 mr-1 text-slate-400" />
                    {app.job?.company?.name} • Applied on {new Date(app.applied_at).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center space-x-2 self-end sm:self-auto">
                  <Link
                    to={`/jobs/${app.job?.id}`}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50"
                  >
                    View Job
                  </Link>

                  {app.status !== 'WITHDRAWN' && app.status !== 'OFFERED' && app.status !== 'REJECTED' && (
                    <button
                      onClick={() => handleWithdraw(app.id)}
                      disabled={withdrawingId === app.id}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                    >
                      {withdrawingId === app.id ? 'Withdrawing...' : 'Withdraw'}
                    </button>
                  )}
                </div>
              </div>

              {/* Interview Notice if Scheduled */}
              {app.interview_date && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs space-y-1">
                  <span className="font-bold uppercase tracking-wider text-[10px] text-emerald-700 block">
                    Upcoming Interview Scheduled
                  </span>
                  <div className="flex items-center space-x-2 font-semibold">
                    <Calendar className="w-4 h-4 text-emerald-600" />
                    <span>{new Date(app.interview_date).toLocaleString()}</span>
                  </div>
                  {app.interview_location_or_link && (
                    <p className="pt-1">
                      Meeting Link / Location: <strong>{app.interview_location_or_link}</strong>
                    </p>
                  )}
                </div>
              )}

              {/* Status History Timeline */}
              {app.status_history && app.status_history.length > 0 && (
                <div className="pt-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                    Audit Trail & Timeline
                  </span>
                  <div className="space-y-1 text-xs text-slate-500">
                    {app.status_history.map((hist, idx) => (
                      <div key={idx} className="flex items-center space-x-2 text-[11px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                        <span className="font-semibold text-slate-700">{hist.to_status}</span>
                        <span>— {hist.notes || 'Status updated'}</span>
                        <span className="text-slate-400">({new Date(hist.changed_at).toLocaleDateString()})</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          ))}
        </div>
      )}

    </div>
  );
}

