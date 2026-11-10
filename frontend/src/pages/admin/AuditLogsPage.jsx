import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { History, ShieldCheck, Clock } from 'lucide-react';

export default function AuditLogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, []);

  async function fetchLogs() {
    setLoading(true);
    try {
      const data = await api.getAuditLogs();
      setLogs(data.results || data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto space-y-8">
      
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
          System & Moderation Audit Trail
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Chronological immutable log of administrative approvals, moderation decisions, and system events.
        </p>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[1, 2, 3].map(n => (
            <div key={n} className="p-4 rounded-xl bg-white border border-slate-200 animate-pulse h-16"></div>
          ))}
        </div>
      ) : logs.length === 0 ? (
        <div className="p-16 bg-white rounded-3xl border border-slate-200 text-center text-xs text-slate-500">
          No audit entries recorded yet.
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Timestamp</th>
                <th className="py-3.5 px-4">Actor</th>
                <th className="py-3.5 px-4">Action</th>
                <th className="py-3.5 px-4">Target</th>
                <th className="py-3.5 px-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50">
                  <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    {log.actor_name || 'System'}
                  </td>
                  <td className="py-3 px-4 font-bold text-purple-700">
                    {log.action}
                  </td>
                  <td className="py-3 px-4 text-slate-600">
                    {log.target_type} {log.target_id ? `#${log.target_id}` : ''}
                  </td>
                  <td className="py-3 px-4 text-slate-500 font-sans">
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </div>
  );
}

