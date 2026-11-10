import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, ShieldCheck, CheckCircle2, ArrowRight, Award, Users, Filter } from 'lucide-react';

export default function ForEmployersPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-semibold">
            <Building2 className="w-4 h-4" />
            <span>Employer Solutions</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-navy-900 tracking-tight">
            Recruit Candidates Based on Demonstrated Ability
          </h1>
          <p className="text-base text-slate-600 leading-relaxed">
            Eliminate endless resume keyword spam. Discover developers and analysts who have completed server-verified skill assessments and match your technical requirements.
          </p>
          <div className="pt-4 flex justify-center gap-3">
            <Link
              to="/register"
              className="px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs shadow-md transition"
            >
              Register Employer Account
            </Link>
            <Link
              to="/login"
              className="px-6 py-3 rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-xs transition"
            >
              Sign In to Recruiter Portal
            </Link>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-sm text-navy-900 mb-2">Verified Company Badge</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Gain verified credibility that job seekers respect. Our Scam Shield protections protect your brand from spoofing and fake recruiter impersonation.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-sm text-navy-900 mb-2">Assessment Results at a Glance</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Inspect candidates' demonstrated test scores in Python, SQL, React, and Problem Solving directly alongside their resumes.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
              <Filter className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-sm text-navy-900 mb-2">Clean Applicant Management</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Organize applicants through stages: Submitted, Under Review, Shortlisted, and Interview Scheduled with internal team notes.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

