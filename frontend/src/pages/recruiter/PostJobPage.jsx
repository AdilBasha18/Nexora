import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { 
  PlusCircle, 
  ShieldCheck, 
  AlertTriangle, 
  Check, 
  ArrowRight,
  Briefcase,
  Clock,
  Info
} from 'lucide-react';

export default function PostJobPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isApproved = user?.recruiter_status === 'APPROVED' || user?.role === 'ADMIN';

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [responsibilities, setResponsibilities] = useState('');
  const [requiredSkillsStr, setRequiredSkillsStr] = useState('');
  const [preferredSkillsStr, setPreferredSkillsStr] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('MID');
  const [minExpYears, setMinExpYears] = useState(2.0);
  const [employmentType, setEmploymentType] = useState('FULL_TIME');
  const [workMode, setWorkMode] = useState('REMOTE');
  const [location, setLocation] = useState('Remote');
  const [salaryMin, setSalaryMin] = useState(600000);
  const [salaryMax, setSalaryMax] = useState(1200000);
  const [statusVal, setStatusVal] = useState('PENDING_REVIEW');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Live client-side scam warning preview
  const scamKeywords = ['crypto', 'telegram only', 'registration fee', 'pay for training', 'wire transfer'];
  const hasScamWarning = scamKeywords.some(w => 
    `${title} ${description} ${responsibilities}`.toLowerCase().includes(w)
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const reqSkills = requiredSkillsStr
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const prefSkills = preferredSkillsStr
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    try {
      await api.createJob({
        title,
        description,
        responsibilities,
        required_skills: reqSkills,
        preferred_skills: prefSkills,
        experience_level: experienceLevel,
        min_experience_years: Number(minExpYears),
        employment_type: employmentType,
        work_mode: workMode,
        location,
        salary_min: Number(salaryMin),
        salary_max: Number(salaryMax),
        status: statusVal
      });
      navigate('/recruiter/jobs');
    } catch (err) {
      setError(err.data?.error || "Failed to create job posting. Please check your fields.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto space-y-8">
      
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
          Publish a Job Vacancy
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Specify exact required and preferred skills to receive accurately scored candidate matches.
        </p>
      </div>

      {!isApproved && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start space-x-3">
          <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold block">Account Approval Pending</span>
            <p className="text-amber-800 leading-relaxed">
              Your recruiter account is currently awaiting administrative approval ({user?.recruiter_status || 'PENDING'}). 
              You can prepare and save job drafts, but vacancies cannot be submitted for publishing until your profile is approved.
            </p>
            <Link to="/recruiter/company" className="text-teal-700 underline font-semibold inline-block pt-1">
              Complete Company Profile & Verification &rarr;
            </Link>
          </div>
        </div>
      )}

      {hasScamWarning && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start space-x-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block">Scam Shield Notice:</span>
            Your job text contains phrases commonly associated with unauthorized requests (e.g. fees, telegram-only). Postings with these phrases may be placed under administrative moderation.
          </div>
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs font-medium border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 text-xs">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block font-semibold text-slate-700 mb-1">Job Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Senior Full Stack Developer"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none font-semibold text-sm"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Employment Type</label>
            <select
              value={employmentType}
              onChange={(e) => setEmploymentType(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none"
            >
              <option value="FULL_TIME">Full-time</option>
              <option value="PART_TIME">Part-time</option>
              <option value="CONTRACT">Contract</option>
              <option value="INTERNSHIP">Internship</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Work Mode</label>
            <select
              value={workMode}
              onChange={(e) => setWorkMode(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none"
            >
              <option value="REMOTE">Remote</option>
              <option value="HYBRID">Hybrid</option>
              <option value="ONSITE">Onsite</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Location Specification</label>
            <input
              type="text"
              required
              placeholder="e.g. Remote (US) or San Francisco, CA"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Experience Level</label>
            <select
              value={experienceLevel}
              onChange={(e) => setExperienceLevel(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none"
            >
              <option value="ENTRY">Entry Level (0-2 yrs)</option>
              <option value="MID">Mid Level (2-5 yrs)</option>
              <option value="SENIOR">Senior Level (5-8 yrs)</option>
              <option value="LEAD">Lead / Principal (8+ yrs)</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Salary Range Min (₹ INR)</label>
            <input
              type="number"
              step="25000"
              value={salaryMin}
              placeholder="e.g. 600000"
              onChange={(e) => setSalaryMin(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none"
            />
            <p className="text-[11px] text-slate-500 mt-1">₹{Number(salaryMin || 0).toLocaleString('en-IN')} / annum</p>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Salary Range Max (₹ INR)</label>
            <input
              type="number"
              step="25000"
              value={salaryMax}
              placeholder="e.g. 1200000"
              onChange={(e) => setSalaryMax(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none"
            />
            <p className="text-[11px] text-slate-500 mt-1">₹{Number(salaryMax || 0).toLocaleString('en-IN')} / annum</p>
          </div>
        </div>

        {/* Skill Specifications */}
        <div className="space-y-4 pt-2 border-t border-slate-100">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Required Skills (comma separated)
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Python, Django, React, PostgreSQL, Git"
              value={requiredSkillsStr}
              onChange={(e) => setRequiredSkillsStr(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none font-mono text-xs"
            />
            <p className="text-[11px] text-slate-400 mt-1">Carries 50% weight in candidate job matching calculations.</p>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Preferred / Nice-to-Have Skills (comma separated)
            </label>
            <input
              type="text"
              placeholder="e.g. Docker, AWS, Redis, GraphQL"
              value={preferredSkillsStr}
              onChange={(e) => setPreferredSkillsStr(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none font-mono text-xs"
            />
            <p className="text-[11px] text-slate-400 mt-1">Carries 20% weight in candidate matching.</p>
          </div>
        </div>

        {/* Text descriptions */}
        <div className="space-y-4 pt-2 border-t border-slate-100">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Role Description</label>
            <textarea
              rows={4}
              required
              placeholder="Describe team mission, technical stack, and day-to-day work..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none leading-relaxed"
            ></textarea>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Key Responsibilities</label>
            <textarea
              rows={3}
              placeholder="Bullet points or sentences outlining key expectations..."
              value={responsibilities}
              onChange={(e) => setResponsibilities(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none leading-relaxed"
            ></textarea>
          </div>
        </div>

        <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-2xl flex items-start space-x-3 text-xs text-blue-900">
          <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <p>
            <strong>Job Review Policy:</strong> All job postings submitted for publishing enter <strong>Pending Review</strong>. Once verified by an administrator, the posting will instantly appear on the public job board and candidate skill matching algorithms.
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-slate-100">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-700">Action:</span>
            <select
              value={statusVal}
              onChange={(e) => setStatusVal(e.target.value)}
              className="p-2 rounded-xl border border-slate-200 font-bold text-xs bg-slate-50 focus:bg-white outline-none"
            >
              <option value="PENDING_REVIEW">Submit for Review (Pending Admin Approval)</option>
              <option value="DRAFT">Save as Draft (Private)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading || (!isApproved && statusVal !== 'DRAFT')}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Submitting...' : (!isApproved && statusVal !== 'DRAFT') ? 'Approval Required to Submit' : statusVal === 'DRAFT' ? 'Save Draft' : 'Submit for Review'}
          </button>
        </div>

      </form>

    </div>
  );
}

