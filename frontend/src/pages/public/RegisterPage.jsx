import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { User, Briefcase, Mail, Lock, Building, Globe, Check, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const redirectParam = searchParams.get('redirect');
  const from = redirectParam ? decodeURIComponent(redirectParam) : null;
  const { registerCandidate, registerRecruiter } = useAuth();

  const [activeTab, setActiveTab] = useState('candidate'); // 'candidate' | 'recruiter'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Candidate fields
  const [candName, setCandName] = useState('');
  const [candEmail, setCandEmail] = useState('');
  const [candPassword, setCandPassword] = useState('');
  const [candConfirmPassword, setCandConfirmPassword] = useState('');

  // Recruiter fields
  const [recName, setRecName] = useState('');
  const [recEmail, setRecEmail] = useState('');
  const [recPassword, setRecPassword] = useState('');
  const [recConfirmPassword, setRecConfirmPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [jobTitle, setJobTitle] = useState('');

  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreeTerms) {
      setError("Please agree to the Terms of Service and Privacy Policy.");
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (activeTab === 'candidate') {
        if (candPassword !== candConfirmPassword) {
          setError("Passwords do not match.");
          setLoading(false);
          return;
        }
        await registerCandidate({
          full_name: candName,
          email: candEmail,
          password: candPassword,
          confirm_password: candConfirmPassword
        });
        navigate(from || '/candidate/overview');
      } else {
        if (recPassword !== recConfirmPassword) {
          setError("Passwords do not match.");
          setLoading(false);
          return;
        }
        await registerRecruiter({
          full_name: recName,
          email: recEmail,
          password: recPassword,
          confirm_password: recConfirmPassword,
          company_name: companyName,
          company_website: companyWebsite,
          job_title: jobTitle
        });
        navigate(from || '/recruiter/dashboard');
      }
    } catch (err) {
      const errData = err.data || {};
      const firstKey = Object.keys(errData)[0];
      const msg = Array.isArray(errData[firstKey]) ? errData[firstKey][0] : errData[firstKey];
      setError(msg || "Registration failed. Please check your information.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center space-x-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-teal-500 flex items-center justify-center text-white font-bold shadow-md">
            <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-2xl font-extrabold text-navy-900 tracking-tight">
            Nex<span className="text-blue-600">ora</span>
          </span>
        </Link>
        <h2 className="mt-4 text-2xl font-extrabold text-navy-900">
          Create Your Nexora Account
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Join the AI-powered career platform connecting verified abilities to real jobs.
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-xl shadow-slate-200/60 rounded-3xl border border-slate-200 sm:px-10">
          
          {/* Role Selector Tabs */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-2xl mb-6">
            <button
              type="button"
              onClick={() => { setActiveTab('candidate'); setError(''); }}
              className={`py-2 text-xs font-bold rounded-xl flex items-center justify-center transition ${
                activeTab === 'candidate' 
                  ? 'bg-white text-blue-700 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <User className="w-4 h-4 mr-1.5" /> Job Seeker
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('recruiter'); setError(''); }}
              className={`py-2 text-xs font-bold rounded-xl flex items-center justify-center transition ${
                activeTab === 'recruiter' 
                  ? 'bg-white text-teal-700 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Briefcase className="w-4 h-4 mr-1.5" /> Employer / Recruiter
            </button>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl mb-5 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {activeTab === 'candidate' ? (
              <>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={candName}
                    onChange={(e) => setCandName(e.target.value)}
                    placeholder="e.g. Jordan Smith"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={candEmail}
                    onChange={(e) => setCandEmail(e.target.value)}
                    placeholder="jordan@example.com"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Password (min 8 chars)</label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={candPassword}
                    onChange={(e) => setCandPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Confirm Password</label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={candConfirmPassword}
                    onChange={(e) => setCandConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Your Full Name</label>
                  <input
                    type="text"
                    required
                    value={recName}
                    onChange={(e) => setRecName(e.target.value)}
                    placeholder="e.g. Sarah Jenkins"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Corporate Work Email</label>
                  <input
                    type="email"
                    required
                    value={recEmail}
                    onChange={(e) => setRecEmail(e.target.value)}
                    placeholder="sarah@company.com"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Company Name</label>
                    <input
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Acme Tech"
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Your Job Title</label>
                    <input
                      type="text"
                      required
                      value={jobTitle}
                      onChange={(e) => setJobTitle(e.target.value)}
                      placeholder="e.g. Technical Recruiter"
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Company Website</label>
                  <input
                    type="url"
                    value={companyWebsite}
                    onChange={(e) => setCompanyWebsite(e.target.value)}
                    placeholder="https://company.com"
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Password</label>
                    <input
                      type="password"
                      required
                      minLength={8}
                      value={recPassword}
                      onChange={(e) => setRecPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Confirm</label>
                    <input
                      type="password"
                      required
                      minLength={8}
                      value={recConfirmPassword}
                      onChange={(e) => setRecConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Terms Agreement */}
            <div className="pt-2">
              <label className="flex items-start space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4 mt-0.5"
                />
                <span className="text-[11px] text-slate-500 leading-tight">
                  I agree to Nexora's <Link to="/terms" className="text-blue-600 underline">Terms of Service</Link>, <Link to="/privacy" className="text-blue-600 underline">Privacy Policy</Link>, and understand that AI match scores are estimated development benchmarks.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2.5 px-4 text-white font-semibold text-xs rounded-xl shadow-md transition disabled:opacity-50 mt-2 flex items-center justify-center ${
                activeTab === 'candidate' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-teal-600 hover:bg-teal-700'
              }`}
            >
              {loading ? 'Creating Account...' : `Register as ${activeTab === 'candidate' ? 'Job Seeker' : 'Employer'}`}
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-800">
              Sign In
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

