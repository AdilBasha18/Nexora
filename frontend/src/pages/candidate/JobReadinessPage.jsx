import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { 
  TrendingUp, 
  Award, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  Search,
  X,
  Briefcase,
  Check,
  ChevronRight,
  Info,
  Layers,
  UserCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function JobReadinessPage() {
  const [readiness, setReadiness] = useState(null);
  const [targetRoles, setTargetRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingRole, setUpdatingRole] = useState(false);
  const [successToast, setSuccessToast] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const [readyData, rolesData] = await Promise.allSettled([
        api.getJobReadiness(),
        api.getTargetRoles()
      ]);

      if (readyData.status === 'fulfilled') setReadiness(readyData.value);
      if (rolesData.status === 'fulfilled') {
        const list = rolesData.value.results || rolesData.value;
        setTargetRoles(list);
      }
    } catch (e) {
      console.error("Error loading readiness data:", e);
    } finally {
      setLoading(false);
    }
  }

  async function handleSelectRole(role) {
    setUpdatingRole(true);
    try {
      const updated = await api.setTargetRole(role.id);
      setReadiness(updated);
      setModalOpen(false);
      setSuccessToast(`Target role successfully updated to "${role.title}"!`);
      setTimeout(() => setSuccessToast(''), 4000);
    } catch (e) {
      console.error("Failed to update target role:", e);
    } finally {
      setUpdatingRole(false);
    }
  }

  const filteredRoles = targetRoles.filter(r => {
    const q = searchQuery.toLowerCase();
    const titleMatch = r.title.toLowerCase().includes(q);
    const skillMatch = (r.required_skills || []).some(s => s.toLowerCase().includes(q));
    return titleMatch || skillMatch;
  });

  if (loading) {
    return (
      <div className="min-h-[500px] flex flex-col items-center justify-center p-8 text-center space-y-3">
        <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-semibold text-slate-700">Calculating Job Readiness Index...</p>
        <p className="text-xs text-slate-400">Benchmarking verified skills, assessments, and resume evidence</p>
      </div>
    );
  }

  if (!readiness) {
    return (
      <div className="p-16 text-center max-w-md mx-auto space-y-4">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto" />
        <h2 className="text-lg font-bold text-slate-900">Readiness Score Unavailable</h2>
        <p className="text-xs text-slate-500">We could not calculate your job readiness. Please ensure you have configured your candidate profile.</p>
        <button onClick={loadData} className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold">
          Retry
        </button>
      </div>
    );
  }

  const breakdown = readiness.component_breakdown || {
    skills: { score: readiness.component_scores?.skill_coverage || 0, weight: 30, label: "Skills Match" },
    assessments: { score: readiness.component_scores?.assessment_demonstration || 0, weight: 25, label: "Skill Assessments" },
    resume: { score: readiness.component_scores?.resume_alignment || 0, weight: 25, label: "Resume ATS Alignment" },
    profile: { score: readiness.component_scores?.experience_and_projects || 0, weight: 20, label: "Profile & Experience" }
  };

  const levelColor = 
    readiness.overall_readiness >= 80 ? 'text-emerald-700 bg-emerald-50 border-emerald-200' :
    readiness.overall_readiness >= 60 ? 'text-blue-700 bg-blue-50 border-blue-200' :
    'text-amber-700 bg-amber-50 border-amber-200';

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto space-y-8">
      
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center space-x-3 text-xs font-medium animate-in fade-in slide-in-from-bottom-3">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Header with Title and "Change Target Role" Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200/60 text-blue-800 text-xs font-semibold mb-2">
            <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
            <span>Developmental Benchmark</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Job Readiness Score
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            An explainable, multi-factor benchmark evaluating your fit for <strong className="text-slate-800">{readiness.target_role?.title}</strong>.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 text-xs font-bold shadow-sm hover:border-slate-400 transition shrink-0"
        >
          <Briefcase className="w-3.5 h-3.5 text-blue-600" />
          <span>Change Target Role</span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        </button>
      </div>

      {/* Main Score Hero Card */}
      <div className="bg-gradient-to-br from-slate-900 via-navy-900 to-slate-900 p-6 sm:p-8 rounded-3xl text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-8 border border-slate-800">
        
        <div className="space-y-4 max-w-xl">
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-bold text-teal-400 uppercase tracking-wider bg-teal-950/70 px-3 py-1 rounded-full border border-teal-800/60">
              Target Role
            </span>
            <span className="text-sm font-semibold text-slate-200">
              {readiness.target_role?.title}
            </span>
          </div>

          <div className="flex items-baseline space-x-4">
            <span className="text-5xl sm:text-6xl font-black tracking-tight text-white">
              {readiness.overall_readiness}%
            </span>
            <div className="space-y-0.5">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${levelColor}`}>
                {readiness.readiness_level || (readiness.overall_readiness >= 80 ? 'High Readiness' : readiness.overall_readiness >= 60 ? 'Moderate Readiness' : 'Developing Readiness')}
              </span>
              <p className="text-xs text-slate-400">Weighted evaluation across 4 verified dimensions</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
            <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/60">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Market Demand</span>
              <span className="text-sm font-extrabold text-teal-300 mt-0.5 block">{readiness.target_role?.market_demand || 'High'}</span>
            </div>
            <div className="bg-slate-800/80 rounded-xl p-3 border border-slate-700/60">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Average Compensation</span>
              <span className="text-sm font-extrabold text-teal-300 mt-0.5 block">{readiness.target_role?.average_salary || readiness.target_role?.salary_range || '₹10,00,000 - ₹20,00,000 per annum'}</span>
            </div>
          </div>
        </div>

        {/* Action CTAs */}
        <div className="flex flex-col gap-2.5 shrink-0 w-full md:w-60">
          <Link
            to="/ats-checker"
            className="w-full px-4 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-lg transition flex items-center justify-center space-x-2"
          >
            <FileText className="w-4 h-4" />
            <span>Optimize ATS Resume</span>
          </Link>
          <Link
            to="/assessments"
            className="w-full px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition flex items-center justify-center space-x-2"
          >
            <Award className="w-4 h-4 text-blue-400" />
            <span>Take Skill Assessments</span>
          </Link>
          <Link
            to="/career-gps"
            className="w-full px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-medium text-xs border border-white/10 transition flex items-center justify-center space-x-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Open Career GPS Roadmap</span>
          </Link>
        </div>
      </div>

      {/* CHUNK 5: 4 Component Breakdown (Skills 30%, Assessments 25%, Resume 25%, Profile 20%) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">Component Breakdown (100% Total)</h2>
            <p className="text-xs text-slate-500">Transparent scoring formula powered by real profile, test, and ATS records</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Component 1: Skills Coverage (30%) */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-blue-600 uppercase tracking-wider text-[10px]">Skills Match</span>
                <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 font-bold text-[10px]">Weight: 30%</span>
              </div>
              <h3 className="font-bold text-sm text-slate-900 mt-2">Required Skills Coverage</h3>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                Overlap of candidate verified skills against essential target role prerequisites.
              </p>
            </div>
            <div>
              <div className="flex items-baseline justify-between mb-1">
                <span className="text-2xl font-black text-slate-900">{breakdown.skills?.score || 0}%</span>
                <span className="text-[10px] text-slate-400 font-medium">Contributes {Math.round((breakdown.skills?.score || 0) * 0.3)} pts</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${breakdown.skills?.score || 0}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Component 2: Skill Assessments (25%) */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-teal-600 uppercase tracking-wider text-[10px]">Technical Proof</span>
                <span className="px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 font-bold text-[10px]">Weight: 25%</span>
              </div>
              <h3 className="font-bold text-sm text-slate-900 mt-2">Skill Assessments</h3>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                Average score achieved across verified MCQ benchmarks and code sandbox tests.
              </p>
            </div>
            <div>
              <div className="flex items-baseline justify-between mb-1">
                <span className="text-2xl font-black text-slate-900">{breakdown.assessments?.score || 0}%</span>
                <span className="text-[10px] text-slate-400 font-medium">Contributes {Math.round((breakdown.assessments?.score || 0) * 0.25)} pts</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div 
                  className="bg-teal-600 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${breakdown.assessments?.score || 0}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Component 3: Resume ATS Alignment (25%) */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-purple-600 uppercase tracking-wider text-[10px]">Resume Strength</span>
                <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 font-bold text-[10px]">Weight: 25%</span>
              </div>
              <h3 className="font-bold text-sm text-slate-900 mt-2">Resume ATS Alignment</h3>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                Latest ATS parsing score, structural integrity, and quantitative bullet proof.
              </p>
            </div>
            <div>
              <div className="flex items-baseline justify-between mb-1">
                <span className="text-2xl font-black text-slate-900">{breakdown.resume?.score || 0}%</span>
                <span className="text-[10px] text-slate-400 font-medium">Contributes {Math.round((breakdown.resume?.score || 0) * 0.25)} pts</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div 
                  className="bg-purple-600 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${breakdown.resume?.score || 0}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Component 4: Profile & Experience (20%) */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-3">
            <div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-amber-600 uppercase tracking-wider text-[10px]">Completeness</span>
                <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-bold text-[10px]">Weight: 20%</span>
              </div>
              <h3 className="font-bold text-sm text-slate-900 mt-2">Profile & Projects</h3>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                Documented portfolio projects, education, verified certifications, and work history.
              </p>
            </div>
            <div>
              <div className="flex items-baseline justify-between mb-1">
                <span className="text-2xl font-black text-slate-900">{breakdown.profile?.score || 0}%</span>
                <span className="text-[10px] text-slate-400 font-medium">Contributes {Math.round((breakdown.profile?.score || 0) * 0.20)} pts</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div 
                  className="bg-amber-500 h-2 rounded-full transition-all duration-500" 
                  style={{ width: `${breakdown.profile?.score || 0}%` }}
                ></div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Demonstrated Strengths vs. Priority Gaps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Demonstrated Strengths */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center space-x-2.5 text-emerald-700">
            <CheckCircle className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-sm text-slate-900">Demonstrated Strengths</h3>
          </div>
          <p className="text-xs text-slate-500">
            Skills you have verified via profile tags, passed assessments, or extracted from your resume:
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {readiness.demonstrated_skills?.length > 0 ? (
              readiness.demonstrated_skills.map((s, idx) => (
                <span key={idx} className="inline-flex items-center px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 font-semibold text-xs border border-emerald-200">
                  <Check className="w-3 h-3 mr-1 text-emerald-600" /> {s}
                </span>
              ))
            ) : (
              <p className="text-xs text-slate-400 italic">No skills demonstrated yet. Update your profile skills or take an assessment.</p>
            )}
          </div>
        </div>

        {/* Priority Skill Gaps */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center space-x-2.5 text-amber-700">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <h3 className="font-bold text-sm text-slate-900">Priority Skill Gaps</h3>
          </div>
          <p className="text-xs text-slate-500">
            Core skills required for <strong className="text-slate-800">{readiness.target_role?.title}</strong> that are not yet demonstrated:
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {readiness.skill_gaps?.length > 0 ? (
              readiness.skill_gaps.map((s, idx) => (
                <span key={idx} className="inline-flex items-center px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 font-semibold text-xs border border-amber-200">
                  + {s}
                </span>
              ))
            ) : (
              <p className="text-xs text-emerald-700 font-semibold flex items-center">
                <CheckCircle className="w-4 h-4 mr-1 text-emerald-600" /> You meet all core prerequisite skills for this role!
              </p>
            )}
          </div>
        </div>

      </div>

      {/* Action Plan */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-slate-900">
            <Sparkles className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-sm">Action Plan to Boost Readiness</h3>
          </div>
          <Link to="/career-gps" className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center">
            View full roadmap <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {readiness.recommendations?.map((rec, i) => (
            <div key={i} className="flex items-start space-x-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                {i + 1}
              </span>
              <span className="text-slate-700 font-medium leading-relaxed">{rec}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Transparency Notice */}
      <div className="p-4 bg-slate-100 rounded-2xl text-[11px] text-slate-500 leading-relaxed border border-slate-200 flex items-start space-x-2">
        <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-700">Transparency Notice: </strong>
          {readiness.disclaimer || "The Job Readiness Score is an estimated developmental benchmark. It combines your self-reported profile, assessments, and resume alignment to guide your preparation, and does not predict employer hiring decisions."}
        </div>
      </div>

      {/* Searchable "Change Target Role" Modal (25+ roles) */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">Select Your Target Career Role</h3>
                <p className="text-xs text-slate-500 mt-0.5">Choose from 25+ industry roles to recalculate readiness benchmark</p>
              </div>
              <button 
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Input */}
            <div className="p-4 border-b border-slate-100 bg-slate-50">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by role title (e.g. 'Full Stack', 'Cloud', 'Data') or skill (e.g. 'Python', 'React')..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition"
                  autoFocus
                />
              </div>
            </div>

            {/* Roles List */}
            <div className="overflow-y-auto p-4 space-y-2.5 flex-1">
              {updatingRole ? (
                <div className="p-12 text-center text-xs text-slate-500 space-y-2">
                  <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <p>Recalculating Job Readiness Index...</p>
                </div>
              ) : filteredRoles.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500">
                  No roles matching "{searchQuery}". Try another keyword.
                </div>
              ) : (
                filteredRoles.map((role) => {
                  const isCurrent = readiness.target_role?.id === role.id;
                  return (
                    <div
                      key={role.id}
                      onClick={() => !isCurrent && handleSelectRole(role)}
                      className={`p-4 rounded-2xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        isCurrent 
                          ? 'bg-blue-50/60 border-blue-300 cursor-default' 
                          : 'bg-white border-slate-200 hover:border-blue-400 hover:bg-slate-50 cursor-pointer shadow-sm'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-bold text-sm text-slate-900">{role.title}</h4>
                          {isCurrent && (
                            <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white font-bold text-[10px]">
                              Current Target
                            </span>
                          )}
                        </div>
                        <div className="flex items-center space-x-3 text-[11px] text-slate-500">
                          <span>Demand: <strong className="text-slate-700">{role.market_demand || 'High'}</strong></span>
                          <span>•</span>
                          <span>Salary: <strong className="text-slate-700">{role.average_salary || '₹10,00,000 - ₹20,00,000 per annum'}</strong></span>
                        </div>
                        {role.required_skills && role.required_skills.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {role.required_skills.slice(0, 5).map((s, idx) => (
                              <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px]">
                                {s}
                              </span>
                            ))}
                            {role.required_skills.length > 5 && (
                              <span className="text-[10px] text-slate-400 self-center">
                                +{role.required_skills.length - 5} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="shrink-0">
                        {isCurrent ? (
                          <div className="flex items-center text-blue-600 text-xs font-bold space-x-1">
                            <Check className="w-4 h-4" />
                            <span>Active</span>
                          </div>
                        ) : (
                          <button
                            type="button"
                            className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-blue-600 text-white text-xs font-semibold transition"
                          >
                            Select Role
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 text-right">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold transition"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
