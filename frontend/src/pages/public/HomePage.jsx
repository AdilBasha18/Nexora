import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { WebGLShader } from '../../components/ui/web-gl-shader';
import { LiquidButton } from '../../components/ui/liquid-glass-button';
import { BorderBeam } from '../../components/ui/border-beam';
import Footer from '../../components/common/Footer';
import { 
  Compass, 
  Award, 
  FileText, 
  Bot, 
  Briefcase, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Users, 
  Target, 
  ChevronDown,
  Sparkles,
  Terminal,
  Layers,
  ChevronRight
} from 'lucide-react';

export default function HomePage() {
  const { user, isAuthenticated, isRecruiter, isAdmin } = useAuth();
  const navigate = useNavigate();

  const getDashboardLink = () => {
    if (isAdmin) return '/admin-portal';
    if (isRecruiter) return '/recruiter/dashboard';
    return '/candidate/overview';
  };

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate(getDashboardLink());
    } else {
      navigate('/register');
    }
  };

  const scrollToExplore = () => {
    const el = document.getElementById('explore-nexora');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen bg-black text-slate-100 selection:bg-teal-500 selection:text-white overflow-x-hidden font-sans">
      
      {/* ======================================================== */}
      {/* 1. FIRST SCREEN: BLACK ANIMATED HERO (EXACT UNCHANGED)   */}
      {/* ======================================================== */}
      <section className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 sm:px-6 py-12 z-10 overflow-hidden bg-black">
        
        {/* Animated rainbow WebGL light effect — strictly isolated to the hero */}
        <WebGLShader />

        {/* Centered Bordered Container with Dual Rectangular Outlines and Animated BorderBeam Light */}
        <div className="relative border border-[#27272a] p-2 w-full mx-auto max-w-3xl rounded-2xl backdrop-blur-[2px] z-10 overflow-hidden">
          {/* Animated gradient border light strictly in the narrow gap between outer & inner outlines */}
          <BorderBeam
            size={350}
            duration={12}
            colorFrom="#ffaa40"
            colorTo="#9c40ff"
            borderWidth={8}
          />
          <main className="relative border border-[#27272a] py-10 sm:py-14 px-4 sm:px-10 overflow-hidden rounded-xl bg-black/75 text-center">
            
            {/* Main Heading */}
            <h1 className="mb-4 text-white text-center text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tighter md:text-[clamp(2.2rem,6vw,5.5rem)] leading-[1.1]">
              Your Career. Your Skills. Your Future.
            </h1>

            {/* Description */}
            <p className="text-white/60 px-2 sm:px-6 text-center text-xs sm:text-sm md:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed">
              Nexora helps students and freshers discover the right career path, develop in-demand skills, prepare for opportunities, and move confidently toward their professional goals.
            </p>

            {/* Live Status Badge */}
            <div className="my-8 flex items-center justify-center gap-2">
              <span className="relative flex h-3 w-3 items-center justify-center">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
              </span>
              <p className="text-xs sm:text-sm font-medium text-green-400">
                Your Career Journey Starts Here
              </p>
            </div>

            {/* Main Action Liquid Button */}
            <div className="flex justify-center">
              <LiquidButton 
                onClick={handleGetStarted}
                className="text-white border border-white/20 rounded-full px-8 py-3.5 hover:border-white/40 cursor-pointer transition shadow-2xl" 
                size={'xl'}
              >
                <span className="flex items-center space-x-2">
                  <span>{isAuthenticated ? 'Go to Dashboard' : 'Get Started'}</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </span>
              </LiquidButton>
            </div>

          </main>
        </div>

        {/* Scroll Down Indicator */}
        <button 
          onClick={scrollToExplore}
          className="mt-10 sm:mt-12 flex flex-col items-center space-y-1.5 text-xs text-slate-400 hover:text-white transition group cursor-pointer z-10"
          aria-label="Scroll down to explore Nexora"
        >
          <span className="tracking-widest uppercase font-semibold text-[10px] text-slate-500 group-hover:text-slate-300">
            Explore Nexora Platform
          </span>
          <ChevronDown className="w-4 h-4 animate-bounce text-slate-400 group-hover:text-teal-400" />
        </button>

      </section>

      {/* ======================================================== */}
      {/* 2. EXPLORE NEXORA PLATFORM (DEEP CHARCOAL MINIMAL DESIGN) */}
      {/* Matches user's "Something new is on the way" reference     */}
      {/* ======================================================== */}
      {/* 2. EXPLORE NEXORA (DARK MINIMAL ATMOSPHERIC SECTION)     */}
      {/* ======================================================== */}
      <div 
        id="explore-nexora" 
        className="relative z-10 bg-[#090b10] border-t border-[#171b26] transition-colors duration-500"
        style={{
          background: 'radial-gradient(ellipse 90% 45% at 50% 0%, rgba(139, 92, 246, 0.16) 0%, #090b10 55%, #050608 100%)'
        }}
      >
        
        {/* ---------------------------------------------------- */}
        {/* ENTRANCE HERO: "A Smarter Way to Build Your Career"  */}
        {/* ---------------------------------------------------- */}
        <div className="pt-24 sm:pt-32 pb-8 text-center max-w-4xl mx-auto px-6 space-y-6">
          <h2 className="max-w-3xl mx-auto font-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-[1.08] text-center">
            A Smarter Way to Build Your Career
          </h2>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300 leading-relaxed font-sans text-center">
            Nexora brings career guidance, practical skill assessments, evidence-based resume evaluation, and verified hiring opportunities together in one platform.
          </p>

          <div className="pt-2 flex justify-center">
            <a 
              href="#about"
              className="rounded-full px-5 py-2 text-xs font-medium border border-purple-500/30 bg-purple-500/10 text-purple-200 hover:bg-purple-500/20 hover:border-purple-400/50 transition cursor-pointer"
            >
              Explore Platform Features
            </a>
          </div>
        </div>

        {/* ---------------------------------------------------- */}
        {/* CURVED HORIZON GLOW & SPARKLES (FROM REFERENCE)      */}
        {/* ---------------------------------------------------- */}
        <div
          aria-hidden="true"
          className="relative -mt-16 h-72 w-full overflow-hidden [mask-image:radial-gradient(50%_50%,black,transparent)] after:absolute after:-start-1/2 after:top-1/2 after:aspect-[1/0.7] after:w-[200%] after:rounded-[100%] after:border-t after:border-white/15 after:bg-[#0c0e17] after:content-[''] pointer-events-none"
        >
          <div
            className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,rgba(245,158,11,0.25)_0%,rgba(99,102,241,0.18)_40%,transparent_70%)] opacity-70"
          />
          {/* Subtle floating golden sparkles matching the reference screenshot */}
          <div className="absolute inset-x-0 bottom-8 flex justify-center items-center pointer-events-none">
            <div className="w-80 h-24 relative">
              <span className="absolute left-[20%] top-[40%] w-1.5 h-1.5 rounded-full bg-amber-400/80 shadow-[0_0_8px_rgba(251,191,36,0.9)] animate-pulse" />
              <span className="absolute left-[35%] top-[25%] w-1 h-1 rounded-full bg-amber-300/70 shadow-[0_0_6px_rgba(252,211,77,0.8)]" />
              <span className="absolute left-[50%] top-[15%] w-2 h-2 rounded-full bg-amber-200/90 shadow-[0_0_10px_rgba(253,230,138,1)] animate-ping" />
              <span className="absolute left-[65%] top-[50%] w-1.5 h-1.5 rounded-full bg-amber-400/70 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
              <span className="absolute left-[80%] top-[30%] w-1 h-1 rounded-full bg-amber-300/80 shadow-[0_0_6px_rgba(252,211,77,0.8)]" />
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------- */}
        {/* CORE PLATFORM FEATURES                               */}
        {/* ---------------------------------------------------- */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-28 sm:space-y-36 pb-24 -mt-16">

          {/* 1. ABOUT NEXORA */}
          <section id="about" className="space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-mono uppercase tracking-widest text-slate-500">Platform Pillars</span>
              <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Designed to Eliminate Hiring Friction
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-7 rounded-2xl bg-[#0c0f17] border border-[#1e2433] hover:border-teal-500/40 transition duration-300 space-y-3 shadow-lg">
                <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center font-bold">
                  <Target className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-white">Honest & Evidence-Based</h4>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  No arbitrary algorithms or inflated scores. Candidate progress is measured against verified test cases and real-world developer standards.
                </p>
              </div>

              <div className="p-7 rounded-2xl bg-[#0c0f17] border border-[#1e2433] hover:border-purple-500/40 transition duration-300 space-y-3 shadow-lg">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-white">Scam Shield Protection</h4>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Zero fee traps, fake recruiters, or phantom jobs. All corporate accounts and vacancies undergo administrator verification before going live.
                </p>
              </div>

              <div className="p-7 rounded-2xl bg-[#0c0f17] border border-[#1e2433] hover:border-blue-500/40 transition duration-300 space-y-3 shadow-lg">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold">
                  <Layers className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-white">Unified Career Journey</h4>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Discover roadmaps, benchmark coding skills, optimize your ATS resume, and apply to matched vacancies without jumping between disconnected apps.
                </p>
              </div>
            </div>
          </section>

          {/* 2. DISCOVER YOUR CAREER (CAREER GPS) */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold">
                <Compass className="w-3.5 h-3.5" />
                <span>Career GPS & Roadmaps</span>
              </div>
              
              <h3 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                Personalized Career Roadmaps Tailored to Your Ambitions
              </h3>
              
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                Navigate your tech career with clarity. Career GPS maps out the exact technical competencies and milestones required for high-demand specializations—from Full-Stack Engineering to Cloud DevOps and Data Science.
              </p>

              <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
                <li className="flex items-start space-x-3">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <span>Targeted skill gap analysis based on 25+ industry-aligned role profiles.</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <span>Structured milestone roadmaps with curated technical documentation.</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                  <span>Dynamic Job Readiness Score tracking your verifiable progress over time.</span>
                </li>
              </ul>

              <div className="pt-2">
                <Link
                  to={isAuthenticated ? "/career-gps" : "/register"}
                  className="inline-flex items-center space-x-2 text-xs font-semibold text-purple-300 hover:text-white transition"
                >
                  <span>Explore Career Roadmaps</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="p-6 sm:p-8 rounded-3xl bg-[#0c0f17] border border-[#1e2433] space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-[#1e2433] pb-4">
                <span className="text-xs font-mono font-bold text-slate-200">Target Role: Full-Stack Developer</span>
                <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[11px] font-bold">
                  85% Readiness
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1.5">
                  <div className="flex justify-between font-semibold text-slate-200">
                    <span>Backend Fundamentals (Django, REST, Auth)</span>
                    <span className="text-emerald-400">Completed</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                    <div className="w-full h-full bg-emerald-500"></div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1.5">
                  <div className="flex justify-between font-semibold text-slate-200">
                    <span>Frontend Architecture (React, State, Tailwind)</span>
                    <span className="text-emerald-400">Completed</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                    <div className="w-full h-full bg-emerald-500"></div>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1.5">
                  <div className="flex justify-between font-semibold text-slate-200">
                    <span>Cloud Deployment & Docker Sandbox</span>
                    <span className="text-purple-400">Next Milestone</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                    <div className="w-2/3 h-full bg-purple-500"></div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 3. BUILD YOUR SKILLS (SKILL ASSESSMENTS) */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 p-6 sm:p-8 rounded-3xl bg-[#0c0f17] border border-[#1e2433] space-y-4 shadow-xl">
              <div className="flex items-center space-x-2 text-xs text-teal-400 font-mono">
                <Terminal className="w-4 h-4" />
                <span>Nexora Code Sandbox Engine</span>
              </div>
              <div className="p-4 rounded-2xl bg-black border border-[#1e2433] font-mono text-xs text-slate-300 space-y-2">
                <p className="text-slate-500">// Problem: Two Sum Target Resolution</p>
                <p><span className="text-blue-400">def</span> <span className="text-teal-300">two_sum</span>(nums: list, target: int) -&gt; list:</p>
                <p className="pl-4">lookup = {'{}'}</p>
                <p className="pl-4"><span className="text-purple-400">for</span> idx, num <span className="text-purple-400">in</span> enumerate(nums):</p>
                <p className="pl-8">comp = target - num</p>
                <p className="pl-8"><span className="text-purple-400">if</span> comp <span className="text-purple-400">in</span> lookup:</p>
                <p className="pl-12"><span className="text-blue-400">return</span> [lookup[comp], idx]</p>
                <p className="pl-8">lookup[num] = idx</p>
              </div>
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center justify-between">
                <span className="font-semibold">All 10/10 Test Cases Passed</span>
                <span className="font-mono text-[11px]">Runtime: 24ms</span>
              </div>
            </div>

            <div className="order-1 lg:order-2 space-y-6">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-400 text-xs font-semibold">
                <Award className="w-3.5 h-3.5" />
                <span>Skill Assessments & Quizzes</span>
              </div>
              
              <h3 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                Prove Real Coding Ability With Standardized Challenges
              </h3>
              
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                Ditch superficial claims. Nexora evaluates technical competence using structured 10-question assessments (5 core concept MCQs + 5 hands-on coding challenges executed live).
              </p>

              <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
                <li className="flex items-start space-x-3">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                  <span>Multi-language execution supporting Python, JavaScript, Java, and SQL.</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                  <span>Sequential question unlocking with anti-cheat sandbox isolation.</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                  <span>Permanent verified score badges linked directly to employer applications.</span>
                </li>
              </ul>

              <div className="pt-2">
                <Link
                  to={isAuthenticated ? "/assessments" : "/register"}
                  className="inline-flex items-center space-x-2 text-xs font-semibold text-teal-300 hover:text-white transition"
                >
                  <span>Take a Skill Assessment</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </section>

          {/* 4. IMPROVE YOUR RESUME (ATS RESUME CHECKER) */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
                <FileText className="w-3.5 h-3.5" />
                <span>ATS Resume Checker</span>
              </div>
              
              <h3 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                Evidence-Based Resume Analysis & Optimization
              </h3>
              
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                Ensure your resume passes modern applicant tracking systems without using gimmicks. Our parser inspects file structure, table formatting, typography, and quantifiable achievement phrasing.
              </p>

              <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
                <li className="flex items-start space-x-3">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <span>Deep layout parsing across PDF and DOCX files to detect extraction errors.</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <span>Independent quality breakdown across completeness, metrics, and action verbs.</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <span>Resume Improvement Studio with editable side-by-side phrasing suggestions.</span>
                </li>
              </ul>

              <div className="pt-2">
                <Link
                  to={isAuthenticated ? "/ats-checker" : "/register"}
                  className="inline-flex items-center space-x-2 text-xs font-semibold text-blue-300 hover:text-white transition"
                >
                  <span>Check Your Resume</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="p-6 sm:p-8 rounded-3xl bg-[#0c0f17] border border-[#1e2433] space-y-4 shadow-xl">
              <div className="flex items-center justify-between border-b border-[#1e2433] pb-3">
                <span className="text-xs font-bold text-white">ATS Compatibility Score</span>
                <span className="text-sm font-black text-emerald-400">92 / 100</span>
              </div>
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between items-center text-slate-300">
                  <span>Layout & Parsing Readability</span>
                  <span className="text-emerald-400 font-semibold">100% Pass</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Quantifiable Impact & Metrics</span>
                  <span className="text-emerald-400 font-semibold">88% Strong</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Technical Skills Classification</span>
                  <span className="text-emerald-400 font-semibold">95% Matched</span>
                </div>
                <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-200 text-[11px] leading-relaxed">
                  💡 <strong>ATS Recommendation:</strong> Highlight measurable improvements (e.g. "Reduced query latency by 35% with Redis caching") rather than passive job duties.
                </div>
              </div>
            </div>
          </section>

          {/* 5. PREPARE FOR INTERVIEWS (AI CAREER ASSISTANT) */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 p-6 sm:p-8 rounded-3xl bg-[#0c0f17] border border-[#1e2433] space-y-4 shadow-xl">
              <div className="flex items-center space-x-2 text-xs text-blue-400">
                <Bot className="w-4 h-4" />
                <span className="font-bold">Nexora AI Career Assistant</span>
              </div>
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-slate-300 max-w-[85%]">
                  How should I explain the trade-offs of microservices vs monoliths in a junior backend interview?
                </div>
                <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-200 leading-relaxed max-w-[95%] space-y-2">
                  <p>Use the <strong>Context & Scale Framework</strong>:</p>
                  <p>1. <strong>Monolith:</strong> Simpler deployment, single database ACID transactions, minimal network overhead. Ideal for smaller teams.</p>
                  <p>2. <strong>Microservices:</strong> Independent team deployments, isolated horizontal scaling, but adds network latency and distributed data complexity.</p>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2 space-y-6">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold">
                <Bot className="w-3.5 h-3.5" />
                <span>Interview Preparation</span>
              </div>
              
              <h3 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                24/7 AI Career Guidance & Technical Mock Interviews
              </h3>
              
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                Practice answering behavioral STAR-method scenarios, receive architectural breakdowns, and prepare for system design rounds with our platform-grounded AI mentor.
              </p>

              <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
                <li className="flex items-start space-x-3">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>Tailored mock interview questions for your selected career role.</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>Real-time code debugging, algorithmic explanations, and complexity reviews.</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>Strict data confidentiality: user records and credentials are never exposed.</span>
                </li>
              </ul>

              <div className="pt-2">
                <Link
                  to={isAuthenticated ? "/assistant" : "/register"}
                  className="inline-flex items-center space-x-2 text-xs font-semibold text-cyan-300 hover:text-white transition"
                >
                  <span>Chat With AI Assistant</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </section>

          {/* 6. FIND VERIFIED JOBS */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
                <Briefcase className="w-3.5 h-3.5" />
                <span>Verified Job Matching</span>
              </div>
              
              <h3 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                Find Verified Roles That Match Your Demonstrated Skills
              </h3>
              
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                Stop submitting applications into black holes. Nexora pairs your verified assessment benchmarks with vacancies posted directly by authenticated corporate hiring teams.
              </p>

              <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
                <li className="flex items-start space-x-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>100% verified employer listings with transparent salary and remote work terms.</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Objective skill compatibility score displayed before you apply.</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Real-time status tracking from application submission to interview scheduling.</span>
                </li>
              </ul>

              <div className="pt-2">
                <Link
                  to="/jobs"
                  className="inline-flex items-center space-x-2 text-xs font-semibold text-emerald-300 hover:text-white transition"
                >
                  <span>Browse Verified Openings</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="p-6 sm:p-8 rounded-3xl bg-[#0c0f17] border border-[#1e2433] space-y-4 shadow-xl">
              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center font-bold text-xs">
                      TC
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Junior Backend Engineer</h4>
                      <p className="text-[11px] text-slate-400">TechCorp Solutions • Remote</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                    Verified Opening
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="px-2 py-0.5 rounded-md bg-zinc-800 text-slate-300 text-[10px]">Python</span>
                  <span className="px-2 py-0.5 rounded-md bg-zinc-800 text-slate-300 text-[10px]">Django</span>
                  <span className="px-2 py-0.5 rounded-md bg-zinc-800 text-slate-300 text-[10px]">PostgreSQL</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs">
                      CN
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">Frontend Developer</h4>
                      <p className="text-[11px] text-slate-400">CloudNova Systems • Hybrid</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                    Verified Opening
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="px-2 py-0.5 rounded-md bg-zinc-800 text-slate-300 text-[10px]">React</span>
                  <span className="px-2 py-0.5 rounded-md bg-zinc-800 text-slate-300 text-[10px]">TypeScript</span>
                  <span className="px-2 py-0.5 rounded-md bg-zinc-800 text-slate-300 text-[10px]">Tailwind</span>
                </div>
              </div>
            </div>
          </section>

          {/* 7. FOR RECRUITERS */}
          <section className="p-8 sm:p-12 rounded-3xl bg-[#0c0f17] border border-[#1e2433] shadow-xl">
            <div className="max-w-3xl space-y-4 mb-8">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
                <Users className="w-3.5 h-3.5" />
                <span>For Recruiters & Hiring Teams</span>
              </div>
              
              <h3 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                Hire Verified Talent Without Manual Resume Sifting
              </h3>
              
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                Tired of sorting through hundreds of inflated resumes? Nexora gives recruiters access to candidates with demonstrated assessment performance and objective benchmark percentiles.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs sm:text-sm">
              <div className="p-5 rounded-2xl bg-black/40 border border-[#1e2433] space-y-2">
                <h4 className="font-bold text-white flex items-center">
                  <CheckCircle2 className="w-4 h-4 mr-2 text-amber-400" />
                  Pre-Evaluated Coding Scores
                </h4>
                <p className="text-slate-400 leading-relaxed">
                  Review actual test execution results, code cleanliness, and time efficiency before scheduling a single interview.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-black/40 border border-[#1e2433] space-y-2">
                <h4 className="font-bold text-white flex items-center">
                  <CheckCircle2 className="w-4 h-4 mr-2 text-amber-400" />
                  AI Recruiter Studio
                </h4>
                <p className="text-slate-400 leading-relaxed">
                  Draft tailored, bias-free job descriptions and technical evaluation criteria in seconds with built-in AI tooling.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-black/40 border border-[#1e2433] space-y-2">
                <h4 className="font-bold text-white flex items-center">
                  <CheckCircle2 className="w-4 h-4 mr-2 text-amber-400" />
                  Employer Verification Badges
                </h4>
                <p className="text-slate-400 leading-relaxed">
                  Establish corporate trust and attract high-caliber applicants with official Verified Employer accreditation.
                </p>
              </div>
            </div>

            <div className="pt-6">
              <Link
                to={isRecruiter ? "/recruiter/dashboard" : "/for-employers"}
                className="inline-flex items-center space-x-2 text-xs font-semibold text-amber-300 hover:text-white transition"
              >
                <span>Discover Recruiter Solutions</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </section>

          {/* 8. BOTTOM CALL TO ACTION */}
          <section className="relative text-center p-10 sm:p-16 rounded-3xl border border-[#1e2433] bg-gradient-to-b from-[#0c0f17] to-black overflow-hidden shadow-2xl">
            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <h3 className="text-3xl sm:text-5xl font-bold text-white tracking-tight">
                Ready to Shape Your Career?
              </h3>
              <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
                Create your account in seconds to begin your career roadmap, test your technical skills, and connect with verified hiring teams.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
                <button
                  onClick={handleGetStarted}
                  className="px-8 py-3 rounded-full bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm transition shadow-lg hover:shadow-teal-500/25 cursor-pointer"
                >
                  {isAuthenticated ? 'Open Dashboard' : 'Get Started Free'}
                </button>
                <Link
                  to="/jobs"
                  className="px-8 py-3 rounded-full border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white font-medium text-sm transition"
                >
                  Browse Job Board
                </Link>
              </div>
            </div>
          </section>

        </div>

        {/* ======================================================== */}
        {/* 3. HALFTONE WORDMARK FOOTER (AT BOTTOM OF PUBLIC HOMEPAGE)*/}
        {/* ======================================================== */}
        <Footer />

      </div>

    </div>
  );
}
