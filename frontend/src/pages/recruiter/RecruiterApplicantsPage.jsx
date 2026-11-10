import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../../services/api';
import { 
  Users, 
  Calendar, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock, 
  MessageSquare, 
  Eye, 
  X,
  Building
} from 'lucide-react';

export default function RecruiterApplicantsPage() {
  const [searchParams] = useSearchParams();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [selectedJobId, setSelectedJobId] = useState(searchParams.get('job') || '');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [jobs, setJobs] = useState([]);

  // Modals
  const [viewResumeApp, setViewResumeApp] = useState(null);
  const [interviewApp, setInterviewApp] = useState(null);
  const [interviewDate, setInterviewDate] = useState('');
  const [interviewLocation, setInterviewLocation] = useState('');
  const [interviewNotes, setInterviewNotes] = useState('');

  // Private note saving state
  const [editingNotesAppId, setEditingNotesAppId] = useState(null);
  const [notesVal, setNotesVal] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const jobsData = await api.getRecruiterJobs();
        const jList = jobsData.results || jobsData;
        setJobs(jList);
        fetchApplicants();
      } catch (e) {
        console.error(e);
      }
    }
    loadData();
  }, [selectedJobId, selectedStatus]);

  async function fetchApplicants() {
    setLoading(true);
    try {
      const q = new URLSearchParams();
      if (selectedJobId) q.append('job_id', selectedJobId);
      if (selectedStatus) q.append('status', selectedStatus);

      const data = await api.getRecruiterApplications(q.toString());
      setApplicants(data.results || data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const handleUpdateStatus = async (appId, newStatus) => {
    try {
      const updated = await api.updateApplicationStatus(appId, { status: newStatus });
      setApplicants(applicants.map(a => a.id === appId ? { ...a, status: updated.status } : a));
    } catch (e) {
      console.error(e);
    }
  };

  const handleScheduleInterviewSubmit = async (e) => {
    e.preventDefault();
    if (!interviewApp) return;

    try {
      const updated = await api.updateApplicationStatus(interviewApp.id, {
        status: 'INTERVIEW',
        interview_date: interviewDate,
        interview_location_or_link: interviewLocation,
        interview_notes: interviewNotes
      });
      setApplicants(applicants.map(a => a.id === interviewApp.id ? updated : a));
      setInterviewApp(null);
      setInterviewDate('');
      setInterviewLocation('');
      setInterviewNotes('');
      alert("Interview scheduled and candidate notified!");
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveNotes = async (appId) => {
    try {
      const updated = await api.updateApplicationStatus(appId, { recruiter_notes: notesVal });
      setApplicants(applicants.map(a => a.id === appId ? { ...a, recruiter_notes: updated.recruiter_notes } : a));
      setEditingNotesAppId(null);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
          Applicant Screening & Management
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Review candidate resumes, inspect verified skill profiles, schedule interviews, and record private hiring notes.
        </p>
      </div>

      {/* Filter Row */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap gap-3 items-center">
        <div className="flex-1 min-w-[200px]">
          <select
            value={selectedJobId}
            onChange={(e) => setSelectedJobId(e.target.value)}
            className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium outline-none"
          >
            <option value="">All Job Vacancies</option>
            {jobs.map(j => (
              <option key={j.id} value={j.id}>{j.title}</option>
            ))}
          </select>
        </div>

        <div className="w-full sm:w-48">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium outline-none"
          >
            <option value="">All Statuses</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="SHORTLISTED">Shortlisted</option>
            <option value="INTERVIEW">Interview Scheduled</option>
            <option value="OFFERED">Offered</option>
            <option value="REJECTED">Not Selected</option>
          </select>
        </div>

        <span className="text-xs text-slate-400 font-medium">
          {applicants.length} candidate{applicants.length === 1 ? '' : 's'} found
        </span>
      </div>

      {/* Applicants List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(n => (
            <div key={n} className="p-6 rounded-3xl bg-white border border-slate-200 animate-pulse h-40"></div>
          ))}
        </div>
      ) : applicants.length === 0 ? (
        <div className="p-16 bg-white rounded-3xl border border-slate-200 text-center text-xs text-slate-500">
          <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          No applicants match the selected criteria.
        </div>
      ) : (
        <div className="space-y-4">
          {applicants.map((app) => {
            const cand = app.candidate_profile;
            return (
              <div
                key={app.id}
                className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-slate-100 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-bold text-base text-navy-900">{app.candidate_name}</h3>
                      <span className="text-xs text-slate-400">({app.candidate_email})</span>
                    </div>
                    <p className="text-xs font-semibold text-teal-700">
                      Applied for: {app.job_title} • Applied on {new Date(app.applied_at).toLocaleDateString()}
                    </p>
                    {cand?.headline && (
                      <p className="text-xs text-slate-600 italic">“{cand.headline}”</p>
                    )}
                  </div>

                  {/* Status Dropdown */}
                  <div className="flex items-center space-x-2 shrink-0 self-start sm:self-auto">
                    <span className="text-[11px] font-bold text-slate-400 uppercase">Status:</span>
                    <select
                      value={app.status}
                      onChange={(e) => handleUpdateStatus(app.id, e.target.value)}
                      className="p-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-navy-900 outline-none"
                    >
                      <option value="SUBMITTED">Submitted</option>
                      <option value="UNDER_REVIEW">Under Review</option>
                      <option value="SHORTLISTED">Shortlisted</option>
                      <option value="INTERVIEW">Interview Scheduled</option>
                      <option value="OFFERED">Job Offered</option>
                      <option value="REJECTED">Not Selected</option>
                    </select>
                  </div>
                </div>

                {/* Candidate Skill & Profile Summary */}
                {cand && (
                  <div className="space-y-2 text-xs">
                    <div className="flex flex-wrap gap-4 text-slate-500">
                      <span>Experience: <strong>{cand.experience_years} years ({cand.experience_level})</strong></span>
                      <span>Location: <strong>{cand.location || 'Flexible'}</strong></span>
                      <span>Work Mode: <strong>{cand.preferred_work_mode}</strong></span>
                    </div>

                    {/* Skill Pills */}
                    {cand.skills && cand.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {cand.skills.map((s) => (
                          <span key={s} className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[11px] font-medium">
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Cover letter snippet */}
                {app.cover_letter && (
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-700">
                    <span className="font-bold text-[10px] uppercase text-slate-400 block mb-1">Cover Note:</span>
                    <p className="italic">“{app.cover_letter}”</p>
                  </div>
                )}

                {/* Action Bar: Resume, Interview, Private Notes */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center space-x-2">
                    {app.resume && (
                      <button
                        onClick={() => setViewResumeApp(app)}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 font-semibold text-slate-700 flex items-center"
                      >
                        <FileText className="w-3.5 h-3.5 mr-1.5 text-blue-600" />
                        View Parsed Resume
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setInterviewApp(app);
                        setInterviewDate('');
                        setInterviewLocation('');
                        setInterviewNotes('');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-teal-50 text-teal-800 hover:bg-teal-100 font-semibold flex items-center"
                    >
                      <Calendar className="w-3.5 h-3.5 mr-1.5" />
                      Schedule Interview
                    </button>
                  </div>

                  {/* Private Recruiter Note Button */}
                  <div>
                    {editingNotesAppId === app.id ? (
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={notesVal}
                          onChange={(e) => setNotesVal(e.target.value)}
                          placeholder="Private team note..."
                          className="p-1.5 rounded-xl border border-slate-200 text-xs outline-none"
                        />
                        <button
                          onClick={() => handleSaveNotes(app.id)}
                          className="px-2 py-1 bg-navy-900 text-white rounded-lg text-xs"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingNotesAppId(null)}
                          className="text-slate-400 hover:text-slate-600 text-xs"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingNotesAppId(app.id);
                          setNotesVal(app.recruiter_notes || '');
                        }}
                        className="text-slate-500 hover:text-navy-900 font-medium inline-flex items-center"
                      >
                        <MessageSquare className="w-3.5 h-3.5 mr-1" />
                        {app.recruiter_notes ? `Note: "${app.recruiter_notes}"` : 'Add private internal note'}
                      </button>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* RESUME VIEW MODAL */}
      {viewResumeApp && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col p-6 shadow-2xl relative">
            <button
              onClick={() => setViewResumeApp(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-navy-900 mb-1">
              {viewResumeApp.candidate_name}'s Resume
            </h3>
            <p className="text-xs text-slate-500 mb-4">{viewResumeApp.resume?.title} ({viewResumeApp.resume?.file_type?.toUpperCase()})</p>

            <div className="flex-1 overflow-y-auto p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-mono whitespace-pre-wrap leading-relaxed text-slate-700">
              {viewResumeApp.resume?.extracted_text || "No extracted text available."}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setViewResumeApp(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 text-white font-semibold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SCHEDULE INTERVIEW MODAL */}
      {interviewApp && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setInterviewApp(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-base font-bold text-navy-900 mb-1">
              Schedule Candidate Interview
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              With <strong>{interviewApp.candidate_name}</strong> for {interviewApp.job_title}
            </p>

            <form onSubmit={handleScheduleInterviewSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Interview Date & Time</label>
                <input
                  type="datetime-local"
                  required
                  value={interviewDate}
                  onChange={(e) => setInterviewDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Meeting Link or Location</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Google Meet / Zoom link or Office address"
                  value={interviewLocation}
                  onChange={(e) => setInterviewLocation(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Instructions for Candidate</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Technical system design interview; please have IDE ready..."
                  value={interviewNotes}
                  onChange={(e) => setInterviewNotes(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-teal-500"
                ></textarea>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setInterviewApp(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold shadow transition"
                >
                  Confirm & Send Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

