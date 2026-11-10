import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { 
  Briefcase, 
  Users, 
  Clock, 
  CheckCircle, 
  Calendar, 
  Plus, 
  ArrowRight, 
  Building,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';

export default function RecruiterOverview() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [jobsData, appsData, compData] = await Promise.allSettled([
          api.getRecruiterJobs(),
          api.getRecruiterApplications(),
          api.getMyCompany()
        ]);

        if (jobsData.status === 'fulfilled') {
          const jList = jobsData.value.results || jobsData.value;
          setJobs(jList);
        }
        if (appsData.status === 'fulfilled') {
          const aList = appsData.value.results || appsData.value;
          setApplicants(aList);
        }
        if (compData.status === 'fulfilled') {
          setCompany(compData.value);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const activeJobs = jobs.filter(j => j.status === 'PUBLISHED');
  const pendingReview = applicants.filter(a => a.status === 'SUBMITTED' || a.status === 'UNDER_REVIEW');
  const shortlisted = applicants.filter(a => a.status === 'SHORTLISTED');
  const scheduledInterviews = applicants.filter(a => a.status === 'INTERVIEW');

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8">
      
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-navy-900 via-navy-800 to-teal-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-teal-800/60 text-teal-200">
              {company?.name || 'Your Company'}
            </span>
            {company?.is_verified ? (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-400 text-navy-950">
                <ShieldCheck className="w-3 h-3 mr-1" /> Verified Employer
              </span>
            ) : (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-navy-950">
                Verification Pending
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Employer Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-300">
            Publish openings, evaluate applicants with verified assessment scores, and coordinate interviews.
          </p>
        </div>

        <Link
          to="/recruiter/jobs/new"
          className="px-5 py-3 rounded-xl bg-teal-500 hover:bg-teal-600 text-navy-950 font-bold text-xs shadow-md transition flex items-center shrink-0"
        >
          <Plus className="w-4 h-4 mr-1.5" /> Post New Job
        </Link>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-slate-500 text-xs font-medium">Active Jobs</span>
          <p className="text-3xl font-extrabold text-navy-900">{activeJobs.length}</p>
          <span className="text-[11px] text-slate-400">{jobs.length} total posted</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-slate-500 text-xs font-medium">Total Applicants</span>
          <p className="text-3xl font-extrabold text-blue-600">{applicants.length}</p>
          <span className="text-[11px] text-slate-400">Across all listings</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-slate-500 text-xs font-medium">Pending Review</span>
          <p className="text-3xl font-extrabold text-amber-500">{pendingReview.length}</p>
          <span className="text-[11px] text-slate-400">Needs screening</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
          <span className="text-slate-500 text-xs font-medium">Interviews Scheduled</span>
          <p className="text-3xl font-extrabold text-emerald-600">{scheduledInterviews.length}</p>
          <span className="text-[11px] text-slate-400">{shortlisted.length} shortlisted</span>
        </div>

      </div>

      {/* Recent Applicants Section */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-navy-900">Recent Job Applicants</h2>
            <p className="text-xs text-slate-500">Screen candidacies and update status in real time</p>
          </div>
          <Link to="/recruiter/applicants" className="text-xs font-semibold text-teal-600 hover:underline">
            View all applicants
          </Link>
        </div>

        {applicants.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">
            No applicants received yet. Ensure your jobs are set to Published.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider text-[10px] border-y border-slate-200">
                <tr>
                  <th className="py-3 px-4">Candidate</th>
                  <th className="py-3 px-4">Applied Job</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Applied Date</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {applicants.slice(0, 5).map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3.5 px-4 font-semibold text-slate-900">
                      {app.candidate_name}
                      <span className="block text-[10px] text-slate-400 font-normal">{app.candidate_email}</span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-slate-800">{app.job_title}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700">
                        {app.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-400">{new Date(app.applied_at).toLocaleDateString()}</td>
                    <td className="py-3.5 px-4 text-right">
                      <Link
                        to="/recruiter/applicants"
                        className="text-xs font-semibold text-teal-600 hover:text-teal-800"
                      >
                        Review Profile
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}

