import React from 'react';
import { LogOut, AlertTriangle, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function LogoutConfirmModal({ isOpen, onClose }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);

  if (!isOpen) return null;

  const handleConfirmLogout = async () => {
    try {
      setLoading(true);
      await logout();
      onClose();
      navigate('/', { replace: true });
    } catch (err) {
      console.error('Logout error:', err);
      onClose();
      navigate('/', { replace: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-sm rounded-3xl bg-white dark:bg-[#121624] border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-4 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="logout-title"
      >
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
            <LogOut className="w-6 h-6" />
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition"
            title="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-1.5">
          <h3 id="logout-title" className="text-base font-bold text-slate-900 dark:text-white">
            Are you sure you want to log out?
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            Your current active session will be securely closed. You can sign back in at any time to resume where you left off.
          </p>
        </div>

        <div className="flex items-center space-x-2.5 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleConfirmLogout}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/20 transition flex items-center justify-center space-x-1.5 disabled:opacity-60"
          >
            {loading ? (
              <span>Signing out...</span>
            ) : (
              <>
                <LogOut className="w-3.5 h-3.5" />
                <span>Yes, Log Out</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
