import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { Bell, CheckCheck, Clock, ExternalLink } from 'lucide-react';

export default function CandidateNotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  async function fetchNotifications() {
    setLoading(true);
    try {
      const data = await api.getNotifications();
      setNotifications(data.results || data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const handleMarkRead = async (id) => {
    try {
      await api.markNotificationRead(id);
      setNotifications(notifications.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (e) {
      console.error(e);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.markAllNotificationsRead();
      setNotifications(notifications.map(n => ({ ...n, is_read: true })));
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto space-y-6">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
            Notifications Center
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Stay updated on application status movements, recruiter interview invites, and test results.
          </p>
        </div>

        {notifications.some(n => !n.is_read) && (
          <button
            onClick={handleMarkAllRead}
            className="px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center shadow-sm"
          >
            <CheckCheck className="w-3.5 h-3.5 mr-1 text-blue-600" /> Mark All Read
          </button>
        )}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(n => (
            <div key={n} className="p-4 rounded-2xl bg-white border border-slate-200 animate-pulse h-20"></div>
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <div className="p-16 bg-white rounded-3xl border border-slate-200 text-center text-xs text-slate-500">
          <Bell className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          No notifications at this time.
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 rounded-2xl border transition flex items-start justify-between gap-4 ${
                notif.is_read ? 'bg-white border-slate-200' : 'bg-blue-50/50 border-blue-200 shadow-sm'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className={`w-2 h-2 rounded-full ${notif.is_read ? 'bg-slate-300' : 'bg-blue-600'}`}></span>
                  <h3 className="font-bold text-xs text-slate-900">{notif.title}</h3>
                  <span className="text-[10px] text-slate-400">
                    {new Date(notif.created_at).toLocaleString()}
                  </span>
                </div>
                <p className="text-xs text-slate-600 pl-4">{notif.message}</p>
                {notif.link && (
                  <div className="pl-4 pt-1">
                    <Link to={notif.link} className="text-[11px] font-semibold text-blue-600 hover:underline inline-flex items-center">
                      View details <ExternalLink className="w-3 h-3 ml-1" />
                    </Link>
                  </div>
                )}
              </div>

              {!notif.is_read && (
                <button
                  onClick={() => handleMarkRead(notif.id)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-[10px] font-semibold text-slate-600 shrink-0"
                >
                  Mark Read
                </button>
              )}
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

