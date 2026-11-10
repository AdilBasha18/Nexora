import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { 
  Search, 
  MapPin, 
  Briefcase, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  FileText, 
  Compass, 
  Bot, 
  TrendingUp, 
  Bookmark, 
  Building, 
  Users, 
  ChevronRight,
  HelpCircle,
  ExternalLink,
  Award
} from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();
  const [searchTitle, setSearchTitle] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [searchWorkMode, setSearchWorkMode] = useState('');
  
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [careerResources, setCareerResources] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const jobsData = await api.getJobs();
        const results = jobsData.results || jobsData;
        setFeaturedJobs(results.slice(0, 4));

        const resData = await api.getCareerResources();
        const resResults = resData.results || resData;
        setCareerResources(resResults.slice(0, 4));
      } catch (err) {
        console.error("Error loading homepage data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTitle) params.append('search', searchTitle);
    if (searchLocation) params.append('location', searchLocation);
    if (searchWorkMode) params.append('work_mode', searchWorkMode);
    navigate(`/jobs?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      
      {/* C. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/70 via-white to-slate-50 pt-16 pb-20 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            
            {/* Tagline Pill */}
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-100/80 border border-blue-200 text-blue-800 text-xs font-semibold tracking-wide shadow-sm">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              <span>Your Next Career Starts Here</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-navy-900 tracking-tight leading-tight">
              Find the Right Job. <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-teal-600 to-navy-900">
                Prove Your Skills.
              </span> Build Your Future.
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Nexora helps you discover opportunities matching your verified abilities, optimize your resume for applicant tracking systems, identify skill gaps, and navigate your career path with explainable AI.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                to="/jobs"
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md hover:shadow-lg hover:shadow-blue-600/20 transition flex items-center"
              >
                Explore Jobs <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
              <Link
                to="/ats-checker"
                className="px-6 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-800 font-semibold text-sm border border-slate-300 shadow-sm transition flex items-center"
              >
                Check My Resume <FileText className="w-4 h-4 ml-2 text-teal-600" />
              </Link>
            </div>

            {/* Job Search Form */}
            <div className="pt-8">
              <form 
                onSubmit={handleSearch}
                className="bg-white p-3 rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-200 grid grid-cols-1 sm:grid-cols-12 gap-2 text-left"
              >
                <div className="sm:col-span-5 relative flex items-center">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3" />
                  <input
                    type="text"
                    value={searchTitle}
                    onChange={(e) => setSearchTitle(e.target.value)}
                    placeholder="Job title, skill (e.g. Python, React)"
                    className="w-full pl-9 pr-3 py-2.5 text-xs text-slate-800 rounded-xl bg-slate-50 hover:bg-slate-100/80 focus:bg-white focus:ring-2 focus:ring-blue-500 border border-slate-200 outline-none transition"
                  />
                </div>

                <div className="sm:col-span-3 relative flex items-center">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3" />
                  <input
                    type="text"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    placeholder="Location (e.g. Remote, NY)"
                    className="w-full pl-9 pr-3 py-2.5 text-xs text-slate-800 rounded-xl bg-slate-50 hover:bg-slate-100/80 focus:bg-white focus:ring-2 focus:ring-blue-500 border border-slate-200 outline-none transition"
                  />
                </div>

                <div className="sm:col-span-2 relative flex items-center">
                  <select
                    value={searchWorkMode}
                    onChange={(e) => setSearchWorkMode(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs text-slate-700 rounded-xl bg-slate-50 hover:bg-slate-100/80 focus:bg-white focus:ring-2 focus:ring-blue-500 border border-slate-200 outline-none transition"
                  >
                    <option value="">Any Mode</option>
                    <option value="REMOTE">Remote</option>
                    <option value="HYBRID">Hybrid</option>
                    <option value="ONSITE">Onsite</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 bg-navy-900 hover:bg-navy-800 text-white font-semibold text-xs rounded-xl shadow transition flex items-center justify-center"
                  >
                    Search
                  </button>
                </div>
              </form>
            </div>

          </div>
        </div>
      </section>

      {/* D. TRUST AND VALUE SECTION */}
      <section className="py-14 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 text-center">
            
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center">
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center mb-3">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="font-semibold text-xs text-slate-900">Skill-Based Match</h4>
              <p className="text-[11px] text-slate-500 mt-1">Calculated from verified abilities</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center">
              <div className="w-10 h-10 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center mb-3">
                <FileText className="w-5 h-5" />
              </div>
              <h4 className="font-semibold text-xs text-slate-900">ATS Resume Check</h4>
              <p className="text-[11px] text-slate-500 mt-1">Section and keyword feedback</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h4 className="font-semibold text-xs text-slate-900">Demonstrated Skills</h4>
              <p className="text-[11px] text-slate-500 mt-1">Server-graded assessments</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center">
              <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center mb-3">
                <Compass className="w-5 h-5" />
              </div>
              <h4 className="font-semibold text-xs text-slate-900">Career GPS</h4>
              <p className="text-[11px] text-slate-500 mt-1">Prioritized step-by-step roadmap</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center">
              <div className="w-10 h-10 rounded-lg bg-cyan-100 text-cyan-700 flex items-center justify-center mb-3">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h4 className="font-semibold text-xs text-slate-900">Application Tracking</h4>
              <p className="text-[11px] text-slate-500 mt-1">Live status audit trails</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center">
              <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center mb-3">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-semibold text-xs text-slate-900">Job Scam Shield</h4>
              <p className="text-[11px] text-slate-500 mt-1">Vetting and report monitoring</p>
            </div>

          </div>
        </div>
      </section>

      {/* E. HOW NEXORA WORKS */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-2">
              Structured Progression
            </h2>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-navy-900">
              How Nexora Powers Your Career
            </h3>
            <p className="text-sm text-slate-600 mt-2">
              A transparent four-step cycle from profile building to applying with proven competencies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            
            {/* Step 1 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative flex flex-col justify-between">
              <div>
                <span className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center mb-4">
                  01
                </span>
                <h4 className="font-bold text-sm text-slate-900 mb-2">
                  Create Profile & Upload Resume
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Extract your real skills, work experience, and educational background from PDF or DOCX format safely.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative flex flex-col justify-between">
              <div>
                <span className="w-8 h-8 rounded-full bg-teal-100 text-teal-700 font-bold text-xs flex items-center justify-center mb-4">
                  02
                </span>
                <h4 className="font-bold text-sm text-slate-900 mb-2">
                  Discover Jobs & Understand Match
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Inspect explainable match percentages showing exactly which required and preferred skills you satisfy.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative flex flex-col justify-between">
              <div>
                <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 font-bold text-xs flex items-center justify-center mb-4">
                  03
                </span>
                <h4 className="font-bold text-sm text-slate-900 mb-2">
                  Assess Skills & Bridge Gaps
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Take server-evaluated skill assessments, receive instant question explanations, and follow a career roadmap.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative flex flex-col justify-between">
              <div>
                <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs flex items-center justify-center mb-4">
                  04
                </span>
                <h4 className="font-bold text-sm text-slate-900 mb-2">
                  Apply & Track Applications
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Submit applications with tailored resumes, track status changes in real-time, and prepare for interviews.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* F. FEATURED JOBS SECTION */}
      <section className="py-20 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
            <div>
              <h2 className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-2">
                Live Opportunities
              </h2>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-navy-900">
                Featured Verified Job Openings
              </h3>
            </div>
            <Link
              to="/jobs"
              className="mt-4 sm:mt-0 inline-flex items-center text-xs font-semibold text-blue-600 hover:text-blue-800 transition"
            >
              Browse all listings <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="p-6 rounded-2xl border border-slate-200 bg-slate-50 animate-pulse h-48"></div>
              ))}
            </div>
          ) : featuredJobs.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
              <p className="text-sm text-slate-500">No active featured jobs found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-bold text-base text-navy-900 hover:text-blue-600 transition">
                            <Link to={`/jobs/${job.id}`}>{job.title}</Link>
                          </h4>
                          {job.is_verified && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-100 text-blue-800">
                              <ShieldCheck className="w-3 h-3 mr-1" /> Verified
                            </span>
                          )}
                        </div>
                        <p className="text-xs font-medium text-slate-600 mt-1 flex items-center">
                          <Building className="w-3.5 h-3.5 mr-1 text-slate-400" />
                          {job.company?.name}
                        </p>
                      </div>
                      
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 capitalize">
                        {job.work_mode?.toLowerCase()}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
                      {job.description}
                    </p>

                    {/* Required Skills tags */}
                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {(job.required_skills || []).slice(0, 4).map((skill) => (
                        <span
                          key={skill}
                          className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                      {(job.required_skills || []).length > 4 && (
                        <span className="text-[11px] text-slate-400 font-medium self-center">
                          +{(job.required_skills || []).length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div>
                      {job.is_salary_disclosed && job.salary_min ? (
                        <span className="font-bold text-slate-900">
                          ${Number(job.salary_min).toLocaleString()} - ${Number(job.salary_max).toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-slate-400">Competitive Salary</span>
                      )}
                      <span className="text-slate-400 block text-[11px] mt-0.5">{job.location}</span>
                    </div>

                    <Link
                      to={`/jobs/${job.id}`}
                      className="px-3.5 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white font-semibold transition"
                    >
                      View Role
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* G. CAREER TOOLS SECTION */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-teal-600 mb-2">
              Career Intelligence Suite
            </h2>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-navy-900">
              Interactive Tools Built for Real Progression
            </h3>
            <p className="text-sm text-slate-600 mt-2">
              Every tool operates on real inputs, algorithmic transparency, and zero paywalls.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Tool 1 */}
            <Link
              to="/ats-checker"
              className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-teal-400 hover:shadow-lg transition group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <FileText className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-base text-navy-900 mb-1 group-hover:text-teal-600 transition">
                  ATS Resume Checker
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Upload your PDF or DOCX resume to test parsing, keyword alignment, section completeness, and actionable formatting improvements.
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center text-xs font-semibold text-teal-600">
                Run Resume Analysis <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </Link>

            {/* Tool 2 */}
            <Link
              to="/assessments"
              className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-lg transition group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <Award className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-base text-navy-900 mb-1 group-hover:text-blue-600 transition">
                  Skill Assessments
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Demonstrate proficiency in Python, SQL, Web Dev, Aptitude, or Data Analysis with timed, auto-graded quizzes and detailed explanations.
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center text-xs font-semibold text-blue-600">
                Browse Assessments <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </Link>

            {/* Tool 3 */}
            <Link
              to="/career-gps"
              className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-purple-400 hover:shadow-lg transition group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <Compass className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-base text-navy-900 mb-1 group-hover:text-purple-600 transition">
                  Career GPS & Roadmaps
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Select your target role to generate a prioritized learning sequence with curated free documentation, tutorials, and milestone tracking.
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center text-xs font-semibold text-purple-600">
                Map Career Path <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </Link>

            {/* Tool 4 */}
            <Link
              to="/candidate/readiness"
              className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-emerald-400 hover:shadow-lg transition group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <TrendingUp className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-base text-navy-900 mb-1 group-hover:text-emerald-600 transition">
                  Job Readiness Score
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Transparent breakdown calculating skill coverage (40%), assessments (25%), resume alignment (20%), and portfolio projects (15%).
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center text-xs font-semibold text-emerald-600">
                View Readiness Breakdown <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </Link>

            {/* Tool 5 */}
            <Link
              to="/assistant"
              className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-cyan-400 hover:shadow-lg transition group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <Bot className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-base text-navy-900 mb-1 group-hover:text-cyan-600 transition">
                  RAG AI Career Assistant
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Ask questions regarding interview techniques, system design, resume revisions, and career roadmaps with grounded source citations.
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center text-xs font-semibold text-cyan-600">
                Start Consultation <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </Link>

            {/* Tool 6 */}
            <Link
              to="/jobs"
              className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-lg transition group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <Briefcase className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-base text-navy-900 mb-1 group-hover:text-blue-600 transition">
                  Explainable Job Matching
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  See exactly why jobs match your profile, with clear separation of required versus preferred qualifications and experience levels.
                </p>
              </div>
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center text-xs font-semibold text-blue-600">
                View Job Matches <ChevronRight className="w-4 h-4 ml-1" />
              </div>
            </Link>

          </div>
        </div>
      </section>

      {/* H. CANDIDATE AND RECRUITER VALUE PROPOSITIONS */}
      <section className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* For Candidates */}
            <div className="bg-gradient-to-br from-blue-900 to-navy-900 text-white p-8 rounded-3xl shadow-lg relative overflow-hidden flex flex-col justify-between">
              <div>
                <span className="px-3 py-1 rounded-full bg-blue-700/60 text-blue-200 text-xs font-semibold">
                  For Job Seekers
                </span>
                <h3 className="text-2xl font-extrabold mt-4 mb-3">
                  Discover Opportunities Where You Fit Best
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed mb-6">
                  Skip the black-box application black hole. Get clear feedback on how your resume aligns with job listings, prove your skills through verified assessments, and track every stage of your applications.
                </p>
                <ul className="space-y-2 text-xs text-slate-200 mb-8">
                  <li className="flex items-center">
                    <CheckCircle2 className="w-4 h-4 mr-2 text-teal-400" />
                    Free ATS Compatibility Scanner
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="w-4 h-4 mr-2 text-teal-400" />
                    Objective skill assessments with instant explanations
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="w-4 h-4 mr-2 text-teal-400" />
                    Targeted Career GPS roadmaps with free documentation
                  </li>
                </ul>
              </div>
              <Link
                to="/register"
                className="px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-600 text-navy-950 font-bold text-xs text-center transition shadow-md"
              >
                Create Free Candidate Account
              </Link>
            </div>

            {/* For Recruiters */}
            <div className="bg-gradient-to-br from-slate-900 to-navy-800 text-white p-8 rounded-3xl shadow-lg relative overflow-hidden flex flex-col justify-between">
              <div>
                <span className="px-3 py-1 rounded-full bg-slate-700/60 text-slate-200 text-xs font-semibold">
                  For Employers & Recruiters
                </span>
                <h3 className="text-2xl font-extrabold mt-4 mb-3">
                  Hire Candidates on Verified Capability
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed mb-6">
                  Post openings with structured skill criteria, evaluate demonstrated assessment scores, schedule interviews directly, and gain company verification badges that job seekers trust.
                </p>
                <ul className="space-y-2 text-xs text-slate-200 mb-8">
                  <li className="flex items-center">
                    <CheckCircle2 className="w-4 h-4 mr-2 text-blue-400" />
                    Verified employer badge for verified companies
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="w-4 h-4 mr-2 text-blue-400" />
                    Filter applicants by demonstrated assessment results
                  </li>
                  <li className="flex items-center">
                    <CheckCircle2 className="w-4 h-4 mr-2 text-blue-400" />
                    Automated Scam Shield security protection
                  </li>
                </ul>
              </div>
              <Link
                to="/for-employers"
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs text-center transition shadow-md"
              >
                Employer Portal & Job Posting
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* I. CAREER RESOURCES SECTION */}
      <section className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-2">
              Curated Knowledge
            </h2>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-navy-900">
              Free Career Guides & Interview Roadmaps
            </h3>
            <p className="text-sm text-slate-600 mt-2">
              Real guides designed to prepare you for technical challenges and compensation negotiations.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {careerResources.map((res) => (
              <div
                key={res.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">
                    {res.category?.replace('_', ' ')}
                  </span>
                  <h4 className="font-bold text-sm text-slate-900 mt-3 mb-2 leading-snug">
                    {res.title}
                  </h4>
                  <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                    {res.description}
                  </p>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">{res.reading_time}</span>
                  <a
                    href={res.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:text-blue-800 font-semibold inline-flex items-center"
                  >
                    Read Guide <ExternalLink className="w-3 h-3 ml-1" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* J. FREQUENTLY ASKED QUESTIONS */}
      <section className="py-20 bg-white border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-2">
              Transparency & FAQ
            </h2>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-navy-900">
              Frequently Asked Questions
            </h3>
            <p className="text-sm text-slate-600 mt-2">
              Clear, honest answers about how Nexora's AI and verification systems operate.
            </p>
          </div>

          <div className="space-y-4">
            
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50">
              <h4 className="font-bold text-sm text-slate-900 mb-2">
                How does Nexora calculate job matches and ATS compatibility scores?
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Nexora uses transparent, rule-based algorithms. For jobs, it calculates alignment across required skills (50%), preferred skills (20%), experience (15%), and work mode (15%). For resumes, our ATS checker scans standard section headers, keyword densities, and formatting factors to provide an estimate benchmark. We do not claim our score represents any single proprietary corporate ATS filter.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50">
              <h4 className="font-bold text-sm text-slate-900 mb-2">
                Does Nexora guarantee employment or interviews?
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                No. Nexora does not guarantee employment, interviews, or hiring outcomes. All scores, roadmaps, and readiness indicators are educational development estimates designed to help you prepare your credentials and skills.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50">
              <h4 className="font-bold text-sm text-slate-900 mb-2">
                How are recruiters and companies verified?
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Recruiters submit business registration details, corporate domain emails, and supporting documentation. Platform administrators inspect these credentials manually before conferring the Verified Employer badge.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50">
              <h4 className="font-bold text-sm text-slate-900 mb-2">
                What can the RAG AI Career Assistant answer?
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                The AI assistant answers questions about ATS resume guidelines, technical interview strategies (STAR method, system design), and career roadmaps. Answers are grounded in Nexora’s verified career knowledge documents with citations. When information is unavailable, the assistant transparently clarifies that the knowledge base lacks sufficient data rather than hallucinating.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50">
              <h4 className="font-bold text-sm text-slate-900 mb-2">
                How does Job Scam Shield protect applicants?
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Our Job Scam Shield actively scans job descriptions for common scam indicators (e.g. upfront payment requests, crypto payments, unofficial communication channels like Telegram-only). Job seekers can also file moderation reports with one click.
              </p>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}

