import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Sparkles, 
  X, 
  Lock, 
  Mail, 
  User, 
  ArrowRight, 
  Briefcase, 
  ShieldCheck, 
  Compass, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function WelcomeAuthModal() {
  const { isAuthenticated, login, registerCandidate, registerRecruiter } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'register'
  const [role, setRole] = useState('CANDIDATE');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Register form state
  const [regFullName, setRegFullName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regCompanyName, setRegCompanyName] = useState('');
  const [regAgree, setRegAgree] = useState(false);
  const [regLoading, setRegLoading] = useState(false);
  const [regError, setRegError] = useState('');

  useEffect(() => {
    // Only show if user is NOT authenticated and hasn't explicitly dismissed it this session
    // And do not show if user is already on /login or /register page
    if (isAuthenticated) {
      setIsOpen(false);
      return;
    }
    const isAuthRoute = location.pathname === '/login' || location.pathname === '/register';
    const dismissed = sessionStorage.getItem('nexora_welcome_dismissed');

    if (!dismissed && !isAuthRoute) {
      // Small timeout for smooth initial load
      const t = setTimeout(() => setIsOpen(true), 1200);
      return () => clearTimeout(t);
    }
  }, [isAuthenticated, location.pathname]);

  const handleDismiss = () => {
    sessionStorage.setItem('nexora_welcome_dismissed', 'true');
    setIsOpen(false);
  };

  const handleDemoLogin = (email, pass) => {
    setLoginEmail(email);
    setLoginPassword(pass);
    setLoginError('');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    try {
      const user = await login(loginEmail, loginPassword);
      setIsOpen(false);
      sessionStorage.setItem('nexora_welcome_dismissed', 'true');
      if (user.role === 'RECRUITER') navigate('/recruiter/dashboard');
      else if (user.role === 'ADMIN') navigate('/admin-portal');
      else navigate('/candidate/overview');
    } catch (err) {
      setLoginError(err.data?.error || err.data?.detail || "Invalid email or password. Please try again.");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setRegError('');

    if (regPassword !== regConfirmPassword) {
      setRegError("Passwords do not match.");
      return;
    }
    if (regPassword.length < 8) {
      setRegError("Password must be at least 8 characters long.");
      return;
    }
    if (!regAgree) {
      setRegError("Please accept the Terms of Service & Privacy Policy.");
      return;
    }

    setRegLoading(true);
    try {
      if (role === 'CANDIDATE') {
        await registerCandidate({
          full_name: regFullName,
          email: regEmail,
          password: regPassword,
          confirm_password: regConfirmPassword
        });
        setIsOpen(false);
        navigate('/candidate/overview');
      } else {
        if (!regCompanyName.trim()) {
          setRegError("Company name is required for recruiter accounts.");
          setRegLoading(false);
          return;
        }
        await registerRecruiter({
          full_name: regFullName,
          email: regEmail,
          company_name: regCompanyName,
          password: regPassword,
          confirm_password: regConfirmPassword
        });
        setIsOpen(false);
        navigate('/recruiter/dashboard');
      }
    } catch (err) {
      const errData = err.data || {};
      const firstError = Object.values(errData)[0];
      setRegError(Array.isArray(firstError) ? firstError[0] : (typeof firstError === 'string' ? firstError : "Registration failed. Email may already be in use."));
    } finally {
      setRegLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-900/70 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Banner Gradient */}
        <div className="bg-gradient-to-r from-navy-900 via-blue-900 to-teal-800 p-6 text-white relative">
          <button 
            onClick={handleDismiss}
            className="absolute top-5 right-5 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
            title="Dismiss and explore as guest"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center space-x-2 text-teal-300 text-xs font-bold tracking-wider uppercase mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Welcome to Nexora</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">
            Your Next Career Starts Here.
          </h2>
          <p className="text-xs sm:text-sm text-slate-200 mt-1.5 leading-relaxed">
            Create an account or sign in to unlock ATS Resume Scoring, Career GPS Roadmaps, Skill Assessments, and Grounded AI Mentorship.
          </p>

          {/* Quick Perks Pills */}
          <div className="flex flex-wrap gap-2 mt-4 text-[11px] text-slate-100">
            <span className="inline-flex items-center bg-white/10 px-2.5 py-1 rounded-full">
              <CheckCircle2 className="w-3 h-3 mr-1 text-teal-400" /> Free ATS Scanner
            </span>
            <span className="inline-flex items-center bg-white/10 px-2.5 py-1 rounded-full">
              <CheckCircle2 className="w-3 h-3 mr-1 text-teal-400" /> Verified Skill Tests
            </span>
            <span className="inline-flex items-center bg-white/10 px-2.5 py-1 rounded-full">
              <CheckCircle2 className="w-3 h-3 mr-1 text-teal-400" /> Career GPS Roadmap
            </span>
          </div>
        </div>

        {/* Modal Body: Tabs */}
        <div className="p-6">
          <div className="flex border-b border-slate-100 mb-6">
            <button
              onClick={() => setActiveTab('login')}
              className={`flex-1 pb-3 text-xs sm:text-sm font-bold border-b-2 transition ${
                activeTab === 'login'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              Sign In to Your Account
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={`flex-1 pb-3 text-xs sm:text-sm font-bold border-b-2 transition ${
                activeTab === 'register'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              Create Free Account
            </button>
          </div>

          {/* TAB 1: LOGIN */}
          {activeTab === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {loginError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
                  />
                </div>
              </div>

              {/* 1-Click Demo Buttons */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Quick Demo 1-Click Fill:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleDemoLogin('alex.morgan@example.com', 'Candidate2026!')}
                    className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-blue-500 hover:text-blue-600 text-[11px] font-semibold text-slate-700 transition text-center shadow-sm"
                  >
                    Candidate
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDemoLogin('recruiter@cloudnova.io', 'Recruiter2026!')}
                    className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-teal-500 hover:text-teal-600 text-[11px] font-semibold text-slate-700 transition text-center shadow-sm"
                  >
                    Recruiter
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDemoLogin('admin@nexora.io', 'NexoraAdmin2026!')}
                    className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-purple-500 hover:text-purple-600 text-[11px] font-semibold text-slate-700 transition text-center shadow-sm"
                  >
                    Admin
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-600/20 transition flex items-center justify-center space-x-2"
              >
                <span>{loginLoading ? 'Signing in...' : 'Sign In to Nexora'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* TAB 2: REGISTER */}
          {activeTab === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              {regError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{regError}</span>
                </div>
              )}

              {/* Role Toggle */}
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setRole('CANDIDATE')}
                  className={`py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
                    role === 'CANDIDATE' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-600'
                  }`}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Candidate</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('RECRUITER')}
                  className={`py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
                    role === 'RECRUITER' ? 'bg-white text-teal-600 shadow-sm' : 'text-slate-600'
                  }`}
                >
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>Recruiter</span>
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={regFullName}
                  onChange={(e) => setRegFullName(e.target.value)}
                  placeholder="Alex Morgan"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  placeholder="alex.morgan@example.com"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
                />
              </div>

              {role === 'RECRUITER' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Company / Organization Name</label>
                  <input
                    type="text"
                    required
                    value={regCompanyName}
                    onChange={(e) => setRegCompanyName(e.target.value)}
                    placeholder="Acme Tech Labs"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="At least 8 chars"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Confirm Password</label>
                  <input
                    type="password"
                    required
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="regAgree"
                  checked={regAgree}
                  onChange={(e) => setRegAgree(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="regAgree" className="text-[11px] text-slate-500">
                  I agree to Nexora's Terms of Service and Privacy Policy.
                </label>
              </div>

              <button
                type="submit"
                disabled={regLoading}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-600/20 transition flex items-center justify-center space-x-2"
              >
                <span>{regLoading ? 'Creating account...' : `Sign Up as ${role === 'CANDIDATE' ? 'Candidate' : 'Recruiter'}`}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Footer note: Explore as Guest */}
          <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Just browsing opportunities?</span>
            <button
              onClick={handleDismiss}
              className="font-semibold text-blue-600 hover:text-blue-700 underline underline-offset-2"
            >
              Explore as Guest &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

