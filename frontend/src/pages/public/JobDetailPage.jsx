import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { 
  Building, 
  MapPin, 
  Briefcase, 
  ShieldCheck, 
  AlertTriangle, 
  Calendar, 
  DollarSign, 
  ArrowLeft, 
  CheckCircle, 
  Sparkles,
  FileText,
  X
} from 'lucide-react';

export default function JobDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isCandidate } = useAuth();

  const [job, setJob] = useState(null);
  const [matchData, setMatchData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Apply Modal state
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [applyStatus, setApplyStatus] = useState({ loading: false, success: null, error: null });

  useEffect(() => {
    async function loadJob() {
      setLoading(true);
      try {
        const jobData = await api.getJobDetail(id);
        setJob(jobData);

        if (isAuthenticated && isCandidate) {
          try {
            const mData = await api.getJobMatchDetail(id);
            setMatchData(mData);
            const rData = await api.getResumes();
            const rList = rData.results || rData;
            setResumes(rList);
            const primary = rList.find(r => r.is_primary);
            if (primary) setSelectedResumeId(primary.id);
            else if (rList.length > 0) setSelectedResumeId(rList[0].id);
          } catch (e) {
            console.error(e);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadJob();
  }, [id, isAuthenticated, isCandidate]);

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    setApplyStatus({ loading: true, success: null, error: null });
    try {
      await api.applyJob({
        job_id: Number(id),
        resume_id: selectedResumeId ? Number(selectedResumeId) : null,
        cover_letter: coverLetter
      });
      setApplyStatus({ loading: false, success: "Application submitted successfully!", error: null });
      setTimeout(() => {
        setShowApplyModal(false);
        navigate('/candidate/applications');
      }, 1500);
    } catch (err) {
      setApplyStatus({
        loading: false,
        success: null,
        error: err.data?.error || "Failed to submit application. You may have already applied."
      });
    }
  };

  if (loading) {
    return <div className="p-16 text-center text-xs text-slate-500">Loading vacancy specifications...</div>;
  }

  if (!job) {
    return (
      <div className="p-16 text-center space-y-4">
        <h2 className="text-base font-bold text-slate-800">Job listing not found or is closed.</h2>
        <Link to="/jobs" className="text-xs font-semibold text-blue-600 hover:underline">
          Return to Job Board
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        
        <Link
          to="/jobs"
          className="inline-flex items-center text-xs font-semibold text-slate-600 hover:text-blue-600 transition"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to All Jobs
        </Link>

        {/* Job Header Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700">
                  {job.company?.name}
                </span>
                {job.is_verified && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                    <ShieldCheck className="w-3 h-3 mr-1" /> Verified Employer
                  </span>
                )}
                {job.has_scam_warning && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                    <AlertTriangle className="w-3 h-3 mr-1" /> Scam Shield Alert
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
                {job.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                <span className="flex items-center">
                  <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" />
                  {job.location} ({job.work_mode?.toLowerCase()})
                </span>
                <span className="flex items-center">
                  <Briefcase className="w-3.5 h-3.5 mr-1 text-slate-400" />
                  {job.employment_type?.replace('_', ' ')}
                </span>
                {job.is_salary_disclosed && job.salary_min && (
                  <span className="font-bold text-slate-800">
                    ${Number(job.salary_min).toLocaleString()} - ${Number(job.salary_max).toLocaleString()}
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={() => {
                if (!isAuthenticated) {
                  alert("Please log in to apply for this job.");
                  return;
                }
                setShowApplyModal(true);
              }}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition shrink-0 self-start sm:self-auto"
            >
              Apply For This Position
            </button>
          </div>

          {job.has_scam_warning && (
            <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900">
              <strong>Scam Shield Advisory: </strong> {job.scam_warning_reason}
            </div>
          )}
        </div>

        {/* Explainable AI Match Preview if Candidate is Logged In */}
        {matchData && (
          <div className="bg-gradient-to-r from-blue-900 via-navy-900 to-teal-900 text-white p-6 sm:p-8 rounded-3xl shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-teal-400" />
                <h3 className="font-bold text-base">Your AI Match Compatibility</h3>
              </div>
              <span className="text-2xl font-extrabold text-teal-300">
                {matchData.match_score}% Match
              </span>
            </div>

            {matchData.reasons && matchData.reasons.length > 0 && (
              <div className="space-y-1 text-xs text-slate-200">
                {matchData.reasons.map((r, i) => (
                  <p key={i}>• {r}</p>
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-2">
              <div>
                <span className="text-teal-300 font-bold block mb-1">Matched Skills:</span>
                <div className="flex flex-wrap gap-1">
                  {matchData.matched_skills?.map(s => (
                    <span key={s} className="px-2 py-0.5 rounded bg-white/20 text-white text-[11px]">
                      ✓ {s}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-amber-300 font-bold block mb-1">Missing Target Skills:</span>
                <div className="flex flex-wrap gap-1">
                  {matchData.missing_required_skills?.length > 0 ? (
                    matchData.missing_required_skills.map(s => (
                      <span key={s} className="px-2 py-0.5 rounded bg-amber-400/20 text-amber-200 text-[11px]">
                        + {s}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-300">All required skills met!</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Job Body */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 text-xs text-slate-700 leading-relaxed">
          
          <div>
            <h3 className="font-bold text-sm text-navy-900 uppercase tracking-wider mb-2">Role Description</h3>
            <p className="whitespace-pre-line">{job.description}</p>
          </div>

          {job.responsibilities && (
            <div>
              <h3 className="font-bold text-sm text-navy-900 uppercase tracking-wider mb-2">Responsibilities</h3>
              <p className="whitespace-pre-line">{job.responsibilities}</p>
            </div>
          )}

          <div>
            <h3 className="font-bold text-sm text-navy-900 uppercase tracking-wider mb-2">Required Qualifications & Skills</h3>
            <div className="flex flex-wrap gap-2">
              {(job.required_skills || []).map(s => (
                <span key={s} className="px-3 py-1 rounded-xl bg-blue-50 text-blue-700 font-semibold text-xs">
                  {s}
                </span>
              ))}
            </div>
          </div>

          {job.preferred_skills && job.preferred_skills.length > 0 && (
            <div>
              <h3 className="font-bold text-sm text-navy-900 uppercase tracking-wider mb-2">Preferred / Bonus Skills</h3>
              <div className="flex flex-wrap gap-2">
                {job.preferred_skills.map(s => (
                  <span key={s} className="px-3 py-1 rounded-xl bg-teal-50 text-teal-700 font-semibold text-xs">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {job.company?.description && (
            <div className="pt-4 border-t border-slate-100">
              <h3 className="font-bold text-sm text-navy-900 uppercase tracking-wider mb-2">About {job.company?.name}</h3>
              <p className="whitespace-pre-line">{job.company.description}</p>
            </div>
          )}

        </div>

      </div>

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl relative text-xs">
            <button
              onClick={() => setShowApplyModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-navy-900 mb-1">
              Apply for {job.title}
            </h3>
            <p className="text-slate-500 mb-4">{job.company?.name}</p>

            {applyStatus.success && (
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl mb-4 font-medium">
                {applyStatus.success}
              </div>
            )}
            {applyStatus.error && (
              <div className="p-3 bg-red-50 text-red-800 rounded-xl mb-4 font-medium">
                {applyStatus.error}
              </div>
            )}

            <form onSubmit={handleApplySubmit} className="space-y-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Attach Resume</label>
                {resumes.length === 0 ? (
                  <div className="p-3 bg-amber-50 text-amber-800 rounded-xl">
                    No resume uploaded yet.{' '}
                    <Link to="/candidate/resumes" className="underline font-bold">Upload one now</Link>
                  </div>
                ) : (
                  <select
                    value={selectedResumeId}
                    onChange={(e) => setSelectedResumeId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 outline-none"
                  >
                    {resumes.map(r => (
                      <option key={r.id} value={r.id}>
                        {r.title} ({r.file_type.toUpperCase()}) {r.is_primary ? '— Primary' : ''}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Optional Note for Hiring Team</label>
                <textarea
                  rows={4}
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Summarize your key strengths and enthusiasm for this role..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 outline-none"
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={applyStatus.loading}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow transition disabled:opacity-50"
                >
                  {applyStatus.loading ? 'Submitting...' : 'Confirm Submission'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

