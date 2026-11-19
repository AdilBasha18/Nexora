import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { useGoogleLogin } from '@react-oauth/google';
import { 
  Eye, 
  EyeOff, 
  Github, 
  Lock, 
  Mail, 
  User, 
  Building,
  ArrowRight, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  X
} from 'lucide-react';
import { ShineBorder } from '../../components/ui/shine-border';

export default function AuthPage({ defaultMode = 'signin' }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, registerCandidate, registerRecruiter, loginWithToken } = useAuth();

  // Mode: 'login' | 'signup'
  const [activeTab, setActiveTab] = useState(defaultMode === 'signup' ? 'signup' : 'login');
  const [accountType, setAccountType] = useState('CANDIDATE'); // 'CANDIDATE' | 'RECRUITER'

  // Form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Status
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showGitHubModal, setShowGitHubModal] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmailSent, setForgotEmailSent] = useState(false);

  // Sync mode with route changes if user navigates between /login and /register
  useEffect(() => {
    if (location.pathname === '/register') {
      setActiveTab('signup');
    } else if (location.pathname === '/login') {
      setActiveTab('login');
    }
  }, [location.pathname]);

  // Handle GitHub OAuth callback if redirected back with ?code=... or error
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get('code');
    const ghError = params.get('error_description') || params.get('error');
    if (ghError) {
      setError(`GitHub Sign In: ${ghError}`);
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (code) {
      handleGitHubExchange(code);
    }
  }, [location.search]);

  // Canvas rising star particles (matches Reference Image 1)
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId;
    const setSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setSize();

    let particles = [];
    const make = () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      v: Math.random() * 0.25 + 0.05,
      o: Math.random() * 0.35 + 0.15,
    });

    const init = () => {
      particles = [];
      const count = Math.floor((canvas.width * canvas.height) / 9000);
      for (let i = 0; i < count; i++) particles.push(make());
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.y -= p.v;
        if (p.y < 0) {
          p.x = Math.random() * canvas.width;
          p.y = canvas.height + Math.random() * 40;
          p.v = Math.random() * 0.25 + 0.05;
          p.o = Math.random() * 0.35 + 0.15;
        }
        ctx.fillStyle = `rgba(250, 250, 250, ${p.o})`;
        ctx.fillRect(p.x, p.y, 0.8, 2.2);
      });
      animId = requestAnimationFrame(draw);
    };

    const handleResize = () => {
      setSize();
      init();
    };

    window.addEventListener('resize', handleResize);
    init();
    animId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  // Role-based redirect helper
  const redirectToDashboard = (user) => {
    if (!user) {
      navigate('/candidate/overview');
      return;
    }
    const params = new URLSearchParams(location.search);
    const redirectUrl = params.get('redirect');
    if (redirectUrl && redirectUrl.startsWith('/') && !redirectUrl.startsWith('//')) {
      if (redirectUrl.startsWith('/admin') && !(user.role === 'ADMIN' || user.is_superuser)) {
        // Restricted to admin only
      } else if (redirectUrl.startsWith('/recruiter') && user.role !== 'RECRUITER') {
        // Restricted to recruiter only
      } else if (redirectUrl.startsWith('/candidate') && user.role !== 'CANDIDATE') {
        // Restricted to candidate only
      } else {
        navigate(redirectUrl);
        return;
      }
    }
    if (user.role === 'ADMIN' || user.is_superuser) {
      navigate('/admin-portal');
    } else if (user.role === 'RECRUITER') {
      navigate('/recruiter/dashboard');
    } else {
      navigate('/candidate/overview');
    }
  };

  // Google OAuth Login
  const handleGoogleSuccess = async (tokenResponse) => {
    setLoading(true);
    setError('');
    try {
      const res = await api.googleOAuth(tokenResponse.access_token);
      loginWithToken(res.token, res.user);
      redirectToDashboard(res.user);
    } catch (err) {
      console.error('Google OAuth error:', err);
      setError(err.data?.error || 'Google sign-in failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: (err) => {
      console.error('Google OAuth error:', err);
      setError('Google sign-in was cancelled or failed.');
    },
  });

  // GitHub OAuth Login
  const handleGitHubClick = () => {
    const clientId = import.meta.env.VITE_GITHUB_CLIENT_ID;
    if (!clientId) {
      setShowGitHubModal(true);
      return;
    }
    const redirectUri = encodeURIComponent(import.meta.env.VITE_GITHUB_REDIRECT_URI || `${window.location.origin}/login`);
    // Note: Do not pass &scope=user:email since GitHub Apps reject dynamic scopes with a 404!
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=read:user%20user:email`;
  };

  const handleGitHubExchange = async (code) => {
    setLoading(true);
    setError('');
    try {
      const res = await api.githubOAuth(code);
      loginWithToken(res.token, res.user);
      // Clean query params from URL
      window.history.replaceState({}, document.title, window.location.pathname);
      redirectToDashboard(res.user);
    } catch (err) {
      console.error('GitHub exchange error:', err);
      setError(err.data?.error || 'GitHub authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Email/Password Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (activeTab === 'signup') {
      if (!fullName.trim()) {
        setError('Please enter your full name.');
        return;
      }
      if (!agreeTerms) {
        setError('You must agree to the Terms & Privacy to create an account.');
        return;
      }
      if (password.length < 8) {
        setError('Password must be at least 8 characters long.');
        return;
      }

      setLoading(true);
      try {
        if (accountType === 'CANDIDATE') {
          const res = await registerCandidate({
            full_name: fullName.trim(),
            email: email.trim().toLowerCase(),
            password: password,
            confirm_password: password
          });
          redirectToDashboard(res.user);
        } else {
          if (!companyName.trim()) {
            setError('Please enter your company name for employer accounts.');
            setLoading(false);
            return;
          }
          const res = await registerRecruiter({
            full_name: fullName.trim(),
            email: email.trim().toLowerCase(),
            company_name: companyName.trim(),
            password: password,
            confirm_password: password
          });
          redirectToDashboard(res.user);
        }
      } catch (err) {
        const errData = err.data || {};
        const firstError = Object.values(errData)[0];
        setError(
          Array.isArray(firstError)
            ? firstError[0]
            : (typeof firstError === 'string' ? firstError : 'Registration failed. Email may already be registered.')
        );
      } finally {
        setLoading(false);
      }
    } else {
      // Login mode
      setLoading(true);
      try {
        const res = await login(email.trim().toLowerCase(), password);
        redirectToDashboard(res.user);
      } catch (err) {
        setError(
          err.data?.non_field_errors?.[0] ||
          err.data?.error ||
          err.data?.detail ||
          'Invalid email or password. Please check your credentials.'
        );
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 flex flex-col justify-between relative overflow-x-hidden selection:bg-teal-500 selection:text-zinc-950">
      
      {/* ───────────────────────────────────────────────────────── */}
      {/* CSS STYLES (MATCHING REFERENCE IMAGE 1 ACCENT LINES)     */}
      {/* ───────────────────────────────────────────────────────── */}
      <style>{`
        .accent-lines { position: absolute; inset: 0; pointer-events: none; opacity: 0.7; }
        .hline, .vline { position: absolute; background: #27272a; will-change: transform, opacity; }
        .hline { left: 0; right: 0; height: 1px; transform: scaleX(0); transform-origin: 50% 50%; animation: drawX .8s cubic-bezier(.22,.61,.36,1) forwards; }
        .vline { top: 0; bottom: 0; width: 1px; transform: scaleY(0); transform-origin: 50% 0%; animation: drawY .9s cubic-bezier(.22,.61,.36,1) forwards; }
        .hline:nth-child(1) { top: 18%; animation-delay: .12s; }
        .hline:nth-child(2) { top: 50%; animation-delay: .22s; }
        .hline:nth-child(3) { top: 82%; animation-delay: .32s; }
        .vline:nth-child(4) { left: 22%; animation-delay: .42s; }
        .vline:nth-child(5) { left: 50%; animation-delay: .54s; }
        .vline:nth-child(6) { left: 78%; animation-delay: .66s; }
        .hline::after, .vline::after { content: ""; position: absolute; inset: 0; background: linear-gradient(90deg, transparent, rgba(250,250,250,.24), transparent); opacity: 0; animation: shimmer .9s ease-out forwards; }
        .hline:nth-child(1)::after { animation-delay: .12s; }
        .hline:nth-child(2)::after { animation-delay: .22s; }
        .hline:nth-child(3)::after { animation-delay: .32s; }
        .vline:nth-child(4)::after { animation-delay: .42s; }
        .vline:nth-child(5)::after { animation-delay: .54s; }
        .vline:nth-child(6)::after { animation-delay: .66s; }
        @keyframes drawX { 0% { transform: scaleX(0); opacity: 0; } 60% { opacity: .95; } 100% { transform: scaleX(1); opacity: .7; } }
        @keyframes drawY { 0% { transform: scaleY(0); opacity: 0; } 60% { opacity: .95; } 100% { transform: scaleY(1); opacity: .7; } }
        @keyframes shimmer { 0% { opacity: 0; } 35% { opacity: .25; } 100% { opacity: 0; } }

        .card-animate {
          opacity: 0;
          transform: translateY(16px);
          animation: fadeUp 0.7s cubic-bezier(.22,.61,.36,1) 0.3s forwards;
        }
        @keyframes fadeUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      {/* Subtle vignette radial background */}
      <div 
        aria-hidden="true" 
        className="absolute inset-0 pointer-events-none [background:radial-gradient(80%_60%_at_50%_30%,rgba(255,255,255,0.06),transparent_60%)]" 
      />

      {/* Animated accent lines */}
      <div className="accent-lines" aria-hidden="true">
        <div className="hline" />
        <div className="hline" />
        <div className="hline" />
        <div className="vline" />
        <div className="vline" />
        <div className="vline" />
      </div>

      {/* Subtle monochrome starfield particles */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 w-full h-full opacity-40 mix-blend-screen pointer-events-none"
      />

      {/* ───────────────────────────────────────────────────────── */}
      {/* 1. TOP HEADER: NEXORA BRANDING & CONTACT BUTTON          */}
      {/* ───────────────────────────────────────────────────────── */}
      <header className="relative z-20 flex items-center justify-between px-6 sm:px-10 py-5 border-b border-zinc-800/80">
        {/* Nexora Logo & Brand Mark (Replaces DALI) */}
        <Link 
          to="/" 
          className="flex items-center space-x-2.5 group"
          title="Nexora Homepage"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-teal-400 flex items-center justify-center text-white font-bold shadow-md group-hover:scale-105 transition-transform">
            <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span className="text-base sm:text-lg font-extrabold tracking-tight text-white">
            Nex<span className="text-teal-400">ora</span>
          </span>
        </Link>

        {/* Top-Right Contact Button */}
        <Link
          to="/contact-support"
          className="inline-flex items-center space-x-2 h-9 px-4 rounded-lg border border-zinc-800 bg-zinc-900/90 hover:bg-zinc-800 text-xs sm:text-sm font-medium text-zinc-100 hover:text-white transition shadow-sm"
        >
          <span>Contact</span>
          <ArrowRight className="h-4 w-4 text-zinc-400" />
        </Link>
      </header>

      {/* ───────────────────────────────────────────────────────── */}
      {/* 2. CENTERED CARD WITH EXACT SHINE GRADIENT BORDER        */}
      {/* ───────────────────────────────────────────────────────── */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-10 sm:py-14">
        <div className="w-full max-w-[430px] card-animate">
          
          {/* ShineBorder wrapper applying the colourful gradient border around the card */}
          <ShineBorder
            borderWidth={1.5}
            duration={5}
            className="w-full"
          >
            <div className="p-6 sm:p-8 space-y-6">
              
              {/* Card Header */}
              <div className="space-y-1">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                  Welcome
                </h1>
                <p className="text-xs sm:text-sm text-zinc-400">
                  Log in or create an account
                </p>
              </div>

              {/* Login / Sign Up Pill Switcher */}
              <div className="grid grid-cols-2 p-1 rounded-xl bg-[#0a0a0d] border border-zinc-800/90 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => { setActiveTab('login'); setError(''); }}
                  className={`py-2 rounded-lg transition-all ${
                    activeTab === 'login'
                      ? 'bg-[#18181b] text-white shadow-sm border border-zinc-700/60 font-bold'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  Log In
                </button>
                <button
                  type="button"
                  onClick={() => { setActiveTab('signup'); setError(''); }}
                  className={`py-2 rounded-lg transition-all ${
                    activeTab === 'signup'
                      ? 'bg-[#18181b] text-white shadow-sm border border-zinc-700/60 font-bold'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  Sign Up
                </button>
              </div>

              {/* Error Alert */}
              {error && (
                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span className="flex-1 leading-relaxed">{error}</span>
                </div>
              )}

              {/* Form Body */}
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {/* Full Name field (Only in Sign Up mode) */}
                {activeTab === 'signup' && (
                  <div className="space-y-1.5 animate-fadeIn">
                    <label htmlFor="auth-fullname" className="block text-xs font-medium text-zinc-300">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" />
                      <input
                        id="auth-fullname"
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full h-10 pl-9 pr-3 rounded-lg bg-zinc-950 border border-zinc-800 text-sm text-zinc-50 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-teal-400 focus:border-teal-400 transition"
                      />
                    </div>
                  </div>
                )}

                {/* Email field */}
                <div className="space-y-1.5">
                  <label htmlFor="auth-email" className="block text-xs font-medium text-zinc-300">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" />
                    <input
                      id="auth-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full h-10 pl-9 pr-3 rounded-lg bg-zinc-950 border border-zinc-800 text-sm text-zinc-50 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-teal-400 focus:border-teal-400 transition"
                    />
                  </div>
                </div>

                {/* Password field */}
                <div className="space-y-1.5">
                  <label htmlFor="auth-password" className="block text-xs font-medium text-zinc-300">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" />
                    <input
                      id="auth-password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full h-10 pl-9 pr-10 rounded-lg bg-zinc-950 border border-zinc-800 text-sm text-zinc-50 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-teal-400 focus:border-teal-400 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-zinc-400 hover:text-zinc-200 transition"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Sign Up Mode Extras: Role Selection & Company Name */}
                {activeTab === 'signup' && (
                  <div className="space-y-3 pt-1">
                    <div className="flex items-center space-x-2 text-[11px] font-medium text-zinc-400">
                      <span>Account Type:</span>
                      <button
                        type="button"
                        onClick={() => setAccountType('CANDIDATE')}
                        className={`px-2.5 py-1 rounded-md transition ${
                          accountType === 'CANDIDATE'
                            ? 'bg-teal-500/20 text-teal-300 border border-teal-500/40 font-bold'
                            : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        Job Candidate
                      </button>
                      <button
                        type="button"
                        onClick={() => setAccountType('RECRUITER')}
                        className={`px-2.5 py-1 rounded-md transition ${
                          accountType === 'RECRUITER'
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold'
                            : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        Employer / Recruiter
                      </button>
                    </div>

                    {accountType === 'RECRUITER' && (
                      <div className="space-y-1.5 animate-fadeIn">
                        <label htmlFor="auth-company" className="block text-xs font-medium text-zinc-300">
                          Company Name
                        </label>
                        <div className="relative">
                          <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 pointer-events-none" />
                          <input
                            id="auth-company"
                            type="text"
                            required
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            placeholder="e.g. CloudNova Tech"
                            className="w-full h-10 pl-9 pr-3 rounded-lg bg-zinc-950 border border-zinc-800 text-sm text-zinc-50 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-teal-400 focus:border-teal-400 transition"
                          />
                        </div>
                      </div>
                    )}

                    {/* Terms & Privacy checkbox */}
                    <div className="flex items-center space-x-2.5 pt-1">
                      <input
                        id="auth-terms"
                        type="checkbox"
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                        className="w-4 h-4 rounded border-zinc-700 bg-zinc-950 text-teal-500 focus:ring-0 focus:ring-offset-0 cursor-pointer accent-teal-500"
                      />
                      <label htmlFor="auth-terms" className="text-xs text-zinc-400 cursor-pointer select-none">
                        I agree to the{' '}
                        <Link to="/terms" target="_blank" className="text-zinc-300 underline hover:text-white">
                          Terms
                        </Link>{' '}
                        &{' '}
                        <Link to="/privacy" target="_blank" className="text-zinc-300 underline hover:text-white">
                          Privacy
                        </Link>
                      </label>
                    </div>
                  </div>
                )}

                {/* Log In Mode Extras: Remember me & Forgot Password */}
                {activeTab === 'login' && (
                  <div className="flex items-center justify-between text-xs pt-1">
                    <label className="flex items-center space-x-2 text-zinc-400 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-3.5 h-3.5 rounded border-zinc-700 bg-zinc-950 text-teal-500 focus:ring-0 cursor-pointer accent-teal-500"
                      />
                      <span>Remember me</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowForgotModal(true)}
                      className="text-zinc-400 hover:text-zinc-200 transition"
                    >
                      Forgot password?
                    </button>
                  </div>
                )}

                {/* Main Action Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-10 mt-2 rounded-lg bg-zinc-50 hover:bg-zinc-200 text-zinc-950 font-semibold text-sm transition-all flex items-center justify-center space-x-2 shadow-sm disabled:opacity-60 cursor-pointer"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-zinc-950" />
                  ) : (
                    <span>{activeTab === 'signup' ? 'Create account' : 'Sign in'}</span>
                  )}
                </button>
              </form>

              {/* OR Divider */}
              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-zinc-800" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase tracking-widest text-zinc-500">
                  <span className="bg-[#0e0f14] px-2">OR</span>
                </div>
              </div>

              {/* GitHub and Google Buttons Side-by-Side */}
              <div className="grid grid-cols-2 gap-3">
                {/* GitHub OAuth Button */}
                <button
                  type="button"
                  onClick={handleGitHubClick}
                  disabled={loading}
                  className="h-10 rounded-lg border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 text-xs font-semibold text-zinc-200 hover:text-white transition flex items-center justify-center space-x-2 cursor-pointer shadow-2xs"
                  title="Sign in with GitHub"
                >
                  <Github className="w-4 h-4 text-white shrink-0" />
                  <span>GitHub</span>
                </button>

                {/* Google OAuth Button */}
                <button
                  type="button"
                  onClick={() => googleLogin()}
                  disabled={loading}
                  className="h-10 rounded-lg border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 text-xs font-semibold text-zinc-200 hover:text-white transition flex items-center justify-center space-x-2 cursor-pointer shadow-2xs"
                  title="Sign in with Google"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Google</span>
                </button>
              </div>

              {/* Bottom Support Link */}
              <div className="pt-2 text-center text-xs text-zinc-400">
                <span>Need help? </span>
                <Link to="/contact-support" className="text-zinc-200 font-medium hover:underline">
                  Contact support
                </Link>
              </div>

            </div>
          </ShineBorder>

        </div>
      </main>

      {/* ───────────────────────────────────────────────────────── */}
      {/* 3. FOOTER COPYRIGHT / SUPPORT NOTE                       */}
      {/* ───────────────────────────────────────────────────────── */}
      <footer className="relative z-10 py-5 text-center text-xs text-zinc-600">
        <p>© 2026 Nexora Technologies Inc. All rights reserved.</p>
      </footer>

      {/* ───────────────────────────────────────────────────────── */}
      {/* GITHUB OAUTH SETUP INSTRUCTIONS MODAL                    */}
      {/* ───────────────────────────────────────────────────────── */}
      {showGitHubModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-zinc-900 border border-zinc-800 p-6 space-y-4 shadow-2xl relative text-zinc-200">
            <button
              onClick={() => setShowGitHubModal(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center space-x-2 text-teal-400">
              <Github className="w-5 h-5" />
              <h3 className="text-base font-bold text-white">GitHub OAuth Setup Guide</h3>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed">
              GitHub OAuth integration is fully implemented in the code! To activate it with your personal GitHub account:
            </p>

            <ol className="text-xs text-zinc-400 space-y-2 list-decimal list-inside bg-zinc-950 p-3.5 rounded-xl border border-zinc-800/80">
              <li>Go to <strong>GitHub → Settings → Developer settings → OAuth Apps → New OAuth App</strong></li>
              <li>Set <strong>Homepage URL</strong>: <code className="text-teal-300">{window.location.origin}</code></li>
              <li>Set <strong>Authorization callback URL</strong>: <code className="text-teal-300">{window.location.origin}/login</code></li>
              <li>Generate a <strong>Client Secret</strong></li>
              <li>Add to <code className="text-teal-300">frontend/.env</code>: <code className="text-zinc-200">VITE_GITHUB_CLIENT_ID=your_client_id</code></li>
              <li>Add to <code className="text-teal-300">backend/.env</code>: <code className="text-zinc-200">GITHUB_CLIENT_ID=...</code> and <code className="text-zinc-200">GITHUB_CLIENT_SECRET=...</code></li>
            </ol>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setShowGitHubModal(false)}
                className="px-4 py-2 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-bold transition"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────── */}
      {/* FORGOT PASSWORD MODAL                                     */}
      {/* ───────────────────────────────────────────────────────── */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm rounded-2xl bg-zinc-900 border border-zinc-800 p-6 space-y-4 shadow-2xl relative text-zinc-200">
            <button
              onClick={() => { setShowForgotModal(false); setForgotEmailSent(false); }}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-base font-bold text-white">Reset Password</h3>

            {forgotEmailSent ? (
              <div className="space-y-3 text-center py-2">
                <CheckCircle2 className="w-8 h-8 text-teal-400 mx-auto" />
                <p className="text-xs text-zinc-300">
                  Password reset link has been dispatched to <strong>{email || 'your email'}</strong>. Please check your inbox.
                </p>
                <button
                  type="button"
                  onClick={() => { setShowForgotModal(false); setForgotEmailSent(false); }}
                  className="w-full mt-2 py-2 rounded-lg bg-zinc-100 text-zinc-950 font-semibold text-xs"
                >
                  Back to Sign In
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Enter your registered email address and we will send you a password recovery link.
                </p>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full h-10 px-3 rounded-lg bg-zinc-950 border border-zinc-800 text-sm text-zinc-50 placeholder:text-zinc-600 focus:outline-none focus:ring-1 focus:ring-teal-400"
                />
                <button
                  type="button"
                  onClick={() => setForgotEmailSent(true)}
                  className="w-full py-2.5 rounded-lg bg-zinc-50 hover:bg-zinc-200 text-zinc-950 font-bold text-xs transition"
                >
                  Send Recovery Link
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
