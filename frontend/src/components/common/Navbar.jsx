import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { SunMoonThemeToggle } from '../ui/sun-moon-theme-toggle';
import LogoutConfirmModal from './LogoutConfirmModal';
import { 
  LogOut, 
  LayoutDashboard,
  ShieldAlert,
  ChevronDown,
  ArrowRight
} from 'lucide-react';

export default function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const { user, isAuthenticated, isAdmin, isRecruiter } = useAuth();
  const location = useLocation();
  const isDarkHome = location.pathname === '/';

  const getDashboardLink = () => {
    if (isAdmin) return '/admin-portal';
    if (isRecruiter) return '/recruiter/dashboard';
    return '/candidate/overview';
  };

  // Authenticated logo click goes to dashboard overview; unauthenticated goes to /
  const logoDestination = isAuthenticated ? getDashboardLink() : '/';

  return (
    <>
      <header className={`sticky top-0 z-40 transition-colors duration-200 ${
        isDarkHome 
          ? 'bg-black/85 backdrop-blur-md border-b border-white/10 text-white' 
          : 'bg-white/95 dark:bg-[#0b101d]/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo & Brand Wordmark */}
            <Link 
              to={logoDestination} 
              className="flex items-center space-x-2.5 group"
              title={isAuthenticated ? "Go to Dashboard Overview" : "Nexora Home"}
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-navy-900 via-blue-700 to-teal-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
                <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className={`text-xl font-extrabold tracking-tight ${isDarkHome ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                  Nex<span className="text-blue-500 dark:text-teal-400">ora</span>
                </span>
                <span className={`text-[10px] -mt-1 font-medium tracking-wide ${isDarkHome ? 'text-slate-400' : 'text-slate-500 dark:text-slate-400'}`}>
                  Career Intelligence Platform
                </span>
              </div>
            </Link>

            {/* Right Side: Theme Toggle & User Auth Actions */}
            <div className="flex items-center space-x-3">
              
              {/* Global Theme Toggle */}
              <div className="flex items-center">
                <SunMoonThemeToggle size={36} />
              </div>

              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <Link
                    to={getDashboardLink()}
                    className={`inline-flex items-center px-4 py-2 rounded-xl text-xs font-semibold shadow-xs transition ${
                      isDarkHome
                        ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                        : 'bg-navy-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700 text-white'
                    }`}
                  >
                    <LayoutDashboard className="w-3.5 h-3.5 mr-1.5 text-teal-400" />
                    <span>Go to Dashboard</span>
                  </Link>

                  <div className="relative">
                    <button
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      className={`flex items-center space-x-2 pl-3 pr-2 py-1.5 rounded-xl border transition shadow-2xs text-xs ${
                        isDarkHome
                          ? 'border-white/15 bg-white/5 hover:bg-white/10 text-white'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100'
                      }`}
                      aria-label="User menu"
                    >
                      <div className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-500 dark:text-blue-400 font-semibold flex items-center justify-center">
                        {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <span className="hidden sm:inline font-semibold truncate max-w-[100px]">
                        {user?.full_name || 'My Account'}
                      </span>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                    </button>

                    {/* Dropdown Menu */}
                    {dropdownOpen && (
                      <div className={`absolute right-0 mt-2 w-56 rounded-2xl shadow-2xl py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150 ${
                        isDarkHome
                          ? 'bg-[#121217] border border-zinc-800 text-white'
                          : 'bg-white dark:bg-[#121624] border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white'
                      }`}>
                        <div className={`px-4 py-2.5 border-b ${isDarkHome ? 'border-zinc-800' : 'border-slate-100 dark:border-slate-800'}`}>
                          <p className="text-xs font-semibold truncate">{user?.full_name}</p>
                          <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                          <span className="inline-block mt-1 px-2 py-0.5 rounded-md bg-blue-500/20 text-[10px] font-bold text-blue-500 dark:text-blue-400 capitalize">
                            {user?.role?.toLowerCase() || 'candidate'}
                          </span>
                        </div>

                        <Link
                          to={getDashboardLink()}
                          onClick={() => setDropdownOpen(false)}
                          className={`flex items-center px-4 py-2 text-xs font-medium transition ${
                            isDarkHome 
                              ? 'text-slate-200 hover:bg-zinc-800/80 hover:text-white' 
                              : 'text-slate-700 dark:text-slate-200 hover:bg-blue-50 dark:hover:bg-slate-800 hover:text-blue-700 dark:hover:text-white'
                          }`}
                        >
                          <LayoutDashboard className="w-4 h-4 mr-2 text-blue-500" />
                          Dashboard Overview
                        </Link>

                        {isAdmin && (
                          <Link
                            to="/admin-portal"
                            onClick={() => setDropdownOpen(false)}
                            className={`flex items-center px-4 py-2 text-xs font-medium transition ${
                              isDarkHome ? 'text-purple-300 hover:bg-zinc-800/80' : 'text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/30'
                            }`}
                          >
                            <ShieldAlert className="w-4 h-4 mr-2 text-purple-400" />
                            Admin Console
                          </Link>
                        )}

                        <button
                          type="button"
                          onClick={() => {
                            setDropdownOpen(false);
                            setLogoutModalOpen(true);
                          }}
                          className={`w-full flex items-center px-4 py-2 text-xs font-medium text-left border-t mt-1 transition ${
                            isDarkHome 
                              ? 'border-zinc-800 text-rose-400 hover:bg-rose-500/10' 
                              : 'border-slate-100 dark:border-slate-800 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20'
                          }`}
                        >
                          <LogOut className="w-4 h-4 mr-2 text-rose-500 dark:text-rose-400" />
                          Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <Link
                    to="/login"
                    className={`text-xs font-bold px-4 py-2 rounded-xl transition ${
                      isDarkHome
                        ? 'text-slate-300 hover:text-white hover:bg-white/10'
                        : 'text-slate-700 dark:text-slate-200 hover:text-navy-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    className={`inline-flex items-center text-xs font-bold px-4 py-2 rounded-xl shadow-xs hover:shadow-sm transition ${
                      isDarkHome
                        ? 'text-slate-950 bg-white hover:bg-slate-200'
                        : 'text-white bg-navy-900 hover:bg-slate-800 dark:bg-blue-600 dark:hover:bg-blue-700'
                    }`}
                  >
                    <span>Get Started</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5 text-teal-400" />
                  </Link>
                </div>
              )}
            </div>

          </div>
        </div>
      </header>

      {/* Logout Confirmation Dialog */}
      <LogoutConfirmModal 
        isOpen={logoutModalOpen} 
        onClose={() => setLogoutModalOpen(false)} 
      />
    </>
  );
}
