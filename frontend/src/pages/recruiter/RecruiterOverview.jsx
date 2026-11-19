import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import EmailSpamNotice from '../../components/common/EmailSpamNotice';
import { 
  Briefcase, 
  Users, 
  Clock, 
  CheckCircle, 
  Calendar, 
  Plus, 
  ArrowRight, 
  Building,
  ShieldCheck,
  AlertTriangle,
  Bot,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  FileText,
  Sparkles
} from 'lucide-react';

export default function RecruiterOverview() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [jobsData, appsData, compData] = await Promise.allSettled([
          api.getRecruiterJobs(),
          api.getRecruiterApplications(),
          api.getMyCompany()
        ]);

        if (jobsData.status === 'fulfilled') {
          const jList = jobsData.value.results || jobsData.value;
          setJobs(jList);
        }
        if (appsData.status === 'fulfilled') {
          const aList = appsData.value.results || appsData.value;
          setApplicants(aList);
        }
        if (compData.status === 'fulfilled') {
          setCompany(compData.value);
        }
      } catch (e) {
        console.error("Recruiter dashboard error:", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const activeJobs = jobs.filter(j => j.status === 'PUBLISHED');
  const draftJobs = jobs.filter(j => j.status === 'DRAFT');
  const closedJobs = jobs.filter(j => j.status === 'CLOSED');
  
  const pendingReview = applicants.filter(a => a.status === 'SUBMITTED' || a.status === 'UNDER_REVIEW');
  const shortlisted = applicants.filter(a => a.status === 'SHORTLISTED');
  const scheduledInterviews = applicants.filter(a => a.status === 'INTERVIEW');

  // Status Badge Helper
  const getStatusBadge = (status) => {
    switch (status) {
      case 'SUBMITTED':
        return <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold text-[10px] border border-blue-200">Submitted</span>;
      case 'UNDER_REVIEW':
        return <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 font-bold text-[10px] border border-amber-200">In Review</span>;
      case 'SHORTLISTED':
        return <span className="px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 font-bold text-[10px] border border-purple-200">Shortlisted</span>;
      case 'INTERVIEW':
        return <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-200">Interview</span>;
      case 'OFFERED':
        return <span className="px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 font-bold text-[10px] border border-teal-200">Offered</span>;
      case 'REJECTED':
        return <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-500 font-semibold text-[10px]">Archived</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold text-[10px]">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-[500px] flex flex-col items-center justify-center p-8 text-center space-y-3">
        <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-semibold text-slate-700">Loading Employer Cockpit...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6">
      
      {/* Friendly Email Delivery Notice */}
      <EmailSpamNotice />

      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-navy-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-800">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-800 text-teal-300 border border-slate-700">
              {company?.name || 'Your Company Workspace'}
            </span>
            {company?.is_verified ? (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-400 text-slate-950">
                <ShieldCheck className="w-3 h-3 mr-1" /> Verified Employer
              </span>
            ) : (
              <Link to="/recruiter/company" className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950 hover:bg-amber-300 transition">
                <AlertTriangle className="w-3 h-3 mr-1" /> Verification Pending &rarr;
              </Link>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Recruiter Cockpit
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Manage your verified talent pipeline, screen candidates with objective assessment scores, and leverage AI to draft rubrics and job specs.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5 shrink-0">
          <Link
            to="/recruiter/jobs/new"
            className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-md transition flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Post New Job</span>
          </Link>
          <Link
            to="/recruiter/assistant"
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition flex items-center space-x-1.5"
          >
            <Bot className="w-4 h-4 text-white" />
            <span>AI Recruiter Assistant</span>
          </Link>
        </div>
      </div>

      {/* CHUNK 3: Recruiter Account Approval Status Banner */}
      {user?.recruiter_status === 'PENDING' && (
        <div className="bg-amber-50 border border-amber-200 rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
              <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                Recruiter Registration Pending Administrator Review
              </span>
            </div>
            <h3 className="font-extrabold text-base text-slate-900">
              Your account is currently in limited verification status
            </h3>
            <p className="text-xs text-slate-600">
              Submit your company registration proof to accelerate review. You can prepare job drafts now, and live job publishing will automatically unlock once your account is approved.
            </p>
          </div>
          <Link
            to="/recruiter/company"
            className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm transition flex items-center space-x-1.5 shrink-0"
          >
            <Building className="w-4 h-4" />
            <span>Submit Verification Documents &rarr;</span>
          </Link>
        </div>
      )}

      {user?.recruiter_status === 'REJECTED' && (
        <div className="bg-rose-50 border border-rose-200 rounded-3xl p-5 sm:p-6 shadow-sm space-y-2">
          <div className="flex items-center space-x-2 text-rose-800 font-bold text-xs">
            <AlertTriangle className="w-4 h-4 text-rose-600" />
            <span>Registration Application Notice</span>
          </div>
          <p className="text-xs text-rose-700">
            <strong>Reason:</strong> {user?.recruiter_rejection_reason || "Registration documentation was insufficient."}
          </p>
          <Link
            to="/recruiter/company"
            className="inline-block text-xs font-bold text-rose-900 underline pt-1"
          >
            Update Corporate Info & Resubmit Verification
          </Link>
        </div>
      )}

      {/* CHUNK 6: Key Metrics Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Metric 1: Total Job Postings */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <span className="text-slate-500 text-xs font-medium">Total Job Postings</span>
          <p className="text-3xl font-extrabold text-slate-900 mt-2">{jobs.length}</p>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
            <span>{draftJobs.length} draft</span>
            <Link to="/recruiter/jobs" className="text-blue-600 font-semibold hover:underline">Manage</Link>
          </div>
        </div>

        {/* Metric 2: Active Openings */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <span className="text-slate-500 text-xs font-medium">Active Openings</span>
          <p className="text-3xl font-extrabold text-teal-600 mt-2">{activeJobs.length}</p>
          <span className="text-[11px] text-slate-400 mt-1">Live on job board</span>
        </div>

        {/* Metric 3: Total Applicants */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <span className="text-slate-500 text-xs font-medium">Total Applicants</span>
          <p className="text-3xl font-extrabold text-blue-600 mt-2">{applicants.length}</p>
          <span className="text-[11px] text-slate-400 mt-1">Across all postings</span>
        </div>

        {/* Metric 4: Shortlisted Candidates */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <span className="text-slate-500 text-xs font-medium">Shortlisted</span>
          <p className="text-3xl font-extrabold text-purple-600 mt-2">{shortlisted.length}</p>
          <span className="text-[11px] text-slate-400 mt-1">{pendingReview.length} pending review</span>
        </div>

        {/* Metric 5: Upcoming Interviews */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between col-span-2 lg:col-span-1">
          <span className="text-slate-500 text-xs font-medium">Scheduled Interviews</span>
          <p className="text-3xl font-extrabold text-emerald-600 mt-2">{scheduledInterviews.length}</p>
          <span className="text-[11px] text-slate-400 mt-1">Awaiting candidate meetings</span>
        </div>

      </div>

      {/* Quick AI Assistant Recruiter Feature Card */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-white border border-blue-200/80 rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Bot className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">
              AI Recruiter Studio
            </span>
          </div>
          <h3 className="font-extrabold text-base text-slate-900">
            Speed up candidate evaluation and job posting creation
          </h3>
          <p className="text-xs text-slate-600">
            Draft tailored technical interview rubrics, produce bias-free job descriptions, and benchmark candidate assessment scores.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <Link
            to="/recruiter/assistant"
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition flex items-center space-x-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Launch AI Assistant &rarr;</span>
          </Link>
        </div>
      </div>

      {/* Two Column Grid: Left (Recently Posted Jobs & Performance) + Right (Latest Applicants & Recommended Actions) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Recently Posted Jobs & Job Performance */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Recently Posted Jobs */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">Recently Posted Jobs & Performance</h2>
                <p className="text-xs text-slate-500">Inspect applicant flow and status for your job openings</p>
              </div>
              <Link to="/recruiter/jobs" className="text-xs font-semibold text-blue-600 hover:text-blue-800">
                View all ({jobs.length}) &rarr;
              </Link>
            </div>

            {jobs.length === 0 ? (
              <div className="p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-3">
                <Briefcase className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs font-semibold text-slate-700">No job postings created yet</p>
                <p className="text-xs text-slate-400">Post your first job opening to start receiving verified student and graduate applications.</p>
                <Link to="/recruiter/jobs/new" className="inline-block px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition">
                  Create Job Posting
                </Link>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-600">
                    <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-4">Role Title</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Location</th>
                        <th className="py-3 px-4 text-center">Applicants</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {jobs.slice(0, 5).map((job) => {
                        const jobAppCount = applicants.filter(a => a.job_id === job.id).length;
                        return (
                          <tr key={job.id} className="hover:bg-slate-50/60 transition">
                            <td className="py-3.5 px-4 font-bold text-slate-900">
                              <Link to={`/jobs/${job.id}`} className="hover:text-blue-600 transition">
                                {job.title}
                              </Link>
                              <span className="block text-[10px] text-slate-400 font-normal">
                                Posted on {new Date(job.created_at).toLocaleDateString()}
                              </span>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                job.status === 'PUBLISHED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                job.status === 'DRAFT' ? 'bg-slate-100 text-slate-600' :
                                'bg-rose-50 text-rose-700'
                              }`}>
                                {job.status}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 font-medium text-slate-700">
                              {job.location} ({job.work_mode?.toLowerCase()})
                            </td>
                            <td className="py-3.5 px-4 text-center">
                              <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-extrabold text-xs">
                                {jobAppCount}
                              </span>
                            </td>
                            <td className="py-3.5 px-4 text-right space-x-2">
                              <Link
                                to="/recruiter/applicants"
                                className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                              >
                                Review
                              </Link>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Latest Applicants Table */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">Latest Candidate Applications</h2>
                <p className="text-xs text-slate-500">Screen candidacies and update hiring status in real time</p>
              </div>
              <Link to="/recruiter/applicants" className="text-xs font-semibold text-blue-600 hover:text-blue-800">
                View all ({applicants.length}) &rarr;
              </Link>
            </div>

            {applicants.length === 0 ? (
              <div className="p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-2">
                <Users className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs font-semibold text-slate-700">No applicants received yet</p>
                <p className="text-xs text-slate-400">Ensure your jobs are set to Published and share them with prospective talent.</p>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-slate-600">
                    <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-4">Candidate</th>
                        <th className="py-3 px-4">Applied Job</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4">Applied Date</th>
                        <th className="py-3 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {applicants.slice(0, 6).map((app) => (
                        <tr key={app.id} className="hover:bg-slate-50/60 transition">
                          <td className="py-3.5 px-4 font-semibold text-slate-900">
                            {app.candidate_name}
                            <span className="block text-[10px] text-slate-400 font-normal">{app.candidate_email}</span>
                          </td>
                          <td className="py-3.5 px-4 font-medium text-slate-800">{app.job_title}</td>
                          <td className="py-3.5 px-4">
                            {getStatusBadge(app.status)}
                          </td>
                          <td className="py-3.5 px-4 text-slate-400">{new Date(app.applied_at).toLocaleDateString()}</td>
                          <td className="py-3.5 px-4 text-right">
                            <Link
                              to="/recruiter/applicants"
                              className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                            >
                              Screen Profile &rarr;
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Right 1 Col: Recommended Actions & Verification Status */}
        <div className="space-y-6">
          
          {/* Recommended Actions Card */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-slate-900">Recommended Recruiter Actions</h2>
            
            <div className="space-y-3 text-xs">
              
              {!company?.is_verified && (
                <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 space-y-1.5">
                  <div className="flex items-center space-x-1.5 text-amber-800 font-bold">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Complete Company Verification</span>
                  </div>
                  <p className="text-[11px] text-amber-700 leading-relaxed">
                    Submit company registration documentation to receive the Nexora Verified Employer trust badge.
                  </p>
                  <Link to="/recruiter/company" className="inline-block text-[11px] font-bold text-amber-900 hover:underline pt-0.5">
                    Verify Profile &rarr;
                  </Link>
                </div>
              )}

              {pendingReview.length > 0 && (
                <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 space-y-1.5">
                  <div className="flex items-center space-x-1.5 text-blue-800 font-bold">
                    <Clock className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Review {pendingReview.length} Pending Candidacies</span>
                  </div>
                  <p className="text-[11px] text-blue-700 leading-relaxed">
                    Shortlist or progress qualified candidates to scheduled interview rounds.
                  </p>
                  <Link to="/recruiter/applicants" className="inline-block text-[11px] font-bold text-blue-900 hover:underline pt-0.5">
                    Open Review Queue &rarr;
                  </Link>
                </div>
              )}

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="flex items-center space-x-1.5 text-slate-800 font-bold">
                  <Plus className="w-4 h-4 text-teal-600 shrink-0" />
                  <span>Publish New Open Positions</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Attract vetted freshers and graduates with transparent salary and skill expectations.
                </p>
                <Link to="/recruiter/jobs/new" className="inline-block text-[11px] font-bold text-slate-900 hover:underline pt-0.5">
                  Post a Job &rarr;
                </Link>
              </div>

            </div>
          </div>

          {/* Recruiter AI Prompts Shortcut */}
          <div className="bg-slate-900 p-5 sm:p-6 rounded-3xl text-white shadow-md space-y-4 border border-slate-800">
            <div className="flex items-center space-x-2">
              <Bot className="w-5 h-5 text-teal-400" />
              <h3 className="font-bold text-sm">AI Assistant Quick Tasks</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Ask the Nexora AI Assistant to instantly handle your hiring tasks:
            </p>
            <div className="space-y-2">
              <Link
                to="/recruiter/assistant"
                className="block p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-xs text-slate-200 hover:text-white border border-slate-700/60 transition"
              >
                &ldquo;Draft Job Description for Full Stack Engineer&rdquo;
              </Link>
              <Link
                to="/recruiter/assistant"
                className="block p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-xs text-slate-200 hover:text-white border border-slate-700/60 transition"
              >
                &ldquo;System Design Interview Rubric for Python&rdquo;
              </Link>
              <Link
                to="/recruiter/assistant"
                className="block p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-xs text-slate-200 hover:text-white border border-slate-700/60 transition"
              >
                &ldquo;Interview Invitation Email Template&rdquo;
              </Link>
            </div>
            <Link
              to="/recruiter/assistant"
              className="inline-flex items-center justify-center w-full py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition"
            >
              Open Full AI Workspace
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
}
