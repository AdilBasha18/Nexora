import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { 
  Search, 
  MapPin, 
  Briefcase, 
  ShieldCheck, 
  ShieldAlert, 
  Bookmark, 
  Check, 
  SlidersHorizontal, 
  Building, 
  DollarSign, 
  Clock, 
  Calendar,
  AlertTriangle,
  X,
  FileText
} from 'lucide-react';

export default function JobsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { isAuthenticated, isCandidate } = useAuth();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [workMode, setWorkMode] = useState(searchParams.get('work_mode') || '');
  const [experienceLevel, setExperienceLevel] = useState(searchParams.get('experience_level') || '');
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  // Modals
  const [selectedJob, setSelectedJob] = useState(null);
  const [applyModalJob, setApplyModalJob] = useState(null);
  const [reportModalJob, setReportModalJob] = useState(null);

  // Apply state
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [applyStatus, setApplyStatus] = useState({ loading: false, success: null, error: null });

  // Report state
  const [reportReason, setReportReason] = useState('PAYMENT_REQUEST');
  const [reportDetails, setReportDetails] = useState('');
  const [reportStatus, setReportStatus] = useState({ loading: false, success: null, error: null });

  // Saved state
  const [savedJobIds, setSavedJobIds] = useState(new Set());

  useEffect(() => {
    fetchJobs();
  }, [searchParams]);

  useEffect(() => {
    if (isAuthenticated && isCandidate) {
      loadCandidateData();
    }
  }, [isAuthenticated, isCandidate]);

  async function loadCandidateData() {
    try {
      const resumesData = await api.getResumes();
      const rList = resumesData.results || resumesData;
      setResumes(rList);
      const primary = rList.find(r => r.is_primary);
      if (primary) setSelectedResumeId(primary.id);
      else if (rList.length > 0) setSelectedResumeId(rList[0].id);

      const savedData = await api.getSavedJobs();
      const sList = savedData.results || savedData;
      setSavedJobIds(new Set(sList.map(s => s.job.id)));
    } catch (e) {
      console.error(e);
    }
  }

  async function fetchJobs() {
    setLoading(true);
    try {
      const q = new URLSearchParams();
      if (search) q.append('search', search);
      if (location) q.append('location', location);
      if (workMode) q.append('work_mode', workMode);
      if (experienceLevel) q.append('experience_level', experienceLevel);
      if (verifiedOnly) q.append('verified_only', 'true');

      const data = await api.getJobs(q.toString());
      setJobs(data.results || data);
    } catch (err) {
      console.error("Error fetching jobs:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (location) params.append('location', location);
    if (workMode) params.append('work_mode', workMode);
    if (experienceLevel) params.append('experience_level', experienceLevel);
    if (verifiedOnly) params.append('verified_only', 'true');
    setSearchParams(params);
  };

  const handleToggleSave = async (jobId) => {
    if (!isAuthenticated) {
      alert("Please log in to save jobs.");
      return;
    }
    try {
      const res = await api.toggleSaveJob(jobId);
      setSavedJobIds(prev => {
        const next = new Set(prev);
        if (res.saved) next.add(jobId);
        else next.delete(jobId);
        return next;
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleApplySubmit = async (e) => {
    e.preventDefault();
    setApplyStatus({ loading: true, success: null, error: null });
    try {
      await api.applyJob({
        job_id: applyModalJob.id,
        resume_id: selectedResumeId ? Number(selectedResumeId) : null,
        cover_letter: coverLetter
      });
      setApplyStatus({ loading: false, success: "Application submitted successfully!", error: null });
      setTimeout(() => {
        setApplyModalJob(null);
        setApplyStatus({ loading: false, success: null, error: null });
        setCoverLetter('');
      }, 1500);
    } catch (err) {
      setApplyStatus({ 
        loading: false, 
        success: null, 
        error: err.data?.error || "Failed to submit application. You may have already applied." 
      });
    }
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert("Please log in to report a job listing.");
      return;
    }
    setReportStatus({ loading: true, success: null, error: null });
    try {
      await api.reportJob({
        job: reportModalJob.id,
        reason: reportReason,
        details: reportDetails
      });
      setReportStatus({ loading: false, success: "Report submitted to moderation team for review.", error: null });
      setTimeout(() => {
        setReportModalJob(null);
        setReportStatus({ loading: false, success: null, error: null });
        setReportDetails('');
      }, 1500);
    } catch (err) {
      setReportStatus({ loading: false, success: null, error: "Failed to submit report." });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
            Explore Verified Job Opportunities
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Discover roles with transparent skill requirements, verified employer credentials, and Scam Shield protection.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 mb-8">
          <form onSubmit={handleFilterSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
            
            <div className="lg:col-span-4 relative flex items-center">
              <Search className="w-4 h-4 text-slate-400 absolute left-3" />
              <input
                type="text"
                placeholder="Search job title, skills..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="lg:col-span-3 relative flex items-center">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3" />
              <input
                type="text"
                placeholder="Location (city, country)..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="lg:col-span-2">
              <select
                value={workMode}
                onChange={(e) => setWorkMode(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">All Work Modes</option>
                <option value="REMOTE">Remote</option>
                <option value="HYBRID">Hybrid</option>
                <option value="ONSITE">Onsite</option>
              </select>
            </div>

            <div className="lg:col-span-2">
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">Any Experience</option>
                <option value="ENTRY">Entry Level</option>
                <option value="MID">Mid Level</option>
                <option value="SENIOR">Senior Level</option>
                <option value="LEAD">Lead / Staff</option>
              </select>
            </div>

            <div className="lg:col-span-1">
              <button
                type="submit"
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow transition"
              >
                Filter
              </button>
            </div>

          </form>

          {/* Toggle verified only */}
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
                className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4"
              />
              <span className="font-medium text-slate-700">Verified Employers Only</span>
            </label>
            <span className="text-slate-400 font-medium">
              Showing {jobs.length} open position{jobs.length === 1 ? '' : 's'}
            </span>
          </div>
        </div>

        {/* Jobs List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(n => (
              <div key={n} className="p-6 rounded-2xl border border-slate-200 bg-white animate-pulse h-36"></div>
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-slate-800">No matching jobs found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Try adjusting your search criteria or resetting filters to browse all verified vacancies.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => {
              const isSaved = savedJobIds.has(job.id);
              return (
                <div
                  key={job.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 
                        onClick={() => setSelectedJob(job)}
                        className="text-base font-bold text-navy-900 hover:text-blue-600 cursor-pointer transition"
                      >
                        {job.title}
                      </h3>
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

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center font-medium text-slate-700">
                        <Building className="w-3.5 h-3.5 mr-1 text-slate-400" />
                        {job.company?.name}
                      </span>
                      <span className="flex items-center">
                        <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" />
                        {job.location} ({job.work_mode?.toLowerCase()})
                      </span>
                      <span className="flex items-center">
                        <Briefcase className="w-3.5 h-3.5 mr-1 text-slate-400" />
                        {job.employment_type?.replace('_', ' ')}
                      </span>
                      {job.is_salary_disclosed && job.salary_min && (
                        <span className="font-semibold text-slate-800">
                          ${Number(job.salary_min).toLocaleString()} - ${Number(job.salary_max).toLocaleString()}
                        </span>
                      )}
                    </div>

                    {/* Scam warning banner if present */}
                    {job.has_scam_warning && (
                      <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
                        {job.scam_warning_reason}
                      </div>
                    )}

                    {/* Skill Pills */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {(job.required_skills || []).map(skill => (
                        <span key={skill} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2 shrink-0 self-end md:self-center">
                    <button
                      onClick={() => handleToggleSave(job.id)}
                      className={`p-2 rounded-xl border transition ${
                        isSaved 
                          ? 'border-blue-500 bg-blue-50 text-blue-600' 
                          : 'border-slate-200 hover:bg-slate-50 text-slate-500'
                      }`}
                      title={isSaved ? "Saved" : "Save job"}
                    >
                      <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                    </button>

                    <button
                      onClick={() => setSelectedJob(job)}
                      className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs transition"
                    >
                      Details
                    </button>

                    <button
                      onClick={() => {
                        if (!isAuthenticated) {
                          alert("Please log in as a candidate to apply.");
                          return;
                        }
                        setApplyModalJob(job);
                      }}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm transition"
                    >
                      Apply Now
                    </button>

                    <button
                      onClick={() => setReportModalJob(job)}
                      className="p-2 rounded-xl text-slate-400 hover:text-red-600 transition"
                      title="Report suspicious job to Scam Shield"
                    >
                      <ShieldAlert className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* 1. JOB DETAILS MODAL */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedJob(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-4">
              <div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                  {selectedJob.company?.name}
                </span>
                <h2 className="text-xl font-bold text-navy-900 mt-1">{selectedJob.title}</h2>
                <p className="text-xs text-slate-500 mt-1">
                  {selectedJob.location} • {selectedJob.work_mode} • {selectedJob.employment_type?.replace('_', ' ')}
                </p>
              </div>

              {selectedJob.has_scam_warning && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
                  <strong>Scam Shield Alert: </strong> {selectedJob.scam_warning_reason}
                </div>
              )}

              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Role Overview</h4>
                <p className="text-xs text-slate-600 whitespace-pre-line leading-relaxed">{selectedJob.description}</p>
              </div>

              {selectedJob.responsibilities && (
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Responsibilities</h4>
                  <p className="text-xs text-slate-600 whitespace-pre-line leading-relaxed">{selectedJob.responsibilities}</p>
                </div>
              )}

              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Required Skills</h4>
                <div className="flex flex-wrap gap-1.5">
                  {(selectedJob.required_skills || []).map(s => (
                    <span key={s} className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 text-xs font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {selectedJob.preferred_skills && selectedJob.preferred_skills.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Preferred Skills</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedJob.preferred_skills.map(s => (
                      <span key={s} className="px-2.5 py-1 rounded-lg bg-teal-50 text-teal-700 text-xs font-medium">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  onClick={() => {
                    setSelectedJob(null);
                    setApplyModalJob(selectedJob);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow transition"
                >
                  Apply For Role
                </button>
                <button
                  onClick={() => {
                    setSelectedJob(null);
                    setReportModalJob(selectedJob);
                  }}
                  className="text-xs text-slate-400 hover:text-red-600"
                >
                  Report this posting
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* 2. APPLY MODAL */}
      {applyModalJob && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setApplyModalJob(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-navy-900 mb-1">
              Apply for {applyModalJob.title}
            </h3>
            <p className="text-xs text-slate-500 mb-4">{applyModalJob.company?.name}</p>

            {applyStatus.success && (
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs mb-4">
                {applyStatus.success}
              </div>
            )}
            {applyStatus.error && (
              <div className="p-3 bg-red-50 text-red-800 rounded-xl text-xs mb-4">
                {applyStatus.error}
              </div>
            )}

            <form onSubmit={handleApplySubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Select Resume</label>
                {resumes.length === 0 ? (
                  <div className="p-3 bg-amber-50 text-amber-800 rounded-xl text-xs flex items-center justify-between">
                    <span>No resume uploaded yet.</span>
                    <Link to="/candidate/resumes" className="underline font-bold">Upload Resume</Link>
                  </div>
                ) : (
                  <select
                    value={selectedResumeId}
                    onChange={(e) => setSelectedResumeId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
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
                <label className="block font-semibold text-slate-700 mb-1">Cover Note (Optional)</label>
                <textarea
                  rows={4}
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Introduce yourself and explain why you're a great fit for this role..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setApplyModalJob(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={applyStatus.loading}
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow transition disabled:opacity-50"
                >
                  {applyStatus.loading ? 'Submitting...' : 'Confirm Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. SCAM SHIELD REPORT MODAL */}
      {reportModalJob && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setReportModalJob(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2 text-amber-600 mb-2">
              <ShieldAlert className="w-5 h-5" />
              <h3 className="font-bold text-base text-slate-900">Job Scam Shield Report</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Report suspicious behavior for: <strong>{reportModalJob.title}</strong> at {reportModalJob.company?.name}
            </p>

            {reportStatus.success && (
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs mb-4">
                {reportStatus.success}
              </div>
            )}
            {reportStatus.error && (
              <div className="p-3 bg-red-50 text-red-800 rounded-xl text-xs mb-4">
                {reportStatus.error}
              </div>
            )}

            <form onSubmit={handleReportSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Reason for Report</label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="PAYMENT_REQUEST">Asking for Money / Application Fees</option>
                  <option value="SUSPICIOUS_INFO">Requests Sensitive Banking / Personal Credentials</option>
                  <option value="MISLEADING">Misleading Compensation / Unrealistic Promises</option>
                  <option value="IMPERSONATION">Fake Recruiter / Impersonation</option>
                  <option value="OTHER">Other Suspicious Factor</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Specific Details</label>
                <textarea
                  required
                  rows={3}
                  value={reportDetails}
                  onChange={(e) => setReportDetails(e.target.value)}
                  placeholder="Explain what was requested or why this listing appears fraudulent..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setReportModalJob(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={reportStatus.loading}
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold shadow transition disabled:opacity-50"
                >
                  {reportStatus.loading ? 'Submitting...' : 'Submit Report'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

