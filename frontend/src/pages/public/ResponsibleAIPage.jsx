import React from 'react';
import { Lock, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ResponsibleAIPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        
        <div>
          <span className="text-xs font-bold text-teal-600 uppercase tracking-wider block mb-1">
            Ethics, Safety & Transparency
          </span>
          <h1 className="text-3xl font-extrabold text-navy-900 tracking-tight">
            Responsible AI & Hiring Transparency Policy
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            How Nexora ensures explainability, protects privacy, and avoids discriminatory automated hiring decisions.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 text-xs text-slate-700 leading-relaxed">
          
          <div className="space-y-2">
            <h2 className="text-sm font-bold text-navy-900">1. Explainability Over Black-Box Models</h2>
            <p>
              Nexora does not use opaque deep learning neural networks to accept or reject job candidates. Every match percentage, ATS compatibility estimate, and Job Readiness Score is calculated from transparent, rule-based algorithms with documented weights. Candidates are always shown exactly which factors contributed to their score.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-sm font-bold text-navy-900">2. No Guaranteed Hiring Decisions</h2>
            <p>
              Nexora’s AI tools are developmental estimates intended to guide self-improvement, resume formatting, and learning sequences. Nexora does not guarantee interviews or employment, and does not claim to duplicate or simulate proprietary corporate ATS algorithms used by third-party employers.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-sm font-bold text-navy-900">3. Non-Discrimination and Equal Opportunity</h2>
            <p>
              Our matching algorithms evaluate only technical skills, demonstrated assessments, years of experience, and stated work mode/location preferences. Protected personal characteristics — including race, gender, age, religion, national origin, and disability status — are strictly excluded from all matching, scoring, and ranking calculations.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-sm font-bold text-navy-900">4. Grounded Retrieval-Augmented Generation (RAG)</h2>
            <p>
              Our AI Career Assistant uses retrieval-augmented generation grounded in curated documentation. It provides clear citations and document titles with answers. If the knowledge base lacks sufficient verified data on a question, the assistant transparently clarifies that information is unavailable rather than fabricating advice.
            </p>
          </div>

          <div className="space-y-2">
            <h2 className="text-sm font-bold text-navy-900">5. Candidate Privacy & Data Control</h2>
            <p>
              Resumes uploaded to Nexora are private by default. Candidates retain complete ownership of their data and can delete resumes or account profiles at any time. Resumes are only shared with recruiters when a candidate explicitly submits an application for that recruiter's specific vacancy.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
}

