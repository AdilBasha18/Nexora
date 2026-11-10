import React from 'react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-navy-900 tracking-tight">Terms of Service</h1>
          <p className="text-xs text-slate-500 mt-1">Last updated: October 2026</p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 text-xs text-slate-700 leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-sm font-bold text-navy-900">1. Acceptance of Terms</h2>
            <p>
              By creating an account or accessing the Nexora platform, you agree to comply with and be bound by these Terms of Service.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-navy-900">2. Permitted Use and Scam Shield Rules</h2>
            <p>
              Employers and recruiters must post legitimate, truthful vacancies. Asking job candidates for application fees, training deposits, cryptocurrency payments, or sensitive banking credentials is strictly prohibited and results in immediate account suspension and moderation reporting.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-navy-900">3. Assessment & Integrity</h2>
            <p>
              Candidates agree to complete skill evaluations independently to maintain authentic assessment benchmarks for our employer community.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-sm font-bold text-navy-900">4. Disclaimer of Warranties</h2>
            <p>
              The platform, including all matching algorithms, ATS estimates, and AI consultations, is provided "as is" for developmental and informational guidance without warranty of employment or hiring success.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

