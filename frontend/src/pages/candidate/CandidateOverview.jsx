import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import EmailSpamNotice from '../../components/common/EmailSpamNotice';
import { 
  TrendingUp, 
  FileText, 
  Briefcase, 
  Award, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  Building,
  Bookmark,
  Bot,
  Compass,
  Clock,
  ChevronRight,
  Check,
  Calendar,
  ExternalLink
} from 'lucide-react';

export default function CandidateOverview() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [readiness, setReadiness] = useState(null);
  const [applications, setApplications] = useState([]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [latestAttempt, setLatestAttempt] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [profData, readyData, appsData, recData, attemptsData] = await Promise.allSettled([
          api.getProfile(),
          api.getJobReadiness(),
          api.getMyApplications(),
          api.getRecommendedJobs(4),
          api.getMyAssessmentAttempts()
        ]);

        if (profData.status === 'fulfilled') setProfile(profData.value);
        if (readyData.status === 'fulfilled') setReadiness(readyData.value);
        if (appsData.status === 'fulfilled') {
          const aList = appsData.value.results || appsData.value;
          setApplications(aList);
        }
        if (recData.status === 'fulfilled') {
          const rList = recData.value.results || recData.value;
          setRecommendedJobs(rList);
        }
        if (attemptsData.status === 'fulfilled') {
          const attList = attemptsData.value.results || attemptsData.value;
          if (attList.length > 0) setLatestAttempt(attList[0]);
        }
      } catch (e) {
        console.error("Dashboard load error:", e);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, []);

  // Format Status Badge
  const getStatusBadge = (status) => {
    switch (status) {
      case 'SUBMITTED':
        return <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 font-bold text-[10px] border border-blue-200">Submitted</span>;
      case 'UNDER_REVIEW':
        return <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 font-bold text-[10px] border border-amber-200">Under Review</span>;
      case 'SHORTLISTED':
        return <span className="px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 font-bold text-[10px] border border-purple-200">Shortlisted</span>;
      case 'INTERVIEW':
        return <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-200 animate-pulse">Interview Scheduled</span>;
      case 'OFFERED':
        return <span className="px-2.5 py-1 rounded-full bg-teal-50 text-teal-800 font-bold text-[10px] border border-teal-200">Job Offered</span>;
      case 'REJECTED':
        return <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 font-semibold text-[10px]">Archived</span>;
      default:
        return <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-semibold text-[10px]">{status}</span>;
    }
  };

  const interviewCount = applications.filter(a => a.status === 'INTERVIEW').length;
  const underReviewCount = applications.filter(a => a.status === 'UNDER_REVIEW' || a.status === 'SHORTLISTED').length;

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-6">
      
      {/* Friendly Email Delivery Notice */}
      <EmailSpamNotice />

      {/* Top Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-navy-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 border border-slate-800">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-900/60 border border-blue-700/50 text-blue-200 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>Target Role: {profile?.target_role || readiness?.target_role?.title || 'Select Your Target Role'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.full_name ? user.full_name.split(' ')[0] : (user?.username || 'Candidate')}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Your career command center: track real applications, verify skills with coding sandbox benchmarks, and inspect transparent job match scores.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5 shrink-0">
          <Link
            to="/ats-checker"
            className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-md transition flex items-center space-x-1.5"
          >
            <FileText className="w-4 h-4" />
            <span>Scan Resume</span>
          </Link>
          <Link
            to="/assessments"
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition flex items-center space-x-1.5"
          >
            <Award className="w-4 h-4 text-blue-400" />
            <span>Take Quiz</span>
          </Link>
          <Link
            to="/assistant"
            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition flex items-center space-x-1.5"
          >
            <Bot className="w-4 h-4 text-white" />
            <span>AI Assistant</span>
          </Link>
        </div>
      </div>

      {/* Genuine Onboarding State Callout (Requirement 8) */}
      {(readiness?.is_calculated === false || !profile?.target_role || (profile && profile.completion_percentage < 100)) && (
        <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-white border border-blue-200/90 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping"></span>
                <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">
                  Candidate Onboarding Guide
                </span>
              </div>
              <h3 className="font-extrabold text-base text-slate-900">
                Welcome to Nexora! Complete your 4-step setup to unlock genuine career insights
              </h3>
              <p className="text-xs text-slate-600">
                Nexora never displays fabricated scores or assumed target roles. Follow these steps to generate verified career recommendations:
              </p>
            </div>
            <Link
              to="/candidate/setup-profile"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition flex items-center space-x-2 shrink-0 self-start md:self-center"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Complete Profile &rarr;</span>
            </Link>
          </div>

          {/* 4-Step Checklist Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
            <Link to="/candidate/setup-profile" className="p-3 bg-white rounded-xl border border-blue-100 hover:border-blue-300 transition flex items-start space-x-2.5">
              <span className={`w-5 h-5 rounded-full font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5 ${profile?.completion_percentage > 20 ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                1
              </span>
              <div>
                <p className="text-xs font-bold text-slate-900">Complete Profile</p>
                <p className="text-[11px] text-slate-500">Add education & verified skills</p>
              </div>
            </Link>

            <Link to="/ats-checker" className="p-3 bg-white rounded-xl border border-blue-100 hover:border-blue-300 transition flex items-start space-x-2.5">
              <span className="w-5 h-5 rounded-full font-bold text-[10px] bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                2
              </span>
              <div>
                <p className="text-xs font-bold text-slate-900">Upload Resume</p>
                <p className="text-[11px] text-slate-500">Scan & extract skills with ATS</p>
              </div>
            </Link>

            <Link to="/career-gps" className="p-3 bg-white rounded-xl border border-blue-100 hover:border-blue-300 transition flex items-start space-x-2.5">
              <span className={`w-5 h-5 rounded-full font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5 ${profile?.target_role ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
                3
              </span>
              <div>
                <p className="text-xs font-bold text-slate-900">Select Target Role</p>
                <p className="text-[11px] text-slate-500">{profile?.target_role || "Choose your career path"}</p>
              </div>
            </Link>

            <Link to="/assessments" className="p-3 bg-white rounded-xl border border-blue-100 hover:border-blue-300 transition flex items-start space-x-2.5">
              <span className="w-5 h-5 rounded-full font-bold text-[10px] bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                4
              </span>
              <div>
                <p className="text-xs font-bold text-slate-900">Take Assessment</p>
                <p className="text-[11px] text-slate-500">Benchmark code & domain skills</p>
              </div>
            </Link>
          </div>
        </div>
      )}

      {/* Profile Completion Wizard Callout Banner */}
      {false && profile && profile.completion_percentage < 100 && (
        <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-white border border-blue-200/90 rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping"></span>
              <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">
                Profile Setup ({profile.completion_percentage}% Completed)
              </span>
            </div>
            <h3 className="font-extrabold text-base text-slate-900">
              Complete your profile setup to unlock AI matching & recruiter visibility
            </h3>
            <p className="text-xs text-slate-600">
              Add your education, verified skills, and project links to increase recruiter shortlists by 3.5x.
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <Link
              to="/candidate/setup-profile"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition flex items-center space-x-2"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Launch 9-Step Wizard &rarr;</span>
            </Link>
          </div>
        </div>
      )}

      {/* Key Metric Cards Grid (CHUNK 4) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Metric 1: Readiness Score */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-slate-300 transition">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Job Readiness Score</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          {readiness?.is_calculated === false || (!readiness?.overall_readiness && readiness?.overall_readiness !== 0) ? (
            <div className="mt-3">
              <span className="text-lg font-bold text-slate-400">Not Available Yet</span>
              <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">Complete your profile to calculate</p>
            </div>
          ) : (
            <div className="mt-3 flex items-baseline space-x-2">
              <span className="text-3xl font-extrabold text-slate-900">
                {readiness?.overall_readiness}%
              </span>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                readiness?.overall_readiness >= 80 ? 'text-emerald-700 bg-emerald-50' :
                readiness?.overall_readiness >= 60 ? 'text-blue-700 bg-blue-50' :
                'text-amber-700 bg-amber-50'
              }`}>
                {readiness?.readiness_level || 'Developing'}
              </span>
            </div>
          )}
          {readiness?.is_calculated !== false && readiness?.overall_readiness != null && (
            <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3">
              <div 
                className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500" 
                style={{ width: `${readiness?.overall_readiness || 0}%` }}
              ></div>
            </div>
          )}
          <Link to="/candidate/readiness" className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 mt-3 inline-flex items-center">
            Inspect component breakdown <ArrowRight className="w-3 h-3 ml-1" />
          </Link>
        </div>

        {/* Metric 2: Profile Completion */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-slate-300 transition">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Profile Completion</span>
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-slate-900">
              {profile?.completion_percentage != null ? `${profile.completion_percentage}%` : '0%'}
            </span>
            <span className="text-xs text-slate-400 font-medium">of 100%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3">
            <div 
              className="bg-blue-600 h-1.5 rounded-full transition-all duration-500" 
              style={{ width: `${profile?.completion_percentage || 0}%` }}
            ></div>
          </div>
          <Link to="/candidate/setup-profile" className="text-[11px] font-bold text-blue-600 hover:text-blue-800 mt-3 inline-flex items-center">
            Update Profile Credentials <ArrowRight className="w-3 h-3 ml-1" />
          </Link>
        </div>

        {/* Metric 3: Active Applications */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-slate-300 transition">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Active Applications</span>
            <Briefcase className="w-4 h-4 text-purple-600" />
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-slate-900">
              {applications.length}
            </span>
            <span className="text-xs text-slate-500 font-medium">Total Applied</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            {interviewCount > 0 ? (
              <span className="text-emerald-700 font-semibold">{interviewCount} Interview scheduled</span>
            ) : underReviewCount > 0 ? (
              <span className="text-amber-700 font-medium">{underReviewCount} Under active review</span>
            ) : (
              <span>Applications logged on Nexora</span>
            )}
          </p>
          <Link to="/candidate/applications" className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 mt-3 inline-flex items-center">
            Track status progression <ArrowRight className="w-3 h-3 ml-1" />
          </Link>
        </div>

        {/* Metric 4: Latest Assessment Result */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:border-slate-300 transition">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Latest Assessment</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          {latestAttempt ? (
            <div className="mt-3">
              <div className="flex items-baseline space-x-2">
                <span className="text-3xl font-extrabold text-slate-900">
                  {latestAttempt.percentage}%
                </span>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                  latestAttempt.passed ? 'text-emerald-700 bg-emerald-50' : 'text-slate-600 bg-slate-100'
                }`}>
                  {latestAttempt.passed ? 'Passed' : 'Completed'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 truncate mt-1">
                {latestAttempt.assessment_title}
              </p>
            </div>
          ) : (
            <div className="mt-3">
              <span className="text-2xl font-bold text-slate-400">None Yet</span>
              <p className="text-[11px] text-slate-500 mt-1">Take 10-question tests to benchmark skills</p>
            </div>
          )}
          <Link to="/assessments" className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 mt-3 inline-flex items-center">
            Explore tests catalog <ArrowRight className="w-3 h-3 ml-1" />
          </Link>
        </div>

      </div>

      {/* Main Two-Column Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (2 Cols): Recommended Jobs + Application Status Tracker */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* AI Recommended Jobs Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">AI Recommended Roles for You</h2>
                <p className="text-xs text-slate-500">Ranked by verified skills, experience, and target role criteria</p>
              </div>
              <Link to="/candidate/recommended-jobs" className="text-xs font-semibold text-blue-600 hover:text-blue-800">
                View all matches &rarr;
              </Link>
            </div>

            {recommendedJobs.length === 0 ? (
              <div className="p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-2">
                <Briefcase className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs font-semibold text-slate-700">No Personalized Job Matches Yet</p>
                <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                  Complete your candidate profile, select your target role, or upload a resume to calculate actual matches against approved job openings.
                </p>
                <div className="pt-2">
                  <Link to="/candidate/setup-profile" className="inline-flex items-center px-4 py-2 rounded-xl bg-blue-50 text-blue-700 font-semibold text-xs hover:bg-blue-100 transition">
                    Complete Profile Setup &rarr;
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {recommendedJobs.map(({ job, match }) => (
                  <div key={job.id} className="p-4 sm:p-5 bg-white rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-sm transition flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center space-x-2">
                        <Link to={`/jobs/${job.id}`} className="font-bold text-sm text-slate-900 hover:text-blue-600 transition">
                          {job.title}
                        </Link>
                        <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-extrabold text-[10px] border border-blue-200">
                          {match.match_score}% Match
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 flex items-center">
                        <Building className="w-3.5 h-3.5 mr-1.5 text-slate-400 shrink-0" />
                        <span>{job.company?.name || 'Verified Tech Partner'}</span>
                        <span className="mx-1.5">•</span>
                        <span>{job.location} ({job.work_mode?.toLowerCase()})</span>
                      </p>
                      {match.reasons?.[0] && (
                        <p className="text-[11px] text-slate-600 line-clamp-1">
                          {match.reasons[0]}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <Link
                        to={`/jobs/${job.id}`}
                        className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-blue-600 text-white font-semibold text-xs transition text-center"
                      >
                        View Job
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Real Application Status Overview (CHUNK 4) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">Application Status Progression</h2>
                <p className="text-xs text-slate-500">Track candidate interview invitations and employer reviews</p>
              </div>
              <Link to="/candidate/applications" className="text-xs font-semibold text-blue-600 hover:text-blue-800">
                All Applications ({applications.length}) &rarr;
              </Link>
            </div>

            {applications.length === 0 ? (
              <div className="p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-3">
                <FileText className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs font-semibold text-slate-700">No applications submitted yet</p>
                <p className="text-xs text-slate-400">Discover verified positions in the jobs catalog and submit your first application.</p>
                <Link to="/jobs" className="inline-block px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold hover:bg-blue-700 transition">
                  Browse Active Jobs
                </Link>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="divide-y divide-slate-100">
                  {applications.slice(0, 5).map((app) => (
                    <div key={app.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/60 transition">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-bold text-sm text-slate-900">{app.job?.title || 'Engineering Role'}</h4>
                          {getStatusBadge(app.status)}
                        </div>
                        <p className="text-xs text-slate-500 flex items-center">
                          <Building className="w-3.5 h-3.5 mr-1 text-slate-400" />
                          <span>{app.job?.company?.name || 'Company'}</span>
                          <span className="mx-1.5">•</span>
                          <span>Applied on {new Date(app.applied_at).toLocaleDateString()}</span>
                        </p>
                        {app.interview_date && (
                          <div className="mt-1 flex items-center space-x-1.5 text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-lg w-fit border border-emerald-200">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>Interview: {new Date(app.interview_date).toLocaleString()}</span>
                          </div>
                        )}
                      </div>

                      <div className="shrink-0 flex items-center space-x-2">
                        <Link
                          to={`/jobs/${app.job?.id}`}
                          className="px-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-medium transition"
                        >
                          Job Spec
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Right Column (1 Col): Skills Portfolio + Learning Roadmap + AI Assistant */}
        <div className="space-y-6">
          
          {/* Demonstrated Skills vs Gaps */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">Skill Portfolio</h2>
              <Link to="/candidate/readiness" className="text-[11px] font-semibold text-blue-600 hover:underline">
                Readiness details
              </Link>
            </div>

            {/* Demonstrated Skills */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
                Demonstrated ({readiness?.demonstrated_skills?.length || 0})
              </span>
              <div className="flex flex-wrap gap-1.5">
                {readiness?.demonstrated_skills?.length > 0 ? (
                  readiness.demonstrated_skills.slice(0, 6).map((s, i) => (
                    <span key={i} className="inline-flex items-center px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-[11px] font-semibold border border-emerald-200">
                      <Check className="w-3 h-3 mr-1 text-emerald-600" /> {s}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400 italic">No skills demonstrated yet</span>
                )}
              </div>
            </div>

            {/* Priority Skill Gaps */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">
                Priority Gaps ({readiness?.skill_gaps?.length || 0})
              </span>
              <div className="flex flex-wrap gap-1.5">
                {readiness?.skill_gaps?.length > 0 ? (
                  readiness.skill_gaps.slice(0, 5).map((s, i) => (
                    <span key={i} className="inline-flex items-center px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 text-[11px] font-semibold border border-amber-200">
                      + {s}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-emerald-600 font-semibold">No skill gaps identified</span>
                )}
              </div>
            </div>
          </div>

          {/* Actionable Next Steps / Career GPS Roadmap */}
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">Next Learning Milestones</h2>
              <Compass className="w-4 h-4 text-purple-600" />
            </div>
            
            {readiness?.recommendations && readiness.recommendations.length > 0 ? (
              <div className="space-y-2 pt-1">
                {readiness.recommendations.slice(0, 3).map((rec, i) => (
                  <div key={i} className="flex items-start space-x-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                    <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span className="text-slate-700 leading-relaxed font-medium">{rec}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500">Your profile and credentials are fully aligned!</p>
            )}

            <div className="pt-2">
              <Link
                to="/career-gps"
                className="w-full py-2.5 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 font-semibold flex items-center justify-center transition"
              >
                Launch Career GPS Roadmap <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>
          </div>

          {/* AI Career Assistant Card */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-5 rounded-3xl text-white shadow-md space-y-3">
            <div className="flex items-center space-x-2">
              <Bot className="w-5 h-5 text-teal-300" />
              <h3 className="font-bold text-sm">Nexora AI Career Assistant</h3>
            </div>
            <p className="text-xs text-blue-100 leading-relaxed">
              Get personalized interview coaching, ATS resume feedback, and coding tips grounded in your live profile data.
            </p>
            <Link
              to="/assistant"
              className="inline-flex items-center justify-center w-full py-2.5 rounded-xl bg-white text-blue-900 font-bold text-xs hover:bg-blue-50 transition shadow-sm"
            >
              Start New Consultation &rarr;
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
}
