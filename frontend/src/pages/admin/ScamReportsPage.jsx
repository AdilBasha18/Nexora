import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { FileWarning, ShieldAlert, Check, X, Building, AlertCircle } from 'lucide-react';

export default function ScamReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  async function fetchReports() {
    setLoading(true);
    try {
      const data = await api.getJobReports();
      setReports(data.results || data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const handleResolve = async (reportId, status, suspendJob = false) => {
    const notes = prompt("Enter moderation findings / resolution notes:", "");
    if (notes === null) return;

    try {
      await api.resolveReport(reportId, {
        status,
        admin_notes: notes,
        suspend_job: suspendJob
      });
      fetchReports();
      alert(`Report marked as ${status}.`);
    } catch (e) {
      alert("Failed to update report.");
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto space-y-8">
      
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
          Job Scam Shield Reports ({reports.length})
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Investigate user-flagged vacancies regarding fee requests, personal credential harvesting, or deceptive terms.
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map(n => (
            <div key={n} className="p-6 rounded-2xl bg-white border border-slate-200 animate-pulse h-36"></div>
          ))}
        </div>
      ) : reports.length === 0 ? (
        <div className="p-16 bg-white rounded-3xl border border-slate-200 text-center text-xs text-slate-500">
          <ShieldAlert className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          No scam reports pending review.
        </div>
      ) : (
        <div className="space-y-4">
          {reports.map((report) => (
            <div
              key={report.id}
              className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2">
                  <FileWarning className="w-5 h-5 text-amber-600" />
                  <h3 className="font-bold text-base text-navy-900">{report.job_title}</h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    report.status === 'PENDING' ? 'bg-amber-100 text-amber-800' :
                    report.status === 'INVESTIGATED' ? 'bg-red-100 text-red-800' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {report.status}
                  </span>
                </div>

                <span className="text-xs text-slate-400">
                  Reported by {report.reported_by_name} on {new Date(report.created_at).toLocaleDateString()}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Report Reason:</span>
                  <span className="font-semibold text-amber-900 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                    {report.reason?.replace('_', ' ')}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Candidate Statement:</span>
                  <p className="text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed italic">
                    “{report.details}”
                  </p>
                </div>

                {report.admin_notes && (
                  <div>
                    <span className="text-[10px] font-bold uppercase text-purple-700 block mb-0.5">Admin Resolution:</span>
                    <p className="text-slate-800 bg-purple-50 p-3 rounded-xl border border-purple-100">
                      {report.admin_notes}
                    </p>
                  </div>
                )}
              </div>

              {report.status === 'PENDING' && (
                <div className="pt-3 border-t border-slate-100 flex justify-end space-x-2 text-xs">
                  <button
                    onClick={() => handleResolve(report.id, 'DISMISSED', false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold"
                  >
                    Dismiss (Legitimate Listing)
                  </button>
                  <button
                    onClick={() => handleResolve(report.id, 'INVESTIGATED', true)}
                    className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold shadow transition"
                  >
                    Suspend Job & Take Action
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

