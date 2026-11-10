import React, { useState } from 'react';
import { Sparkles, X, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-gradient-to-r from-navy-900 via-navy-800 to-blue-900 text-white text-xs sm:text-sm py-2 px-4 shadow-sm relative z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2 flex-1 justify-center sm:justify-start">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
          </span>
          <span className="font-semibold text-teal-300">New Feature:</span>
          <span className="text-slate-200">
            AI Skill Gap Roadmaps & 2026 ATS Compatibility Checker are live.
          </span>
          <Link
            to="/ats-checker"
            className="hidden md:inline-flex items-center text-teal-300 hover:text-white font-medium underline underline-offset-2 ml-1"
          >
            Try free check <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="text-slate-400 hover:text-white p-1 rounded-md transition"
          aria-label="Dismiss announcement"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

