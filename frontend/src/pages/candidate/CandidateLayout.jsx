import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
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
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

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
    { name: 'My Resumes', path: '/candidate/resumes', icon: FileText },
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
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-navy-900 text-white p-4 flex items-center justify-between sticky top-0 z-30 shadow-md">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-xs">
            N
          </div>
          <span className="font-bold text-base tracking-tight">Nexora Candidate</span>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-1.5 rounded-lg bg-navy-800 text-slate-300"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-navy-900 text-slate-300 transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:inset-auto md:min-h-screen flex flex-col justify-between shrink-0
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div>
          {/* Brand Wordmark in Sidebar */}
          <div className="p-6 border-b border-navy-800 flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-teal-400 flex items-center justify-center text-white font-bold shadow">
                <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-lg font-extrabold text-white tracking-tight">
                Nex<span className="text-teal-400">ora</span>
              </span>
            </Link>
          </div>

          {/* User Brief Card */}
          <div className="px-4 py-3 mx-3 my-3 bg-navy-800/60 rounded-xl border border-navy-700/50 flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600 text-white font-bold flex items-center justify-center shrink-0">
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
                      : 'text-slate-400 hover:text-white hover:bg-navy-800'
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

        {/* Bottom Actions */}
        <div className="p-4 border-t border-navy-800 space-y-2">
          <Link
            to="/jobs"
            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-navy-800"
          >
            <span>Browse Job Board</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={() => { logout(); navigate('/'); }}
            className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-xs text-red-400 hover:bg-red-950/40 font-medium transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-x-hidden min-h-screen">
        <Outlet />
      </main>

    </div>
  );
}

