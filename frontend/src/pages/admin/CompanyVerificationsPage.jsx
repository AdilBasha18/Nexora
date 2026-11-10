import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { ShieldCheck, Check, X, Building2, Mail, FileText, AlertCircle } from 'lucide-react';

export default function CompanyVerificationsPage() {
  const [verifications, setVerifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchVerifications();
  }, []);

  async function fetchVerifications() {
    setLoading(true);
    try {
      const data = await api.getAdminVerifications();
      setVerifications(data.results || data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const handleAction = async (id, action) => {
    const notes = prompt(`Enter optional review notes for ${action.toLowerCase()}ing:`, "");
    if (notes === null) return;

    setProcessingId(id);
    try {
      const updated = await api.actOnVerification(id, { action, notes });
      setVerifications(verifications.map(v => v.id === id ? updated : v));
      alert(`Verification request ${action.toLowerCase()}d successfully.`);
    } catch (e) {
      alert("Failed to update verification status.");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto space-y-8">
      
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
          Company & Recruiter Verification Queue
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review business registration numbers, corporate domain emails, and authorize Verified Employer status.
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map(n => (
            <div key={n} className="p-6 rounded-2xl bg-white border border-slate-200 animate-pulse h-36"></div>
          ))}
        </div>
      ) : verifications.length === 0 ? (
        <div className="p-16 bg-white rounded-3xl border border-slate-200 text-center text-xs text-slate-500">
          <ShieldCheck className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          No verification requests submitted yet.
        </div>
      ) : (
        <div className="space-y-4">
          {verifications.map((item) => (
            <div
              key={item.id}
              className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2">
                  <Building2 className="w-5 h-5 text-purple-600" />
                  <h3 className="font-bold text-base text-navy-900">{item.company_name}</h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                    item.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' :
                    item.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                    'bg-amber-100 text-amber-800'
                  }`}>
                    {item.status}
                  </span>
                </div>

                <span className="text-xs text-slate-400">
                  Submitted {new Date(item.created_at).toLocaleDateString()} by {item.submitted_by_name}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Business Registration ID:</span>
                  <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-800">{item.business_reg_number}</span>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Corporate Domain Email:</span>
                  <span className="font-medium text-slate-800">{item.official_domain_email}</span>
                </div>

                {item.notes && (
                  <div className="sm:col-span-2">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Applicant Notes:</span>
                    <p className="italic text-slate-700">“{item.notes}”</p>
                  </div>
                )}

                {item.reviewer_notes && (
                  <div className="sm:col-span-2 p-2.5 bg-slate-50 rounded-xl">
                    <span className="text-[10px] font-bold uppercase text-purple-700 block mb-0.5">Reviewer Feedback:</span>
                    <p className="text-slate-800">{item.reviewer_notes}</p>
                  </div>
                )}
              </div>

              {item.status === 'PENDING' && (
                <div className="pt-3 border-t border-slate-100 flex justify-end space-x-2">
                  <button
                    onClick={() => handleAction(item.id, 'REJECT')}
                    disabled={processingId === item.id}
                    className="px-4 py-2 rounded-xl border border-slate-200 text-red-600 hover:bg-red-50 text-xs font-semibold"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleAction(item.id, 'APPROVE')}
                    disabled={processingId === item.id}
                    className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow transition"
                  >
                    Approve & Confer Verified Status
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

