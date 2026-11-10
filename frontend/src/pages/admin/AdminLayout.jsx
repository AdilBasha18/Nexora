import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  ShieldAlert, 
  CheckCircle, 
  Briefcase, 
  FileWarning, 
  History, 
  LogOut, 
  Menu, 
  X, 
  LayoutDashboard,
  ChevronRight
} from 'lucide-react';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { name: 'Admin Overview', path: '/admin-portal', icon: LayoutDashboard },
    { name: 'Company Verifications', path: '/admin-portal/verifications', icon: CheckCircle },
    { name: 'Job Moderation', path: '/admin-portal/jobs', icon: Briefcase },
    { name: 'Scam Shield Reports', path: '/admin-portal/reports', icon: FileWarning },
    { name: 'Audit Logs', path: '/admin-portal/audit-logs', icon: History },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-purple-950 text-white p-4 flex items-center justify-between sticky top-0 z-30 shadow-md">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-7 h-7 rounded-lg bg-purple-600 flex items-center justify-center font-bold text-xs text-white">
            A
          </div>
          <span className="font-bold text-base tracking-tight">Nexora Admin Operations</span>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-1.5 rounded-lg bg-purple-900 text-slate-300"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-slate-950 text-slate-300 transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:inset-auto md:min-h-screen flex flex-col justify-between shrink-0
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div>
          {/* Brand Wordmark in Sidebar */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <span className="text-lg font-extrabold text-white tracking-tight">
                Nexora <span className="text-purple-400 text-xs font-bold uppercase tracking-wider block">Admin</span>
              </span>
            </Link>
          </div>

          {/* User Brief Card */}
          <div className="px-4 py-3 mx-3 my-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-purple-600 text-white font-bold flex items-center justify-center shrink-0">
              {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'A'}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold text-white truncate">{user?.full_name}</p>
              <p className="text-[10px] text-purple-400 truncate font-medium">Platform Administrator</p>
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
                      ? 'bg-purple-600 text-white font-semibold shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link
            to="/jobs"
            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-slate-900"
          >
            <span>Public Website</span>
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

