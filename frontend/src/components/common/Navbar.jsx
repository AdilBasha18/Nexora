import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Briefcase, 
  FileText, 
  Compass, 
  CheckCircle, 
  Bot, 
  Building2, 
  Menu, 
  X, 
  User, 
  LogOut, 
  LayoutDashboard,
  ShieldAlert,
  ChevronDown
} from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, isAuthenticated, isCandidate, isRecruiter, isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
    navigate('/');
  };

  const getDashboardLink = () => {
    if (isAdmin) return '/admin-portal';
    if (isRecruiter) return '/recruiter/dashboard';
    return '/candidate/overview';
  };

  const navLinks = [
    { name: 'Find Jobs', path: '/jobs', icon: Briefcase },
    { name: 'ATS Resume Checker', path: '/ats-checker', icon: FileText },
    { name: 'Career GPS', path: '/career-gps', icon: Compass },
    { name: 'Skill Assessments', path: '/assessments', icon: CheckCircle },
    { name: 'AI Career Assistant', path: '/assistant', icon: Bot },
    { name: 'For Employers', path: '/for-employers', icon: Building2 },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand Wordmark */}
          <Link to="/" className="flex items-center space-x-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-navy-900 via-blue-700 to-teal-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
              {/* Geometric forward-career connection symbol */}
              <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-navy-900">
                Nex<span className="text-blue-600">ora</span>
              </span>
              <span className="text-[10px] text-slate-500 -mt-1 font-medium tracking-wide">
                Career Intelligence
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'text-slate-600 hover:text-navy-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 mr-1.5 opacity-70" />
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* User Auth Actions */}
          <div className="hidden sm:flex items-center space-x-3">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-2 pl-3 pr-2 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 transition shadow-sm text-xs"
                >
                  <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 font-semibold flex items-center justify-center">
                    {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-slate-800 leading-tight truncate max-w-[110px]">
                      {user?.full_name || 'My Account'}
                    </p>
                    <span className="text-[10px] text-blue-600 font-medium capitalize">
                      {user?.role?.toLowerCase()}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-semibold text-slate-800 truncate">{user?.full_name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                    </div>

                    <Link
                      to={getDashboardLink()}
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center px-4 py-2 text-xs text-slate-700 hover:bg-blue-50 hover:text-blue-700 font-medium"
                    >
                      <LayoutDashboard className="w-4 h-4 mr-2 text-blue-600" />
                      Platform Dashboard
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin-portal"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center px-4 py-2 text-xs text-purple-700 hover:bg-purple-50 font-medium"
                      >
                        <ShieldAlert className="w-4 h-4 mr-2" />
                        Admin Operations
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-2 text-xs text-red-600 hover:bg-red-50 font-medium text-left border-t border-slate-100 mt-1"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-xs font-semibold text-slate-700 hover:text-blue-600 px-3 py-2 rounded-lg hover:bg-slate-100 transition"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl shadow-sm hover:shadow-md hover:shadow-blue-600/20 transition"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-navy-900" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 font-semibold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-4 h-4 mr-3 text-slate-500" />
                {link.name}
              </Link>
            );
          })}

          <div className="pt-4 border-t border-slate-200 space-y-2">
            {isAuthenticated ? (
              <>
                <Link
                  to={getDashboardLink()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center w-full py-2.5 rounded-xl bg-blue-600 text-white font-medium text-sm shadow-sm"
                >
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Go to Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full py-2 rounded-xl text-center text-sm font-medium text-red-600 hover:bg-red-50"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 rounded-xl border border-slate-300 font-semibold text-sm text-slate-700"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center py-2.5 rounded-xl bg-blue-600 font-semibold text-sm text-white"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

