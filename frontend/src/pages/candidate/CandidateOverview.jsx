import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
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
  Bookmark
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
          api.getRecommendedJobs(3),
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

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-navy-900 via-navy-800 to-blue-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-800/60 text-blue-200 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>Target Role: {profile?.target_role || 'Software Engineer'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.full_name?.split(' ')[0] || 'Candidate'}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Your career cockpit: monitor application statuses, demonstrate in-demand skills, and inspect transparent job match scores.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            to="/ats-checker"
            className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-navy-950 font-bold text-xs shadow-md transition flex items-center"
          >
            <FileText className="w-4 h-4 mr-1.5" /> Scan Resume
          </Link>
          <Link
            to="/assessments"
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition flex items-center"
          >
            <Award className="w-4 h-4 mr-1.5" /> Take Quiz
          </Link>
        </div>
      </div>

      {/* Naukri/Unstop Style Profile Setup Callout Banner */}
      {profile && profile.completion_percentage < 85 && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 rounded-3xl p-5 sm:p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
              <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">
                Profile Setup ({profile.completion_percentage}% Completed)
              </span>
            </div>
            <h3 className="font-extrabold text-base text-navy-900">
              Complete your multi-step profile to unlock AI matching & recruiter visibility
            </h3>
            <p className="text-xs text-slate-600">
              Add your education, verified skills, and projects to increase your interview shortlist chances by 3.5x.
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <Link
              to="/candidate/setup-profile"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition flex items-center space-x-2"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Continue Profile Setup (9 Steps) &rarr;</span>
            </Link>
          </div>
        </div>
      )}

      {/* Real Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Metric 1: Readiness Score */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Job Readiness Score</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-4 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-navy-900">
              {readiness?.overall_readiness || 50}%
            </span>
            <span className="text-xs font-semibold text-emerald-600">Calculated</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3">
            <div 
              className="bg-emerald-500 h-1.5 rounded-full" 
              style={{ width: `${readiness?.overall_readiness || 50}%` }}
            ></div>
          </div>
          <Link to="/candidate/readiness" className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 mt-3 inline-flex items-center">
            Inspect component breakdown <ArrowRight className="w-3 h-3 ml-1" />
          </Link>
        </div>

        {/* Metric 2: Profile Completion */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Profile Completion</span>
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-4 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-navy-900">
              {profile?.completion_percentage || 20}%
            </span>
            <span className="text-xs text-slate-400 font-medium">of 100%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-3">
            <div 
              className="bg-blue-600 h-1.5 rounded-full" 
              style={{ width: `${profile?.completion_percentage || 20}%` }}
            ></div>
          </div>
          <Link to="/candidate/setup-profile" className="text-[11px] font-bold text-blue-600 hover:text-blue-800 mt-3 inline-flex items-center">
            Launch 9-Step Wizard <ArrowRight className="w-3 h-3 ml-1" />
          </Link>
        </div>

        {/* Metric 3: Active Applications */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Active Applications</span>
            <Briefcase className="w-4 h-4 text-purple-600" />
          </div>
          <div className="mt-4 flex items-baseline space-x-2">
            <span className="text-3xl font-extrabold text-navy-900">
              {applications.length}
            </span>
            <span className="text-xs text-slate-500 font-medium">Total Applied</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-3">
            {applications.filter(a => a.status === 'INTERVIEW').length} Interview invitation(s)
          </p>
          <Link to="/candidate/applications" className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 mt-3 inline-flex items-center">
            Track status progression <ArrowRight className="w-3 h-3 ml-1" />
          </Link>
        </div>

        {/* Metric 4: Latest Assessment Result */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span>Latest Assessment</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          {latestAttempt ? (
            <div className="mt-4">
              <span className="text-3xl font-extrabold text-navy-900">
                {latestAttempt.percentage}%
              </span>
              <span className={`text-xs font-bold ml-2 ${latestAttempt.passed ? 'text-emerald-600' : 'text-slate-500'}`}>
                {latestAttempt.passed ? 'Passed' : 'Completed'}
              </span>
              <p className="text-[11px] text-slate-500 truncate mt-1">
                {latestAttempt.assessment_title}
              </p>
            </div>
          ) : (
            <div className="mt-4">
              <span className="text-xl font-bold text-slate-400">None Yet</span>
              <p className="text-[11px] text-slate-500 mt-1">Prove competencies to employers</p>
            </div>
          )}
          <Link to="/assessments" className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 mt-3 inline-flex items-center">
            Explore tests catalog <ArrowRight className="w-3 h-3 ml-1" />
          </Link>
        </div>

      </div>

      {/* Main Two-Column Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recommended Jobs (Left 2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-navy-900">AI Recommended Roles for You</h2>
              <p className="text-xs text-slate-500">Ranked by skill and experience overlap</p>
            </div>
            <Link to="/candidate/recommended-jobs" className="text-xs font-semibold text-blue-600 hover:underline">
              View all matches
            </Link>
          </div>

          {recommendedJobs.length === 0 ? (
            <div className="p-8 bg-white rounded-2xl border border-slate-200 text-center">
              <Briefcase className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs text-slate-500">No active job matches found. Complete your profile skills to generate recommendations.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recommendedJobs.map(({ job, match }) => (
                <div key={job.id} className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-sm transition flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Link to={`/jobs/${job.id}`} className="font-bold text-sm text-navy-900 hover:text-blue-600">
                        {job.title}
                      </Link>
                      <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold text-[10px]">
                        {match.match_score}% Match
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 flex items-center">
                      <Building className="w-3.5 h-3.5 mr-1 text-slate-400" />
                      {job.company?.name} • {job.location} ({job.work_mode?.toLowerCase()})
                    </p>
                    <p className="text-[11px] text-slate-600 line-clamp-1">
                      {match.reasons?.[0]}
                    </p>
                  </div>

                  <Link
                    to={`/jobs/${job.id}`}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-700 font-semibold text-xs transition text-center shrink-0"
                  >
                    View Match
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Priority Next Steps / Roadmap Highlights (Right 1 col) */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-navy-900">Recommended Next Steps</h2>
          
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 text-xs">
            {readiness?.recommendations && readiness.recommendations.length > 0 ? (
              readiness.recommendations.map((rec, i) => (
                <div key={i} className="flex items-start space-x-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-slate-700 leading-relaxed font-medium">{rec}</span>
                </div>
              ))
            ) : (
              <p className="text-slate-500">Your profile and credentials are up to date!</p>
            )}

            <div className="pt-2">
              <Link
                to="/career-gps"
                className="w-full py-2.5 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 font-semibold flex items-center justify-center transition"
              >
                Open Career GPS Roadmap <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

