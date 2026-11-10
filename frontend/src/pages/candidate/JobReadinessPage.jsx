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
  ShieldCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function JobReadinessPage() {
  const [readiness, setReadiness] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReadiness() {
      try {
        const data = await api.getJobReadiness();
        setReadiness(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadReadiness();
  }, []);

  if (loading) {
    return <div className="p-16 text-center text-xs text-slate-500">Calculating job readiness index...</div>;
  }

  if (!readiness) {
    return <div className="p-16 text-center text-xs text-red-600">Unable to calculate readiness score.</div>;
  }

  const breakdown = readiness.component_scores || {};

  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto space-y-8">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-2">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>Explainable Candidate Index</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
          Job Readiness Score: {readiness.target_role?.title}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          A multi-factor developmental benchmark evaluating your demonstrated skills, assessments, and resume evidence.
        </p>
      </div>

      {/* Main Score Hero */}
      <div className="bg-gradient-to-r from-navy-900 via-navy-800 to-teal-950 p-8 rounded-3xl text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="space-y-3 max-w-xl">
          <span className="text-xs font-bold text-teal-300 uppercase tracking-wider">
            Overall Readiness Index
          </span>
          <div className="flex items-baseline space-x-3">
            <span className="text-5xl font-extrabold tracking-tight">
              {readiness.overall_readiness}%
            </span>
            <span className="text-sm font-semibold text-slate-300">
              {readiness.overall_readiness >= 75 ? 'Job Market Ready' : readiness.overall_readiness >= 50 ? 'Developing Competency' : 'Early Exploration'}
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Market Demand: <strong>{readiness.target_role?.market_demand}</strong> • Average Compensation: <strong>{readiness.target_role?.salary_range}</strong>
          </p>
        </div>

        <div className="flex flex-col gap-2 shrink-0">
          <Link
            to="/ats-checker"
            className="px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-navy-950 font-bold text-xs shadow transition text-center"
          >
            Improve Resume ATS Score
          </Link>
          <Link
            to="/assessments"
            className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition text-center"
          >
            Take Skill Assessments
          </Link>
        </div>
      </div>

      {/* 4 Factor Component Breakdown */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-navy-900">Score Component Breakdown</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Factor 1 (40% Weight)</span>
            <h3 className="font-bold text-sm text-navy-900">Skill Coverage</h3>
            <span className="text-2xl font-extrabold text-blue-600 block">{breakdown.skill_coverage || 0}%</span>
            <p className="text-slate-500 leading-relaxed text-[11px]">
              Overlap of self-reported and resume skills against required role criteria.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Factor 2 (25% Weight)</span>
            <h3 className="font-bold text-sm text-navy-900">Assessment Proof</h3>
            <span className="text-2xl font-extrabold text-teal-600 block">{breakdown.assessment_demonstration || 0}%</span>
            <p className="text-slate-500 leading-relaxed text-[11px]">
              Average score across passed technical quizzes and coding fundamentals.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Factor 3 (20% Weight)</span>
            <h3 className="font-bold text-sm text-navy-900">Resume Alignment</h3>
            <span className="text-2xl font-extrabold text-purple-600 block">{breakdown.resume_alignment || 0}%</span>
            <p className="text-slate-500 leading-relaxed text-[11px]">
              Latest ATS analysis score and structural completeness of uploaded resume.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
            <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Factor 4 (15% Weight)</span>
            <h3 className="font-bold text-sm text-navy-900">Project Evidence</h3>
            <span className="text-2xl font-extrabold text-emerald-600 block">{breakdown.experience_and_projects || 0}%</span>
            <p className="text-slate-500 leading-relaxed text-[11px]">
              Concrete portfolio projects and verifiable work history years.
            </p>
          </div>

        </div>
      </div>

      {/* Strongest Areas & Priority Gaps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center space-x-2 text-emerald-600">
            <CheckCircle className="w-5 h-5" />
            <h3 className="font-bold text-sm text-slate-900">Your Strongest Competencies</h3>
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            {readiness.strongest_areas?.length > 0 ? (
              readiness.strongest_areas.map(s => (
                <span key={s} className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-800 font-semibold text-xs border border-emerald-200">
                  ✓ {s}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-400">Add technical skills to your profile.</span>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center space-x-2 text-amber-600">
            <AlertTriangle className="w-5 h-5" />
            <h3 className="font-bold text-sm text-slate-900">Priority Skill Gaps for Role</h3>
          </div>
          <div className="flex flex-wrap gap-2 pt-2">
            {readiness.priority_gaps?.length > 0 ? (
              readiness.priority_gaps.map(s => (
                <span key={s} className="px-3 py-1 rounded-xl bg-amber-50 text-amber-800 font-semibold text-xs border border-amber-200">
                  + {s}
                </span>
              ))
            ) : (
              <span className="text-xs text-emerald-600 font-semibold">You satisfy all core required skills!</span>
            )}
          </div>
        </div>

      </div>

      {/* Actionable Recommendations */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
        <h3 className="font-bold text-sm text-navy-900">Action Plan to Boost Readiness</h3>
        <div className="space-y-2 text-xs">
          {readiness.recommendations?.map((rec, i) => (
            <div key={i} className="flex items-start space-x-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold text-[11px] flex items-center justify-center shrink-0 mt-0.5">
                {i + 1}
              </span>
              <span className="text-slate-700 font-medium">{rec}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="p-4 bg-slate-100 rounded-2xl text-[11px] text-slate-500 leading-relaxed border border-slate-200">
        <strong>Transparency Notice: </strong> {readiness.disclaimer}
      </div>

    </div>
  );
}

