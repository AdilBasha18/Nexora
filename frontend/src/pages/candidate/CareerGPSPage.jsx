import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { 
  Compass, 
  CheckCircle, 
  ExternalLink, 
  Award, 
  Sparkles, 
  TrendingUp, 
  BookOpen, 
  CheckSquare, 
  Square,
  DollarSign,
  Layers,
  Clock,
  Code,
  Briefcase,
  ChevronRight,
  Filter
} from 'lucide-react';

export default function CareerGPSPage() {
  const [roles, setRoles] = useState([]);
  const [selectedRoleId, setSelectedRoleId] = useState('');
  
  // Custom generator inputs
  const [experienceLevel, setExperienceLevel] = useState('Beginner / Fresh Graduate');
  const [learningDuration, setLearningDuration] = useState('3 Months (Fast-Track)');
  const [currentSkillsInput, setCurrentSkillsInput] = useState('');
  const [existingCourses, setExistingCourses] = useState('');
  const [showConfig, setShowConfig] = useState(false);

  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [togglingStepId, setTogglingStepId] = useState(null);

  useEffect(() => {
    async function loadRoles() {
      try {
        const rolesData = await api.getTargetRoles();
        const rList = rolesData.results || rolesData;
        setRoles(rList);
        if (rList.length > 0) {
          setSelectedRoleId(rList[0].id);
          loadRoadmap(rList[0].id);
        }
      } catch (e) {
        console.error(e);
        setLoading(false);
      }
    }
    loadRoles();
  }, []);

  async function loadRoadmap(roleId) {
    setLoading(true);
    try {
      const data = await api.getRoadmap(roleId);
      setRoadmap(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const handleRoleChange = (e) => {
    const rId = e.target.value;
    setSelectedRoleId(rId);
    loadRoadmap(rId);
  };

  const handleGenerateRoadmap = async (e) => {
    e.preventDefault();
    if (!selectedRoleId) return;
    setGenerating(true);
    try {
      const skillsList = currentSkillsInput
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);

      const payload = {
        role_id: Number(selectedRoleId),
        current_skills: skillsList,
        experience_level: experienceLevel,
        learning_duration: learningDuration,
        existing_courses: existingCourses
      };

      const data = await api.generateRoadmap(payload);
      setRoadmap(data);
      setShowConfig(false);
    } catch (e) {
      console.error("Failed to generate roadmap:", e);
    } finally {
      setGenerating(false);
    }
  };

  const handleToggleStep = async (stepId) => {
    setTogglingStepId(stepId);
    try {
      const res = await api.toggleRoadmapStep(stepId);
      setRoadmap(prev => {
        if (!prev) return prev;
        const nextSteps = prev.steps.map(s => 
          s.id === stepId ? { ...s, is_completed: res.is_completed } : s
        );
        return {
          ...prev,
          overall_progress: res.overall_progress,
          steps: nextSteps
        };
      });
    } catch (e) {
      console.error(e);
    } finally {
      setTogglingStepId(null);
    }
  };

  // Group steps by Phase
  const groupedPhases = React.useMemo(() => {
    if (!roadmap?.steps) return {};
    const groups = {};
    roadmap.steps.forEach(step => {
      const phaseName = step.phase || "Phase 1: Fundamentals";
      if (!groups[phaseName]) {
        groups[phaseName] = [];
      }
      groups[phaseName].push(step);
    });
    return groups;
  }, [roadmap]);

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs font-semibold mb-2">
            <Compass className="w-3.5 h-3.5" />
            <span>AI-Assisted Career GPS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
            Career Roadmap & Progression
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Generate a phased learning roadmap tailored to your target role, existing skills, and timeline.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowConfig(!showConfig)}
            className="px-4 py-2 rounded-xl border border-purple-200 bg-purple-50 hover:bg-purple-100 text-purple-900 text-xs font-bold transition flex items-center space-x-1.5 shadow-sm"
          >
            <Filter className="w-3.5 h-3.5 text-purple-600" />
            <span>{showConfig ? "Hide Generator Form" : "Customize My Roadmap"}</span>
          </button>
        </div>
      </div>

      {/* Interactive Customization Box */}
      {showConfig && (
        <div className="bg-white p-6 rounded-3xl border border-purple-200 shadow-md space-y-5 animate-fade-in">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-sm text-navy-900 flex items-center">
              <Sparkles className="w-4 h-4 mr-2 text-purple-600" />
              Tailor Your Learning Roadmap
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Input your existing background to bypass skills you already master and allocate realistic phase timelines.
            </p>
          </div>

          <form onSubmit={handleGenerateRoadmap} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Target Professional Role</label>
              <select
                value={selectedRoleId}
                onChange={(e) => setSelectedRoleId(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-purple-500"
              >
                {roles.map(r => (
                  <option key={r.id} value={r.id}>{r.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Current Experience Level</label>
              <select
                value={experienceLevel}
                onChange={(e) => setExperienceLevel(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 outline-none focus:ring-2 focus:ring-purple-500 font-medium"
              >
                <option value="Beginner / Fresh Graduate">Beginner / Student / Career Switcher</option>
                <option value="Junior (1-2 years)">Junior Engineer (1-2 years experience)</option>
                <option value="Mid-Level (3+ years)">Mid-Level Developer (3+ years experience)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Target Learning Timeline</label>
              <select
                value={learningDuration}
                onChange={(e) => setLearningDuration(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 outline-none focus:ring-2 focus:ring-purple-500 font-medium"
              >
                <option value="3 Months (Fast-Track)">3 Months (Intensive / Fast-Track)</option>
                <option value="6 Months (Balanced)">6 Months (Balanced / Part-Time)</option>
                <option value="1 Year (Deep Mastery)">1 Year (Comprehensive Mastery)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Skills You Already Know (comma separated)
              </label>
              <input
                type="text"
                value={currentSkillsInput}
                onChange={(e) => setCurrentSkillsInput(e.target.value)}
                placeholder="e.g. HTML, CSS, JavaScript, Git, Python"
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="md:col-span-2 pt-2 flex justify-end">
              <button
                type="submit"
                disabled={generating}
                className="px-6 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-md shadow-purple-700/20 transition flex items-center space-x-2 disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4" />
                <span>{generating ? "Synthesizing Roadmap..." : "Generate Phased Roadmap"}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Role Quick Selector when config is hidden */}
      {!showConfig && (
        <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center space-x-3">
            <Briefcase className="w-5 h-5 text-purple-600" />
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Target Career Path</span>
              <span className="text-sm font-extrabold text-navy-900">{roadmap?.target_role?.title || "Select Role"}</span>
            </div>
          </div>
          <div className="w-64">
            <select
              value={selectedRoleId}
              onChange={handleRoleChange}
              className="w-full p-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-navy-900 outline-none focus:ring-2 focus:ring-purple-500"
            >
              {roles.map(r => (
                <option key={r.id} value={r.id}>{r.title}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {loading ? (
        <div className="p-16 text-center text-xs text-slate-500">Generating roadmap for selected role...</div>
      ) : roadmap ? (
        <div className="space-y-8">
          
          {/* Target Role Card */}
          <div className="bg-gradient-to-r from-navy-900 via-purple-950 to-navy-900 p-6 sm:p-8 rounded-3xl text-white shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-800/60 text-purple-200">
                  Market Demand: {roadmap.target_role?.market_demand}
                </span>
                <h2 className="text-2xl font-extrabold mt-2 tracking-tight">
                  {roadmap.target_role?.title}
                </h2>
                <p className="text-xs text-slate-300 mt-1">
                  Average Compensation Benchmark: <strong>{roadmap.target_role?.average_salary}</strong>
                </p>
              </div>

              {/* Progress Box */}
              <div className="flex items-center space-x-3 bg-white/10 px-5 py-3 rounded-2xl border border-white/10 shrink-0">
                <div className="text-right">
                  <span className="text-2xl font-extrabold block">{roadmap.overall_progress}%</span>
                  <span className="text-[10px] text-purple-200 font-bold uppercase tracking-wider">Completed</span>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
              {roadmap.target_role?.description}
            </p>

            <div className="pt-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Core Role Competencies
              </span>
              <div className="flex flex-wrap gap-1.5">
                {(roadmap.target_role?.required_skills || []).map(skill => (
                  <span key={skill} className="px-2.5 py-1 rounded-lg bg-white/15 text-white font-medium text-xs">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Phased Roadmap Display */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-navy-900">4-Phase Learning & Execution Roadmap</h3>
                <p className="text-xs text-slate-500">
                  Click the checkbox on any milestone to mark it completed. Your progress is saved automatically.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              {Object.entries(groupedPhases).map(([phaseTitle, steps], pIdx) => {
                const phaseCompleted = steps.filter(s => s.is_completed).length;
                const phasePercent = Math.round((phaseCompleted / steps.length) * 100);

                return (
                  <div key={phaseTitle} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
                    
                    {/* Phase Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                      <div className="flex items-center space-x-2.5">
                        <span className="w-7 h-7 rounded-xl bg-purple-100 text-purple-700 font-black text-xs flex items-center justify-center shrink-0">
                          {pIdx + 1}
                        </span>
                        <div>
                          <h4 className="font-extrabold text-sm text-navy-900">{phaseTitle}</h4>
                          <span className="text-[11px] text-slate-400">
                            {phaseCompleted} of {steps.length} milestones finished ({phasePercent}%)
                          </span>
                        </div>
                      </div>

                      {/* Phase Mini Progress Bar */}
                      <div className="w-36 h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-purple-500 to-teal-400 transition-all duration-300"
                          style={{ width: `${phasePercent}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Step Cards */}
                    <div className="space-y-2.5">
                      {steps.map((step) => (
                        <div
                          key={step.id}
                          className={`p-4 rounded-2xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                            step.is_completed 
                              ? 'bg-emerald-50/40 border-emerald-200' 
                              : 'bg-slate-50/50 border-slate-200 hover:bg-white hover:shadow-sm'
                          }`}
                        >
                          <div className="flex items-start space-x-3">
                            <button
                              type="button"
                              disabled={togglingStepId === step.id}
                              onClick={() => handleToggleStep(step.id)}
                              className={`mt-0.5 transition ${
                                step.is_completed ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'
                              }`}
                              title={step.is_completed ? "Mark incomplete" : "Mark completed"}
                            >
                              {step.is_completed ? (
                                <CheckSquare className="w-5 h-5 fill-emerald-100" />
                              ) : (
                                <Square className="w-5 h-5" />
                              )}
                            </button>

                            <div className="space-y-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className={`text-xs font-bold ${step.is_completed ? 'text-emerald-950 line-through' : 'text-slate-900'}`}>
                                  {step.title}
                                </span>
                                {step.estimated_duration && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-200/80 text-slate-700">
                                    <Clock className="w-2.5 h-2.5 mr-1 text-slate-500" />
                                    {step.estimated_duration}
                                  </span>
                                )}
                                {step.verified_by_assessment && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                                    <Award className="w-3 h-3 mr-1" /> Demonstrated Skill
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-500 leading-relaxed">
                                {step.description}
                              </p>
                            </div>
                          </div>

                          {step.resource_url && (
                            <a
                              href={step.resource_url.startsWith('http') ? step.resource_url : `#${step.resource_url}`}
                              target={step.resource_url.startsWith('http') ? "_blank" : "_self"}
                              rel="noreferrer"
                              className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold shrink-0 inline-flex items-center transition self-start sm:self-auto shadow-sm"
                            >
                              <BookOpen className="w-3.5 h-3.5 mr-1.5 text-purple-600" />
                              {step.resource_title || 'Documentation'}
                              {step.resource_url.startsWith('http') && <ExternalLink className="w-3 h-3 ml-1 text-slate-400" />}
                            </a>
                          )}
                        </div>
                      ))}
                    </div>

                  </div>
                );
              })}
            </div>
          </div>

        </div>
      ) : null}

    </div>
  );
}
