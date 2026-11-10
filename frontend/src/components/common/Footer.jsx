import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Sparkles, HelpCircle, Lock, BookOpen } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-navy-900 text-slate-300 pt-16 pb-12 border-t border-navy-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-navy-800">
          
          {/* Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-teal-400 flex items-center justify-center text-white font-bold">
                <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">
                Nex<span className="text-teal-400">ora</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              “Your Next Career Starts Here.” Nexora connects your demonstrated skills, resumes, and market opportunities through explainable AI job matching and career development tools.
            </p>
            <div className="flex items-center space-x-2 text-xs text-slate-400 pt-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-teal-950 text-teal-300 border border-teal-800">
                <ShieldCheck className="w-3 h-3 mr-1" /> Scam Shield Active
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-blue-950 text-blue-300 border border-blue-800">
                <Sparkles className="w-3 h-3 mr-1" /> Grounded RAG
              </span>
            </div>
          </div>

          {/* Candidates Navigation */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">
              Career Tools
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/jobs" className="hover:text-teal-300 transition">Find Verified Jobs</Link>
              </li>
              <li>
                <Link to="/ats-checker" className="hover:text-teal-300 transition">ATS Resume Checker</Link>
              </li>
              <li>
                <Link to="/career-gps" className="hover:text-teal-300 transition">Career GPS & Roadmaps</Link>
              </li>
              <li>
                <Link to="/assessments" className="hover:text-teal-300 transition">Demonstrate Skills</Link>
              </li>
              <li>
                <Link to="/assistant" className="hover:text-teal-300 transition">AI Career Assistant</Link>
              </li>
            </ul>
          </div>

          {/* Employers Navigation */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">
              For Recruiters
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/for-employers" className="hover:text-teal-300 transition">Employer Solutions</Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-teal-300 transition">Post a Job Opening</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-teal-300 transition">Recruiter Dashboard</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-teal-300 transition">Company Verification</Link>
              </li>
            </ul>
          </div>

          {/* Legal & Compliance */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white mb-4">
              Platform & Legal
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/about" className="hover:text-teal-300 transition">About Nexora</Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-teal-300 transition">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-teal-300 transition">Terms of Service</Link>
              </li>
              <li>
                <Link to="/responsible-ai" className="hover:text-teal-300 transition">Responsible AI Policy</Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Responsible AI Disclaimer & Notice */}
        <div className="py-6 border-b border-navy-800 text-xs text-slate-400 leading-relaxed bg-navy-950/40 px-4 rounded-xl mt-8">
          <div className="flex items-start space-x-3">
            <Lock className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-slate-200">Responsible AI & Hiring Transparency Notice: </span>
              Nexora calculates compatibility percentages and Job Readiness Scores using transparent, rule-based algorithms and verified candidate data. 
              Our scores are estimates intended for self-improvement and preparation. Nexora does not guarantee employment or interview offers, simulate proprietary corporate ATS algorithms, or make automated exclusionary decisions based on protected personal characteristics.
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Nexora Technologies. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">Engineered for lightweight, zero-cost transparency and trustworthy career growth.</p>
        </div>

      </div>
    </footer>
  );
}

