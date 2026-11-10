import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Lock, Mail, ArrowRight, ShieldCheck, UserCheck, Briefcase } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const searchParams = new URLSearchParams(location.search);
  const redirectParam = searchParams.get('redirect');
  const from = redirectParam ? decodeURIComponent(redirectParam) : location.state?.from?.pathname;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await login(email, password);
      if (from) {
        navigate(from, { replace: true });
      } else if (res.user.role === 'ADMIN') {
        navigate('/admin-portal');
      } else if (res.user.role === 'RECRUITER') {
        navigate('/recruiter/dashboard');
      } else {
        navigate('/candidate/overview');
      }
    } catch (err) {
      setError(
        err.data?.non_field_errors?.[0] || 
        err.data?.error || 
        "Invalid email or password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
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
          Sign In to Your Account
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Access your career intelligence, resume analyses, and applications.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-xl shadow-slate-200/60 rounded-3xl border border-slate-200 sm:px-10">
          
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl mb-5 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Password</label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-md transition disabled:opacity-50 mt-2 flex items-center justify-center"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </form>

          {/* Quick Demo Credentials for Fast Evaluation */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5 text-center">
              Quick 1-Click Demo Logins
            </p>
            <div className="grid grid-cols-3 gap-2 text-[11px]">
              <button
                type="button"
                onClick={() => handleQuickLogin('alex.morgan@example.com', 'Candidate2026!')}
                className="p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-blue-50 hover:border-blue-300 font-semibold text-slate-700 flex flex-col items-center text-center transition"
              >
                <UserCheck className="w-4 h-4 text-blue-600 mb-1" />
                Candidate
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('recruiter@cloudnova.io', 'Recruiter2026!')}
                className="p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-teal-50 hover:border-teal-300 font-semibold text-slate-700 flex flex-col items-center text-center transition"
              >
                <Briefcase className="w-4 h-4 text-teal-600 mb-1" />
                Recruiter
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('admin@nexora.io', 'NexoraAdmin2026!')}
                className="p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-purple-50 hover:border-purple-300 font-semibold text-slate-700 flex flex-col items-center text-center transition"
              >
                <ShieldCheck className="w-4 h-4 text-purple-600 mb-1" />
                Admin
              </button>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-slate-500">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-800">
              Create an account
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

