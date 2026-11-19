import React, { useState, useEffect } from 'react';
import { Mail, X } from 'lucide-react';

const STORAGE_KEY = 'nexora_email_spam_notice_dismissed';

export default function EmailSpamNotice() {
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    try {
      const isDismissed = localStorage.getItem(STORAGE_KEY);
      if (!isDismissed) {
        setDismissed(false);
      }
    } catch {
      setDismissed(false);
    }
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    try {
      localStorage.setItem(STORAGE_KEY, 'true');
    } catch {
      // ignore storage access errors
    }
  };

  if (dismissed) return null;

  return (
    <div className="relative rounded-2xl bg-gradient-to-r from-blue-50 via-slate-50 to-teal-50 border border-blue-100/80 p-3.5 sm:p-4 text-slate-700 shadow-sm transition-all duration-200">
      <div className="flex items-start sm:items-center justify-between gap-3">
        <div className="flex items-start sm:items-center space-x-3 pr-6">
          <div className="p-1.5 rounded-lg bg-blue-100/80 text-blue-700 shrink-0 mt-0.5 sm:mt-0">
            <Mail className="w-4 h-4" />
          </div>
          <p className="text-xs sm:text-sm text-slate-700 leading-snug">
            <span className="font-semibold text-slate-900">📩 Not receiving Nexora emails?</span>{' '}
            Please check your <strong className="font-semibold text-slate-800">Spam</strong> or <strong className="font-semibold text-slate-800">Junk</strong> folder. If you find a Nexora email there, mark it as <span className="font-semibold text-teal-700">"Not Spam"</span> so future interview updates and verification codes reach your Inbox directly.
          </p>
        </div>
        <button
          onClick={handleDismiss}
          aria-label="Dismiss email notice"
          title="Dismiss notice"
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
