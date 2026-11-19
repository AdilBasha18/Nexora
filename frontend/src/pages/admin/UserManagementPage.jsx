import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { 
  Users, 
  Search, 
  ShieldAlert, 
  CheckCircle, 
  Ban, 
  Mail, 
  Calendar,
  Filter,
  UserCheck,
  Briefcase,
  Shield
} from 'lucide-react';

export default function UserManagementPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, [roleFilter, statusFilter]);

  async function fetchUsers() {
    setLoading(true);
    try {
      const data = await api.getAdminUsers(roleFilter, statusFilter, search);
      setUsers(data.results || data);
    } catch (e) {
      console.error("Error loading users:", e);
    } finally {
      setLoading(false);
    }
  }

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers();
  };

  const handleAction = async (user, action) => {
    const confirmMsg = action === 'SUSPEND' 
      ? `Are you sure you want to SUSPEND ${user.full_name} (${user.email})? They will be logged out and unable to access the system.`
      : `Reactivate account for ${user.full_name}?`;

    if (!window.confirm(confirmMsg)) return;

    setProcessingId(user.id);
    try {
      await api.actOnUser(user.id, { action });
      fetchUsers();
    } catch (e) {
      alert("Failed to modify user account status.");
    } finally {
      setProcessingId(null);
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'ADMIN':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">Admin</span>;
      case 'RECRUITER':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800">Recruiter</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">Candidate</span>;
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          User Account Management
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Inspect registered candidates and recruiters, monitor account standing, and suspend abusive accounts.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Role Filters */}
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          {[
            { id: '', label: 'All Roles' },
            { id: 'CANDIDATE', label: 'Candidates' },
            { id: 'RECRUITER', label: 'Recruiters' },
            { id: 'ADMIN', label: 'Admins' }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setRoleFilter(item.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                roleFilter === item.id
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex items-center space-x-2 w-full sm:w-72">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs outline-none focus:border-purple-500"
            />
          </div>
          <button
            type="submit"
            className="px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-purple-700 transition"
          >
            Filter
          </button>
        </form>

      </div>

      {/* Users Table */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="p-5 rounded-2xl bg-white border border-slate-200 animate-pulse h-20"></div>
          ))}
        </div>
      ) : users.length === 0 ? (
        <div className="p-16 bg-white rounded-3xl border border-slate-200 text-center text-xs text-slate-500 space-y-2">
          <Users className="w-10 h-10 text-slate-300 mx-auto" />
          <p className="font-semibold text-slate-700">No users found</p>
          <p className="text-slate-400">Try adjusting your role or keyword filter.</p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Account Status</th>
                  <th className="py-3 px-4">Context</th>
                  <th className="py-3 px-4">Joined</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {u.full_name}
                      <span className="block text-[11px] text-slate-400 font-normal">{u.email}</span>
                    </td>
                    <td className="py-3.5 px-4">
                      {getRoleBadge(u.role)}
                    </td>
                    <td className="py-3.5 px-4">
                      {u.is_suspended ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800">
                          Suspended
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          Active
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 text-[11px]">
                      {u.extra_info}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      {u.role !== 'ADMIN' && (
                        u.is_suspended ? (
                          <button
                            onClick={() => handleAction(u, 'REACTIVATE')}
                            disabled={processingId === u.id}
                            className="text-xs font-semibold text-emerald-600 hover:text-emerald-800"
                          >
                            Reactivate
                          </button>
                        ) : (
                          <button
                            onClick={() => handleAction(u, 'SUSPEND')}
                            disabled={processingId === u.id}
                            className="text-xs font-semibold text-rose-600 hover:text-rose-800"
                          >
                            Suspend
                          </button>
                        )
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}

