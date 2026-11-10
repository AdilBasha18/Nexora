import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Sparkles, Award, Compass, HeartHandshake } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-12">
        
        <div className="text-center space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold">
            <Sparkles className="w-4 h-4" />
            <span>Our Core Purpose</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-900 tracking-tight">
            About Nexora: Transparent Career Intelligence
          </h1>
          <p className="text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
            “Your Next Career Starts Here.” Nexora was founded on a simple principle: job seeking should not be a secret black-box lottery. Candidates deserve to know why jobs match, how their resumes are read, and exactly what skills they need to acquire next.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 text-xs text-slate-700 leading-relaxed">
          <h2 className="text-base font-bold text-navy-900">The Problem with Traditional Job Portals</h2>
          <p>
            Standard job boards treat resumes as passive keyword dumps. Job seekers send hundreds of applications with zero actionable feedback, while recruiters are overwhelmed by unvetted applicants. 
          </p>
          <p>
            Nexora flips this equation by making skills <strong>demonstrable</strong> and matching <strong>explainable</strong>. When you view a job match on Nexora, you see the exact breakdown: which required skills matched, which preferred skills you have, and which areas you need to build next.
          </p>

          <h2 className="text-base font-bold text-navy-900 pt-4">Our Core Pillars</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <span className="font-bold text-slate-900 flex items-center">
                <Award className="w-4 h-4 mr-1.5 text-blue-600" /> Server-Verified Assessments
              </span>
              <p className="text-slate-600">
                Objective timed quizzes in Python, SQL, React, and Problem Solving ensure candidates are evaluated on demonstrated technical knowledge.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <span className="font-bold text-slate-900 flex items-center">
                <Compass className="w-4 h-4 mr-1.5 text-teal-600" /> Transparent Career GPS
              </span>
              <p className="text-slate-600">
                Actionable step-by-step roadmaps that connect missing role qualifications with verified free official documentation and tutorials.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <span className="font-bold text-slate-900 flex items-center">
                <ShieldCheck className="w-4 h-4 mr-1.5 text-emerald-600" /> Job Scam Shield
              </span>
              <p className="text-slate-600">
                Real-time lexical filters and administrative verification protect job seekers from predatory application fees, cryptocurrency demands, and impersonation.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
              <span className="font-bold text-slate-900 flex items-center">
                <Sparkles className="w-4 h-4 mr-1.5 text-purple-600" /> Grounded RAG Assistant
              </span>
              <p className="text-slate-600">
                Retrieval-augmented advisory that answers career questions with citations from verified career guides without hallucinating.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

