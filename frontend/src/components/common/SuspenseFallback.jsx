import React from 'react';
import { Loader2 } from 'lucide-react';

export default function SuspenseFallback({ message = "Loading..." }) {
  return (
    <div className="min-h-[50vh] w-full flex flex-col items-center justify-center p-8 transition-colors duration-200">
      <div className="flex flex-col items-center space-y-3">
        <div className="relative flex items-center justify-center">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-500/20 animate-pulse">
            N
          </div>
          <Loader2 className="w-16 h-16 text-blue-600/40 animate-spin absolute" />
        </div>
        <div className="text-center">
          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 tracking-wide uppercase">
            {message}
          </p>
          <span className="text-[11px] text-slate-400 dark:text-slate-500">
            Nexora Career Intelligence Platform
          </span>
        </div>
      </div>
    </div>
  );
}
