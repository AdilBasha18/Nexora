import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { SunMoonThemeToggle } from '../../components/ui/sun-moon-theme-toggle';
import { RadialBackground } from '../../components/ui/radial-background';
import LogoutConfirmModal from '../../components/common/LogoutConfirmModal';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Briefcase, 
  Users, 
  Building2, 
  LogOut, 
  Menu, 
  X, 
  ChevronRight,
  Bot
} from 'lucide-react';

export default function RecruiterLayout() {
  const { user } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  const navItems = [
    { name: 'Dashboard Overview', path: '/recruiter/dashboard', icon: LayoutDashboard },
    { name: 'Post a Job', path: '/recruiter/jobs/new', icon: PlusCircle },
    { name: 'Manage Jobs', path: '/recruiter/jobs', icon: Briefcase },
    { name: 'Review Applicants', path: '/recruiter/applicants', icon: Users },
    { name: 'AI Recruiter Assistant', path: '/recruiter/assistant', icon: Bot },
    { name: 'Company Profile & Verification', path: '/recruiter/company', icon: Building2 },
  ];

  return (
    <>
      <div className="min-h-screen bg-slate-50 dark:bg-[#1B1035] text-slate-800 dark:text-slate-100 flex flex-col md:flex-row transition-colors duration-200">
        
        {/* Mobile Top Bar */}
        <div className="md:hidden bg-navy-900 dark:bg-[#0e091e] border-b border-navy-800 dark:border-purple-200/70 text-white p-4 flex items-center justify-between sticky top-0 z-30 shadow-md">
          <Link 
            to="/recruiter/dashboard" 
            className="flex items-center space-x-2"
            title="Recruiter Dashboard Overview"
          >
            <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center font-bold text-xs text-navy-950 shadow-sm">
              N
            </div>
            <span className="font-bold text-base tracking-tight">Nexora Employer</span>
          </Link>

          <div className="flex items-center space-x-2">
            <SunMoonThemeToggle size={34} />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-1.5 rounded-lg bg-navy-800 dark:bg-purple-950/40 text-slate-300"
              aria-label="Toggle navigation menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <aside className={`
          fixed inset-y-0 left-0 z-40 w-64 bg-navy-900 dark:bg-[#0e091e] border-r border-navy-800 dark:border-purple-950/60/80 text-slate-300 transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:inset-auto md:min-h-screen flex flex-col justify-between shrink-0
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div>
            {/* Brand Wordmark in Sidebar - Clicking logo opens recruiter dashboard overview */}
            <div className="p-5 border-b border-navy-800 dark:border-purple-950/60/80 flex items-center justify-between">
              <Link 
                to="/recruiter/dashboard" 
                className="flex items-center space-x-2.5 group"
                title="Nexora Recruiter Dashboard"
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-500 to-blue-600 flex items-center justify-center text-white font-bold shadow group-hover:scale-105 transition-transform">
                  <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="text-lg font-extrabold text-white tracking-tight">
                  Nex<span className="text-teal-400">ora</span>
                </span>
              </Link>

              {/* Theme Toggle in desktop sidebar */}
              <div className="hidden md:flex items-center">
                <SunMoonThemeToggle size={32} />
              </div>
            </div>

            {/* User Brief Card */}
            <div className="px-4 py-3 mx-3 my-3 bg-navy-800/60 dark:bg-purple-950/40/40 rounded-xl border border-navy-700/50 dark:border-slate-700/50 flex items-center space-x-3">
              <div className="w-9 h-9 rounded-lg bg-teal-500 text-navy-950 font-bold flex items-center justify-center shrink-0 shadow-xs">
                {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'R'}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-white truncate">{user?.full_name}</p>
                <p className="text-[10px] text-teal-400 truncate font-medium">Recruiter Portal</p>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="px-3 py-2 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-medium transition ${
                      isActive
                        ? 'bg-teal-600 text-white font-semibold shadow-sm'
                        : 'text-slate-400 hover:text-white hover:bg-navy-800 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Bottom Actions with Logout */}
          <div className="p-4 border-t border-navy-800 dark:border-purple-950/60/80 space-y-2">
            <Link
              to="/jobs"
              className="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-navy-800 dark:hover:bg-slate-800/60 transition"
            >
              <span>Public Job Board</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>

            {/* Clearly visible Logout button */}
            <button
              type="button"
              onClick={() => setLogoutModalOpen(true)}
              className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 font-medium transition"
              title="Log out of Nexora"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area with Global Pastel (Light) / Lavender-Purple Radial (Dark) & Top Bar */}
        <main className="flex-1 flex flex-col overflow-x-hidden min-h-screen relative authenticated-gradient-bg">
          <RadialBackground />

          {/* Top Header with Breadcrumbs, Profile & Logout */}
          <header className="hidden md:flex items-center justify-between px-6 py-3.5 bg-white/80 dark:bg-[#1B1035]/85 backdrop-blur-md border-b border-slate-200/60 dark:border-purple-800/40 sticky top-0 z-20 shadow-2xs">
            <div className="flex items-center space-x-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                Recruiter Workspace
              </span>
              <span className="text-slate-300 dark:text-purple-500">/</span>
              <span className="text-sm font-bold text-slate-800 dark:text-white">
                {navItems.find(i => i.path === location.pathname)?.name || 'Dashboard'}
              </span>
            </div>

            <div className="flex items-center space-x-4">
              {/* User Profile Pill */}
              <div className="flex items-center space-x-2.5 px-3 py-1.5 rounded-full bg-white/90 dark:bg-[#251846] border border-slate-200/80 dark:border-purple-700/50 shadow-2xs">
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-teal-500 to-emerald-400 text-navy-950 text-[11px] font-bold flex items-center justify-center">
                  {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'R'}
                </div>
                <span className="text-xs font-semibold text-slate-700 dark:text-purple-100 truncate max-w-[140px]">
                  {user?.full_name || 'Recruiter'}
                </span>
              </div>

              {/* Top Header Logout Button */}
              <button
                type="button"
                onClick={() => setLogoutModalOpen(true)}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 hover:text-white dark:text-rose-400 bg-rose-50 hover:bg-rose-600 dark:bg-rose-950/40 dark:hover:bg-rose-600 border border-rose-200/80 dark:border-rose-900/40 transition shadow-2xs"
                title="Log out of Nexora"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          </header>

          <div className="flex-1">
            <Outlet />
          </div>
        </main>

      </div>

      {/* Confirmation Dialog for Logout */}
      <LogoutConfirmModal 
        isOpen={logoutModalOpen} 
        onClose={() => setLogoutModalOpen(false)} 
      />
    </>
  );
}
