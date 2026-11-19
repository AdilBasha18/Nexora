import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { 
  Building2, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle, 
  ShieldCheck, 
  Mail, 
  Globe, 
  MapPin, 
  Search, 
  FileText,
  User,
  Filter
} from 'lucide-react';

export default function RecruiterApprovalsPage() {
  const [recruiters, setRecruiters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('PENDING');
  const [search, setSearch] = useState('');
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchRecruiters();
  }, [statusFilter]);

  async function fetchRecruiters() {
    setLoading(true);
    try {
      const data = await api.getAdminRecruiters(statusFilter === 'ALL' ? '' : statusFilter, search);
      setRecruiters(data.results || data);
    } catch (e) {
      console.error("Error fetching recruiters:", e);
    } finally {
      setLoading(false);
    }
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchRecruiters();
  };

  const handleAction = async (id, action) => {
    let reason = '';
    if (action === 'REJECT') {
      reason = prompt("Enter specific reason for rejecting this recruiter registration:");
      if (!reason) return;
    } else if (action === 'SUSPEND') {
      reason = prompt("Enter reason for suspending this account:");
      if (!reason) return;
    }

    setProcessingId(id);
    try {
      await api.actOnRecruiter(id, { action, reason });
      fetchRecruiters();
    } catch (e) {
      alert("Failed to process recruiter action.");
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusBadge = (status, isSuspended) => {
    if (isSuspended) {
      return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">Suspended</span>;
    }
    switch (status) {
      case 'PENDING':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">Pending Review</span>;
      case 'APPROVED':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">Approved</span>;
      case 'REJECTED':
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-200 text-slate-700">Rejected</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">{status}</span>;
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto space-y-6">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-semibold mb-2">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Employer Trust & Safety</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Recruiter Registration Approvals
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review corporate identities, business details, and authorize recruiters before they can publish job openings.
        </p>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Status Tabs */}
        <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
          {['PENDING', 'APPROVED', 'REJECTED', 'ALL'].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                statusFilter === tab
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {tab === 'PENDING' ? 'Pending Approval' : tab === 'APPROVED' ? 'Approved' : tab === 'REJECTED' ? 'Rejected' : 'All Accounts'}
            </button>
          ))}
        </div>

        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="flex items-center space-x-2 w-full sm:w-72">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by recruiter or company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
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

      {/* Recruiters Queue */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(n => (
            <div key={n} className="p-6 rounded-2xl bg-white border border-slate-200 animate-pulse h-32"></div>
          ))}
        </div>
      ) : recruiters.length === 0 ? (
        <div className="p-16 bg-white rounded-3xl border border-slate-200 text-center text-xs text-slate-500 space-y-2">
          <Building2 className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="font-semibold text-slate-700">No recruiters found</p>
          <p className="text-slate-400">There are no recruiter accounts matching the selected status.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {recruiters.map((r) => (
            <div
              key={r.id}
              className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 hover:border-slate-300 transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold text-base text-slate-900">{r.full_name}</h3>
                    {getStatusBadge(r.recruiter_status, r.is_suspended)}
                    {r.is_verified_recruiter && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200">
                        <ShieldCheck className="w-3 h-3 mr-1 text-teal-600" /> Verified Badge
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center">
                      <Mail className="w-3.5 h-3.5 mr-1 text-slate-400" />
                      {r.email}
                    </span>
                    <span>•</span>
                    <span className="flex items-center font-medium text-slate-700">
                      <Building2 className="w-3.5 h-3.5 mr-1 text-slate-400" />
                      {r.company?.name || 'Company Profile Missing'}
                    </span>
                    {r.company?.job_title && (
                      <>
                        <span>•</span>
                        <span>{r.company.job_title}</span>
                      </>
                    )}
                    <span>•</span>
                    <span>Registered: {new Date(r.created_at).toLocaleDateString()}</span>
                  </div>

                  {r.recruiter_rejection_reason && (
                    <div className="p-3 bg-red-50 rounded-xl border border-red-200 text-xs text-red-700">
                      <strong>Rejection Reason:</strong> {r.recruiter_rejection_reason}
                    </div>
                  )}

                  {/* Verification Docs If Submitted */}
                  {r.verification && (
                    <div className="mt-2 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
                      <p className="font-semibold text-slate-700">Company Registration Proof:</p>
                      <p className="text-slate-600">Reg No: <strong>{r.verification.business_reg_number}</strong> | Domain Email: <strong>{r.verification.official_domain_email}</strong></p>
                      {r.verification.notes && <p className="text-slate-500 italic">Notes: "{r.verification.notes}"</p>}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap sm:flex-col gap-2 shrink-0">
                  {r.recruiter_status === 'PENDING' && (
                    <>
                      <button
                        onClick={() => handleAction(r.id, 'APPROVE')}
                        disabled={processingId === r.id}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition flex items-center justify-center space-x-1.5"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Approve Recruiter</span>
                      </button>
                      <button
                        onClick={() => handleAction(r.id, 'REJECT')}
                        disabled={processingId === r.id}
                        className="px-4 py-2 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-700 rounded-xl text-xs font-semibold transition flex items-center justify-center space-x-1.5"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    </>
                  )}

                  {r.recruiter_status === 'APPROVED' && !r.is_suspended && (
                    <button
                      onClick={() => handleAction(r.id, 'SUSPEND')}
                      disabled={processingId === r.id}
                      className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-semibold transition"
                    >
                      Suspend Account
                    </button>
                  )}

                  {r.is_suspended && (
                    <button
                      onClick={() => handleAction(r.id, 'REACTIVATE')}
                      disabled={processingId === r.id}
                      className="px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl text-xs font-semibold transition"
                    >
                      Reactivate Account
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

