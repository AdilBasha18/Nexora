import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { SunMoonThemeToggle } from '../../components/ui/sun-moon-theme-toggle';
import { RadialBackground } from '../../components/ui/radial-background';
import LogoutConfirmModal from '../../components/common/LogoutConfirmModal';
import { 
  LayoutDashboard, 
  User, 
  FileText, 
  Sparkles, 
  Bookmark, 
  Briefcase, 
  Award, 
  Compass, 
  TrendingUp, 
  Bot, 
  Bell, 
  LogOut, 
  Menu, 
  X,
  ChevronRight
} from 'lucide-react';

export default function CandidateLayout() {
  const { user } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  useEffect(() => {
    async function loadNotifications() {
      try {
        const notifs = await api.getNotifications();
        const list = notifs.results || notifs;
        setUnreadCount(list.filter(n => !n.is_read).length);
      } catch (e) {
        console.error(e);
      }
    }
    loadNotifications();
  }, [location.pathname]);

  const navItems = [
    { name: 'Dashboard Overview', path: '/candidate/overview', icon: LayoutDashboard },
    { name: 'My Profile', path: '/candidate/profile', icon: User },
    { name: 'Profile Setup (9 Steps)', path: '/candidate/setup-profile', icon: Sparkles },
    { name: 'ATS Resume Checker', path: '/ats-checker', icon: FileText },
    { name: 'Recommended Jobs', path: '/candidate/recommended-jobs', icon: Sparkles },
    { name: 'Saved Jobs', path: '/candidate/saved-jobs', icon: Bookmark },
    { name: 'My Applications', path: '/candidate/applications', icon: Briefcase },
    { name: 'Skill Assessments', path: '/assessments', icon: Award },
    { name: 'Career GPS', path: '/career-gps', icon: Compass },
    { name: 'Job Readiness Score', path: '/candidate/readiness', icon: TrendingUp },
    { name: 'AI Career Assistant', path: '/assistant', icon: Bot },
    { 
      name: 'Notifications', 
      path: '/candidate/notifications', 
      icon: Bell, 
      badge: unreadCount > 0 ? unreadCount : null 
    },
  ];

  return (
    <>
      <div className="min-h-screen bg-slate-50 dark:bg-[#1B1035] text-slate-800 dark:text-slate-100 flex flex-col md:flex-row transition-colors duration-200">
        
        {/* Mobile Top Bar */}
        <div className="md:hidden bg-navy-900 dark:bg-[#0e091e] border-b border-navy-800 dark:border-purple-200/70 text-white p-4 flex items-center justify-between sticky top-0 z-30 shadow-md">
          <Link 
            to="/candidate/overview" 
            className="flex items-center space-x-2"
            title="Candidate Dashboard Overview"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-xs shadow-sm">
              N
            </div>
            <span className="font-bold text-base tracking-tight">Nexora Candidate</span>
          </Link>

          <div className="flex items-center space-x-2">
            <SunMoonThemeToggle size={34} />
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-1.5 rounded-lg bg-navy-800 dark:bg-purple-950/50 text-slate-300"
              aria-label="Toggle navigation menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <aside className={`
          fixed inset-y-0 left-0 z-40 w-64 bg-navy-900 dark:bg-[#0f0c1b] border-r border-navy-800 dark:border-purple-950/60 text-slate-300 transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:inset-auto md:min-h-screen flex flex-col justify-between shrink-0
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div>
            {/* Brand Wordmark in Sidebar - Clicking logo opens candidate dashboard overview */}
            <div className="p-5 border-b border-navy-800 dark:border-purple-950/60 flex items-center justify-between">
              <Link 
                to="/candidate/overview" 
                className="flex items-center space-x-2.5 group"
                title="Nexora Candidate Dashboard"
              >
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-teal-400 flex items-center justify-center text-white font-bold shadow group-hover:scale-105 transition-transform">
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
            <div className="px-4 py-3 mx-3 my-3 bg-navy-800/60 dark:bg-purple-950/40 rounded-xl border border-navy-700/50 dark:border-purple-800/40 flex items-center space-x-3">
              <div className="w-9 h-9 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center shrink-0 shadow-xs">
                {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'C'}
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-semibold text-white truncate">{user?.full_name}</p>
                <p className="text-[10px] text-teal-400 truncate font-medium">Candidate Portal</p>
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
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition ${
                      isActive
                        ? 'bg-blue-600 text-white font-semibold shadow-sm'
                        : 'text-slate-400 hover:text-white hover:bg-navy-800 dark:hover:bg-purple-950/40'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.name}</span>
                    </div>
                    {item.badge && (
                      <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-500 text-navy-950">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Bottom Actions with Logout */}
          <div className="p-4 border-t border-navy-800 dark:border-purple-950/60 space-y-2">
            <Link
              to="/jobs"
              className="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-navy-800 dark:hover:bg-purple-950/40 transition"
            >
              <span>Browse Job Board</span>
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
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-purple-300">
                Candidate Workspace
              </span>
              <span className="text-slate-300 dark:text-purple-500">/</span>
              <span className="text-sm font-bold text-slate-800 dark:text-white">
                {navItems.find(i => i.path === location.pathname)?.name || 'Dashboard'}
              </span>
            </div>

            <div className="flex items-center space-x-4">
              {/* User Profile Pill */}
              <div className="flex items-center space-x-2.5 px-3 py-1.5 rounded-full bg-white/90 dark:bg-[#251846] border border-slate-200/80 dark:border-purple-700/50 shadow-2xs">
                <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-600 to-teal-400 text-white text-[11px] font-bold flex items-center justify-center">
                  {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'C'}
                </div>
                <span className="text-xs font-semibold text-slate-700 dark:text-purple-100 truncate max-w-[140px]">
                  {user?.full_name || 'Candidate'}
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
