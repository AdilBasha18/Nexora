import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { 
  User, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  FolderGit2, 
  Globe, 
  Plus, 
  Trash2, 
  Check, 
  AlertCircle,
  Save,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function CandidateProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Form states
  const [headline, setHeadline] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');
  const [experienceYears, setExperienceYears] = useState(0);
  const [experienceLevel, setExperienceLevel] = useState('ENTRY');
  const [targetRole, setTargetRole] = useState('');
  const [preferredWorkMode, setPreferredWorkMode] = useState('ANY');
  const [githubUrl, setGithubUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');

  // Arrays
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const [education, setEducation] = useState([]);
  const [workExperience, setWorkExperience] = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    setLoading(true);
    try {
      const data = await api.getProfile();
      setProfile(data);
      setHeadline(data.headline || '');
      setPhone(data.phone || '');
      setLocation(data.location || '');
      setBio(data.bio || '');
      setExperienceYears(data.experience_years || 0);
      setExperienceLevel(data.experience_level || 'ENTRY');
      setTargetRole(data.target_role || '');
      setPreferredWorkMode(data.preferred_work_mode || 'ANY');
      setGithubUrl(data.github_url || '');
      setLinkedinUrl(data.linkedin_url || '');
      setPortfolioUrl(data.portfolio_url || '');
      setSkills(data.skills || []);
      setEducation(data.education || []);
      setWorkExperience(data.work_experience || []);
      setProjects(data.projects || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const handleAddSkill = (e) => {
    e.preventDefault();
    const clean = newSkill.trim();
    if (clean && !skills.includes(clean)) {
      setSkills([...skills, clean]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      const payload = {
        headline,
        phone,
        location,
        bio,
        experience_years: Number(experienceYears),
        experience_level: experienceLevel,
        target_role: targetRole,
        preferred_work_mode: preferredWorkMode,
        github_url: githubUrl,
        linkedin_url: linkedinUrl,
        portfolio_url: portfolioUrl,
        skills,
        education,
        work_experience: workExperience,
        projects
      };
      const updated = await api.updateProfile(payload);
      setProfile(updated);
      setMessage("Profile updated successfully!");
    } catch (err) {
      setError("Failed to save profile. Please check your data.");
    } finally {
      setSaving(false);
    }
  };

  // Add Item Helpers
  const addEducationItem = () => {
    setEducation([...education, { degree: '', institution: '', year: '', score: '' }]);
  };

  const addExperienceItem = () => {
    setWorkExperience([...workExperience, { title: '', company: '', start: '', end: '', description: '' }]);
  };

  const addProjectItem = () => {
    setProjects([...projects, { title: '', description: '', technologies: '', link: '' }]);
  };

  if (loading) {
    return <div className="p-8 text-center text-xs text-slate-500">Loading candidate profile...</div>;
  }

  return (
    <div className="p-4 sm:p-8 max-w-5xl mx-auto space-y-8">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
            Manage Candidate Profile
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Keep your skills, project experience, and target career preferences up to date.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Link
            to="/candidate/setup-profile"
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow transition flex items-center"
          >
            <Sparkles className="w-3.5 h-3.5 mr-1.5" /> 9-Step Guided Wizard <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Link>
          <span className="text-xs font-bold px-3 py-2 rounded-xl bg-blue-50 text-blue-700">
            {profile?.completion_percentage || 0}% Complete
          </span>
        </div>
      </div>

      {/* Profile Section Completeness Cards */}
      {profile?.section_completion && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-navy-900">Profile Sections Checklist</span>
            <span className="text-[11px] text-slate-400">Complete all sections to maximize recruiter outreach</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            {[
              { key: 'basic_info', label: 'Basic Info' },
              { key: 'education', label: 'Education' },
              { key: 'career_preferences', label: 'Preferences' },
              { key: 'skills', label: 'Skills' },
              { key: 'work_experience', label: 'Experience' },
              { key: 'projects', label: 'Projects' },
              { key: 'certifications', label: 'Certifications' },
              { key: 'resume', label: 'Resume' }
            ].map(sec => {
              const isDone = profile.section_completion[sec.key];
              return (
                <div
                  key={sec.key}
                  className={`p-2.5 rounded-xl border flex items-center justify-between text-[11px] ${
                    isDone 
                      ? 'bg-emerald-50/70 border-emerald-200 text-emerald-800' 
                      : 'bg-slate-50 border-slate-200 text-slate-500'
                  }`}
                >
                  <span className="font-semibold">{sec.label}</span>
                  {isDone ? (
                    <span className="text-emerald-600 font-bold">✓</span>
                  ) : (
                    <span className="text-amber-500 font-bold">+</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {message && (
        <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-medium flex items-center">
          <Check className="w-4 h-4 mr-1.5 shrink-0" /> {message}
        </div>
      )}
      {error && (
        <div className="p-3 bg-red-50 text-red-700 rounded-xl text-xs font-medium flex items-center">
          <AlertCircle className="w-4 h-4 mr-1.5 shrink-0" /> {error}
        </div>
      )}

      <form onSubmit={handleSaveProfile} className="space-y-8 text-xs">
        
        {/* Section 1: Basic Information */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-navy-900 flex items-center">
            <User className="w-4 h-4 mr-2 text-blue-600" /> Basic Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Headline</label>
              <input
                type="text"
                placeholder="e.g. Full Stack Developer | React & Python"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Target Career Role</label>
              <input
                type="text"
                placeholder="e.g. Full Stack Software Engineer"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Location</label>
              <input
                type="text"
                placeholder="e.g. Seattle, WA (Open to Remote)"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
              <input
                type="text"
                placeholder="+1 (555) 000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Years of Experience</label>
              <input
                type="number"
                step="0.5"
                min="0"
                value={experienceYears}
                onChange={(e) => setExperienceYears(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Preferred Work Mode</label>
              <select
                value={preferredWorkMode}
                onChange={(e) => setPreferredWorkMode(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="ANY">Any / Open to all</option>
                <option value="REMOTE">Remote</option>
                <option value="HYBRID">Hybrid</option>
                <option value="ONSITE">Onsite</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Professional Summary / Bio</label>
            <textarea
              rows={3}
              placeholder="A brief overview of your background, technical interests, and goals..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none leading-relaxed"
            ></textarea>
          </div>
        </div>

        {/* Section 2: Technical Skills */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-navy-900 flex items-center">
            <GraduationCap className="w-4 h-4 mr-2 text-teal-600" /> Technical Skills & Tools
          </h2>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Add skill (e.g. Docker, TypeScript, Fast API)..."
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              className="flex-1 p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none"
            />
            <button
              type="button"
              onClick={handleAddSkill}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl"
            >
              Add Skill
            </button>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {skills.map((s) => (
              <span
                key={s}
                className="inline-flex items-center px-3 py-1 rounded-xl bg-slate-100 text-slate-800 font-semibold"
              >
                {s}
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(s)}
                  className="ml-1.5 text-slate-400 hover:text-red-500"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Section 3: Web Links */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-navy-900 flex items-center">
            <Globe className="w-4 h-4 mr-2 text-purple-600" /> Online Profiles
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">GitHub URL</label>
              <input
                type="url"
                placeholder="https://github.com/..."
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">LinkedIn URL</label>
              <input
                type="url"
                placeholder="https://linkedin.com/in/..."
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Portfolio URL</label>
              <input
                type="url"
                placeholder="https://myportfolio.dev"
                value={portfolioUrl}
                onChange={(e) => setPortfolioUrl(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="sticky bottom-4 z-20 bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-slate-200 shadow-lg flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow transition disabled:opacity-50 flex items-center"
          >
            <Save className="w-4 h-4 mr-1.5" />
            {saving ? 'Saving...' : 'Save Profile Changes'}
          </button>
        </div>

      </form>

    </div>
  );
}

