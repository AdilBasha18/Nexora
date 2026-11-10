import React from 'react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-navy-900 tracking-tight">Privacy Policy</h1>
          <p className="text-xs text-slate-500 mt-1">Last updated: October 2026</p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 text-xs text-slate-700 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-sm font-bold text-navy-900">1. Information We Collect</h2>
            <p>
              We collect information you provide directly, such as account registration details (name, email, password), profile information (skills, work experience, education, portfolio links), and uploaded resumes (PDF, DOCX) to extract technical text for ATS scoring.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-navy-900">2. How Information is Used</h2>
            <p>
              Your information is used solely to provide platform functionality: calculating job matches, running ATS compatibility checks, evaluating skill assessments, and delivering in-app status updates for job applications. We do not sell user data to third-party data brokers.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-navy-900">3. Resume Confidentiality</h2>
            <p>
              Uploaded resumes are stored in private media directories and are not accessible to public search engines. Only recruiters whose vacancies you explicitly apply for have permission to inspect your attached resume.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-navy-900">4. Data Deletion & Rights</h2>
            <p>
              You have the right to inspect, edit, or permanently delete your resumes and account information at any time from your candidate dashboard.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

