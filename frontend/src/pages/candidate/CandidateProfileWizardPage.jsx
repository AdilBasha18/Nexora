import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { 
  User, 
  GraduationCap, 
  Briefcase, 
  Code, 
  FolderGit2, 
  Award, 
  FileText, 
  Globe, 
  Compass, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Plus, 
  Trash2, 
  UploadCloud, 
  Save, 
  Sparkles,
  AlertCircle,
  Clock,
  Check
} from 'lucide-react';

const STEPS = [
  { id: 1, label: 'Basic Info', icon: User, desc: 'Contact details and professional summary' },
  { id: 2, label: 'Education', icon: GraduationCap, desc: 'Degrees, colleges, and academic scores' },
  { id: 3, label: 'Preferences', icon: Compass, desc: 'Target roles, location, and work modes' },
  { id: 4, label: 'Skills', icon: Code, desc: 'Technical & professional proficiencies' },
  { id: 5, label: 'Experience', icon: Briefcase, desc: 'Work history or internships' },
  { id: 6, label: 'Projects', icon: FolderGit2, desc: 'Hands-on projects & repositories' },
  { id: 7, label: 'Certifications', icon: Award, desc: 'Credentials and licenses' },
  { id: 8, label: 'Resume', icon: FileText, desc: 'Upload PDF or DOCX CV' },
  { id: 9, label: 'Social Links', icon: Globe, desc: 'LinkedIn, GitHub, and portfolio' }
];

export default function CandidateProfileWizardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState('');

  // 1. Basic Info
  const [headline, setHeadline] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('India');
  const [bio, setBio] = useState('');

  // 2. Education Array
  const [educationList, setEducationList] = useState([]);
  const [newEdu, setNewEdu] = useState({
    degree: '',
    specialization: '',
    college: '',
    graduation_year: '',
    cgpa: '',
    start_date: '',
    end_date: ''
  });

  // 3. Career Preferences
  const [targetRole, setTargetRole] = useState('Full Stack Developer');
  const [preferredWorkMode, setPreferredWorkMode] = useState('REMOTE');
  const [preferredEmploymentType, setPreferredEmploymentType] = useState('Full-time');
  const [preferredLocations, setPreferredLocations] = useState('Bengaluru, Hyderabad, Remote');
  const [expectedSalary, setExpectedSalary] = useState('₹8,00,000 - ₹14,00,000');
  const [experienceLevel, setExperienceLevel] = useState('ENTRY');

  // 4. Skills Array
  const [skillsList, setSkillsList] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [skillCategory, setSkillCategory] = useState('Programming');
  const [skillLevel, setSkillLevel] = useState('Intermediate');

  // 5. Work Experience Array
  const [isFresher, setIsFresher] = useState(false);
  const [experienceList, setExperienceList] = useState([]);
  const [newExp, setNewExp] = useState({
    company: '',
    title: '',
    employment_type: 'Full-time',
    start_date: '',
    end_date: '',
    description: '',
    skills_used: ''
  });

  // 6. Projects Array
  const [projectsList, setProjectsList] = useState([]);
  const [newProj, setNewProj] = useState({
    title: '',
    role: '',
    tech_stack: '',
    github_url: '',
    live_url: '',
    description: '',
    outcomes: ''
  });

  // 7. Certifications Array
  const [certificationsList, setCertificationsList] = useState([]);
  const [newCert, setNewCert] = useState({
    name: '',
    issuer: '',
    issue_date: '',
    credential_id: '',
    url: ''
  });

  // 8. Resume Upload
  const [resumes, setResumes] = useState([]);
  const [uploadingResume, setUploadingResume] = useState(false);
  const fileInputRef = useRef(null);

  // 9. Links
  const [githubUrl, setGithubUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');

  // Profile completion stats
  const [completionPercentage, setCompletionPercentage] = useState(20);
  const [sectionStatus, setSectionStatus] = useState({});

  useEffect(() => {
    loadProfileData();
  }, []);

  async function loadProfileData() {
    setLoading(true);
    try {
      const data = await api.getProfile();
      setHeadline(data.headline || '');
      setPhone(data.phone || '');
      setCity(data.city || data.location?.split(',')[0] || '');
      setState(data.state || '');
      setCountry(data.country || 'India');
      setBio(data.bio || '');

      setTargetRole(data.target_role || 'Software Engineer');
      setPreferredWorkMode(data.preferred_work_mode || 'ANY');
      setPreferredEmploymentType(data.preferred_employment_type || 'Full-time');
      setPreferredLocations(Array.isArray(data.preferred_locations) ? data.preferred_locations.join(', ') : (data.preferred_locations || ''));
      setExpectedSalary(data.expected_salary || '');
      setExperienceLevel(data.experience_level || 'ENTRY');
      setIsFresher(data.is_fresher || false);

      setEducationList(Array.isArray(data.education) ? data.education : []);
      setSkillsList(Array.isArray(data.skills) ? data.skills : []);
      setExperienceList(Array.isArray(data.work_experience) ? data.work_experience : []);
      setProjectsList(Array.isArray(data.projects) ? data.projects : []);
      setCertificationsList(Array.isArray(data.certifications) ? data.certifications : []);

      setGithubUrl(data.github_url || '');
      setLinkedinUrl(data.linkedin_url || '');
      setPortfolioUrl(data.portfolio_url || '');

      setCompletionPercentage(data.completion_percentage || 20);
      setSectionStatus(data.section_completion || {});

      if (data.setup_step && data.setup_step >= 1 && data.setup_step <= 9) {
        setCurrentStep(data.setup_step);
      }

      // Also load existing resumes
      const resData = await api.getResumes();
      setResumes(resData.results || resData || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const saveCurrentStepData = async (nextStep = null) => {
    setSaving(true);
    setError('');
    setSaveSuccess(false);

    try {
      const loc = city && state ? `${city}, ${state}` : (city || state || 'India');
      const prefLocArray = preferredLocations.split(',').map(s => s.trim()).filter(Boolean);

      const payload = {
        headline,
        phone,
        city,
        state,
        country,
        location: loc,
        bio,
        target_role: targetRole,
        preferred_work_mode: preferredWorkMode,
        preferred_employment_type: preferredEmploymentType,
        preferred_locations: prefLocArray,
        expected_salary: expectedSalary,
        experience_level: experienceLevel,
        is_fresher: isFresher,
        education: educationList,
        skills: skillsList,
        work_experience: experienceList,
        projects: projectsList,
        certifications: certificationsList,
        github_url: githubUrl,
        linkedin_url: linkedinUrl,
        portfolio_url: portfolioUrl,
        setup_step: nextStep || currentStep,
        is_profile_completed: (nextStep && nextStep > 9) || completionPercentage >= 80
      };

      const updated = await api.updateProfile(payload);
      setCompletionPercentage(updated.completion_percentage || 0);
      setSectionStatus(updated.section_completion || {});
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2000);

      if (nextStep) {
        if (nextStep > 9) {
          navigate('/candidate/overview');
        } else {
          setCurrentStep(nextStep);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    } catch (err) {
      console.error(err);
      setError("Failed to save profile progress. Please check your inputs.");
    } finally {
      setSaving(false);
    }
  };

  // Education Helpers
  const handleAddEducation = (e) => {
    e.preventDefault();
    if (!newEdu.degree.trim() || !newEdu.college.trim()) return;
    setEducationList([...educationList, { ...newEdu, id: Date.now() }]);
    setNewEdu({
      degree: '',
      specialization: '',
      college: '',
      graduation_year: '',
      cgpa: '',
      start_date: '',
      end_date: ''
    });
  };

  const handleRemoveEducation = (index) => {
    setEducationList(educationList.filter((_, i) => i !== index));
  };

  // Skills Helpers
  const handleAddSkill = (e) => {
    e.preventDefault();
    const clean = skillInput.trim();
    if (!clean) return;
    const exists = skillsList.some(s => (typeof s === 'string' ? s.toLowerCase() === clean.toLowerCase() : s.name?.toLowerCase() === clean.toLowerCase()));
    if (!exists) {
      setSkillsList([...skillsList, { name: clean, category: skillCategory, level: skillLevel }]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (index) => {
    setSkillsList(skillsList.filter((_, i) => i !== index));
  };

  // Experience Helpers
  const handleAddExperience = (e) => {
    e.preventDefault();
    if (!newExp.company.trim() || !newExp.title.trim()) return;
    setExperienceList([...experienceList, { ...newExp, id: Date.now() }]);
    setNewExp({
      company: '',
      title: '',
      employment_type: 'Full-time',
      start_date: '',
      end_date: '',
      description: '',
      skills_used: ''
    });
  };

  const handleRemoveExperience = (index) => {
    setExperienceList(experienceList.filter((_, i) => i !== index));
  };

  // Projects Helpers
  const handleAddProject = (e) => {
    e.preventDefault();
    if (!newProj.title.trim()) return;
    setProjectsList([...projectsList, { ...newProj, id: Date.now() }]);
    setNewProj({
      title: '',
      role: '',
      tech_stack: '',
      github_url: '',
      live_url: '',
      description: '',
      outcomes: ''
    });
  };

  const handleRemoveProject = (index) => {
    setProjectsList(projectsList.filter((_, i) => i !== index));
  };

  // Certifications Helpers
  const handleAddCert = (e) => {
    e.preventDefault();
    if (!newCert.name.trim()) return;
    setCertificationsList([...certificationsList, { ...newCert, id: Date.now() }]);
    setNewCert({
      name: '',
      issuer: '',
      issue_date: '',
      credential_id: '',
      url: ''
    });
  };

  const handleRemoveCert = (index) => {
    setCertificationsList(certificationsList.filter((_, i) => i !== index));
  };

  // Resume Upload Helper
  const handleResumeUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingResume(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', file.name.replace(/\.[^/.]+$/, ""));
      formData.append('is_primary', 'true');

      const uploaded = await api.uploadResume(formData);
      setResumes(prev => [uploaded, ...prev]);
      // Update completion
      setCompletionPercentage(prev => Math.min(100, prev + 10));
    } catch (err) {
      setError(err.data?.error || "Failed to upload resume. PDF and DOCX only (max 5MB).");
    } finally {
      setUploadingResume(false);
    }
  };

  if (loading) {
    return <div className="p-16 text-center text-xs text-slate-500">Loading your profile setup wizard...</div>;
  }

  const currentStepInfo = STEPS.find(s => s.id === currentStep) || STEPS[0];
  const StepIcon = currentStepInfo.icon;

  return (
    <div className="min-h-screen bg-slate-50/70 pb-20">
      
      {/* Wizard Header Sticky Bar */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3.5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link to="/candidate/overview" className="text-slate-400 hover:text-slate-600 text-xs font-semibold">
              &larr; Dashboard
            </Link>
            <div className="h-4 w-px bg-slate-200"></div>
            <div>
              <h1 className="font-extrabold text-sm sm:text-base text-navy-900 flex items-center">
                <span>Candidate Profile Wizard</span>
                <span className="ml-2 text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                  Step {currentStep} of 9
                </span>
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Completion Gauge */}
            <div className="hidden sm:flex items-center space-x-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500">Profile Completeness:</span>
              <span className={`text-xs font-black ${completionPercentage >= 75 ? 'text-emerald-600' : completionPercentage >= 50 ? 'text-blue-600' : 'text-amber-600'}`}>
                {completionPercentage}%
              </span>
            </div>

            <button
              type="button"
              onClick={() => saveCurrentStepData(null)}
              disabled={saving}
              className="px-3.5 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition flex items-center space-x-1"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save Progress'}</span>
            </button>
          </div>
        </div>

        {/* Multi-Step Stepper Track */}
        <div className="max-w-5xl mx-auto px-4 pb-3 overflow-x-auto scrollbar-none">
          <div className="flex items-center space-x-1 min-w-[700px]">
            {STEPS.map((s) => {
              const Icon = s.icon;
              const isActive = s.id === currentStep;
              const isPast = s.id < currentStep;

              return (
                <button
                  key={s.id}
                  onClick={() => {
                    saveCurrentStepData(null);
                    setCurrentStep(s.id);
                  }}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm'
                      : isPast
                      ? 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                      : 'text-slate-400 hover:text-slate-700'
                  }`}
                >
                  {isPast ? <Check className="w-3.5 h-3.5" /> : <Icon className="w-3.5 h-3.5" />}
                  <span>{s.id}. {s.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Wizard Form Container */}
      <div className="max-w-3xl mx-auto px-4 mt-8">
        
        {/* Step Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm mb-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <StepIcon className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block">
                Step {currentStep} of 9
              </span>
              <h2 className="text-xl font-extrabold text-navy-900">{currentStepInfo.label}</h2>
            </div>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            {currentStepInfo.desc}. Complete this section to boost your matching rate for recruiter vacancies.
          </p>

          {error && (
            <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Step Forms */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          
          {/* ================= STEP 1: BASIC INFORMATION ================= */}
          {currentStep === 1 && (
            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-800 mb-1">Full Name</label>
                <input
                  type="text"
                  disabled
                  value={user?.full_name || ''}
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-100 text-slate-500 font-medium cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Professional Headline <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="e.g. Full Stack Python & React Developer | Ex-TCS Intern | Cloud Enthusiast"
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  This is the first headline recruiters see next to your name in candidate searches.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-1">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Bengaluru, Hyderabad, Pune"
                    className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">State / Province</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="e.g. Karnataka, Telangana"
                    className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Country</label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Professional Bio / Summary</label>
                <textarea
                  rows={4}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Passionate engineer with a track record of building performant web applications, REST APIs, and automated data pipelines..."
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none leading-relaxed"
                ></textarea>
              </div>
            </div>
          )}

          {/* ================= STEP 2: EDUCATION ================= */}
          {currentStep === 2 && (
            <div className="space-y-6 text-xs">
              {/* Existing Education Cards */}
              <div className="space-y-3">
                <span className="font-bold text-slate-800 text-sm block">Saved Academic Credentials ({educationList.length})</span>
                {educationList.length === 0 ? (
                  <p className="text-slate-400 p-4 rounded-2xl bg-slate-50 text-center">
                    No education records added yet. Fill in the form below to add your degree.
                  </p>
                ) : (
                  educationList.map((edu, idx) => (
                    <div key={idx} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-start justify-between">
                      <div className="space-y-1">
                        <h4 className="font-bold text-sm text-navy-900">{edu.degree} {edu.specialization ? `in ${edu.specialization}` : ''}</h4>
                        <p className="text-slate-600">{edu.college}</p>
                        <p className="text-[11px] text-slate-400">
                          Graduation: {edu.graduation_year || 'N/A'} • Score/CGPA: {edu.cgpa || 'N/A'}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveEducation(idx)}
                        className="text-red-500 hover:text-red-700 p-1"
                        title="Remove education"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Add New Education Form */}
              <div className="p-5 rounded-2xl border border-blue-200 bg-blue-50/40 space-y-3">
                <h4 className="font-bold text-xs text-blue-900 flex items-center">
                  <Plus className="w-4 h-4 mr-1 text-blue-600" />
                  Add Education Record
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Degree / Qualification</label>
                    <input
                      type="text"
                      value={newEdu.degree}
                      onChange={(e) => setNewEdu({ ...newEdu, degree: e.target.value })}
                      placeholder="e.g. B.Tech, B.E., B.Sc, MCA"
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Specialization / Major</label>
                    <input
                      type="text"
                      value={newEdu.specialization}
                      onChange={(e) => setNewEdu({ ...newEdu, specialization: e.target.value })}
                      placeholder="e.g. Computer Science, Information Technology"
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-white outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">College / University Name</label>
                  <input
                    type="text"
                    value={newEdu.college}
                    onChange={(e) => setNewEdu({ ...newEdu, college: e.target.value })}
                    placeholder="e.g. Indian Institute of Technology or State University"
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Graduation Year</label>
                    <input
                      type="number"
                      value={newEdu.graduation_year}
                      onChange={(e) => setNewEdu({ ...newEdu, graduation_year: e.target.value })}
                      placeholder="2025"
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">CGPA / Percentage</label>
                    <input
                      type="text"
                      value={newEdu.cgpa}
                      onChange={(e) => setNewEdu({ ...newEdu, cgpa: e.target.value })}
                      placeholder="8.5 CGPA or 82%"
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-white outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={handleAddEducation}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition"
                  >
                    + Add to Education List
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ================= STEP 3: CAREER PREFERENCES ================= */}
          {currentStep === 3 && (
            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-800 mb-1">Primary Target Job Role</label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g. Full Stack Developer, DevOps Engineer, Data Analyst"
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white outline-none font-semibold text-slate-800"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Preferred Work Mode</label>
                  <select
                    value={preferredWorkMode}
                    onChange={(e) => setPreferredWorkMode(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white outline-none font-medium"
                  >
                    <option value="REMOTE">Remote (Work from home)</option>
                    <option value="HYBRID">Hybrid (Flexible office & home)</option>
                    <option value="ONSITE">On-site (Full office)</option>
                    <option value="ANY">Open to all options</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Employment Type</label>
                  <select
                    value={preferredEmploymentType}
                    onChange={(e) => setPreferredEmploymentType(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white outline-none font-medium"
                  >
                    <option value="Full-time">Full-time Permanent</option>
                    <option value="Contract">Contract / Freelance</option>
                    <option value="Internship">Internship</option>
                    <option value="Part-time">Part-time</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Preferred Locations</label>
                  <input
                    type="text"
                    value={preferredLocations}
                    onChange={(e) => setPreferredLocations(e.target.value)}
                    placeholder="e.g. Bengaluru, Hyderabad, Pune, Remote"
                    className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-800 mb-1">Expected Salary (Annual)</label>
                  <input
                    type="text"
                    value={expectedSalary}
                    onChange={(e) => setExpectedSalary(e.target.value)}
                    placeholder="e.g. ₹6,00,000 - ₹10,00,000 or $75k"
                    className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Current Experience Level</label>
                <select
                  value={experienceLevel}
                  onChange={(e) => setExperienceLevel(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white outline-none font-medium"
                >
                  <option value="ENTRY">Fresher / Entry Level (0-2 years)</option>
                  <option value="MID">Mid Level (2-5 years)</option>
                  <option value="SENIOR">Senior Level (5-8 years)</option>
                  <option value="LEAD">Lead / Architect (8+ years)</option>
                </select>
              </div>
            </div>
          )}

          {/* ================= STEP 4: SKILLS ================= */}
          {currentStep === 4 && (
            <div className="space-y-6 text-xs">
              <div className="space-y-2">
                <span className="font-bold text-slate-800 text-sm block">Your Key Technical Skills ({skillsList.length})</span>
                <p className="text-slate-500">
                  Add at least 3 skills to trigger AI Job Matching and accurate Job Readiness Scoring.
                </p>

                <div className="flex flex-wrap gap-2 pt-2">
                  {skillsList.map((skill, idx) => {
                    const sName = typeof skill === 'string' ? skill : skill.name;
                    const sLevel = typeof skill === 'string' ? '' : skill.level;
                    return (
                      <span key={idx} className="px-3 py-1.5 rounded-xl bg-blue-50 text-blue-900 border border-blue-200 flex items-center space-x-1.5 font-semibold">
                        <span>{sName}</span>
                        {sLevel && <span className="text-[10px] text-blue-500">({sLevel})</span>}
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(idx)}
                          className="text-blue-400 hover:text-red-500 ml-1"
                        >
                          &times;
                        </button>
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Add Skill Form */}
              <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
                <h4 className="font-bold text-xs text-slate-800">+ Add Skill</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Skill Name</label>
                    <input
                      type="text"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      placeholder="e.g. Python, React, SQL, Docker"
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Category</label>
                    <select
                      value={skillCategory}
                      onChange={(e) => setSkillCategory(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-white outline-none"
                    >
                      <option value="Programming">Programming Language</option>
                      <option value="Framework">Framework / Library</option>
                      <option value="Database">Database</option>
                      <option value="DevOps">Cloud / DevOps / Tool</option>
                      <option value="SoftSkill">Soft Skill</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Proficiency</label>
                    <select
                      value={skillLevel}
                      onChange={(e) => setSkillLevel(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-white outline-none"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                      <option value="Expert">Expert</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="px-4 py-2 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs"
                  >
                    Add Skill
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ================= STEP 5: WORK EXPERIENCE ================= */}
          {currentStep === 5 && (
            <div className="space-y-6 text-xs">
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-amber-900 block">Are you a Fresher or Student?</span>
                  <p className="text-[11px] text-amber-700">
                    If you don't have corporate experience yet, toggle this on. You can showcase projects in the next step!
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsFresher(!isFresher)}
                  className={`px-4 py-2 rounded-xl font-bold transition ${
                    isFresher ? 'bg-amber-600 text-white' : 'bg-white border border-amber-300 text-amber-900'
                  }`}
                >
                  {isFresher ? '✓ Marked as Fresher' : 'I am a Fresher'}
                </button>
              </div>

              {!isFresher && (
                <>
                  <div className="space-y-3">
                    <span className="font-bold text-slate-800 text-sm block">Saved Experience ({experienceList.length})</span>
                    {experienceList.length === 0 ? (
                      <p className="text-slate-400 p-4 rounded-2xl bg-slate-50 text-center">
                        No work experience added. Enter your previous roles below or mark yourself as Fresher.
                      </p>
                    ) : (
                      experienceList.map((exp, idx) => (
                        <div key={idx} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-start justify-between">
                          <div className="space-y-1">
                            <h4 className="font-bold text-sm text-navy-900">{exp.title} at {exp.company}</h4>
                            <p className="text-[11px] text-slate-500">{exp.employment_type} • {exp.start_date} to {exp.end_date || 'Present'}</p>
                            <p className="text-slate-600 text-xs mt-1 leading-relaxed">{exp.description}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveExperience(idx)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Add Experience Form */}
                  <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
                    <h4 className="font-bold text-xs text-slate-800">+ Add Experience / Internship</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Company / Organization</label>
                        <input
                          type="text"
                          value={newExp.company}
                          onChange={(e) => setNewExp({ ...newExp, company: e.target.value })}
                          placeholder="e.g. Infosys, Start-up Inc, TCS"
                          className="w-full p-2.5 rounded-xl border border-slate-200 bg-white outline-none"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Job Title</label>
                        <input
                          type="text"
                          value={newExp.title}
                          onChange={(e) => setNewExp({ ...newExp, title: e.target.value })}
                          placeholder="e.g. Junior Backend Developer / SWE Intern"
                          className="w-full p-2.5 rounded-xl border border-slate-200 bg-white outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Type</label>
                        <select
                          value={newExp.employment_type}
                          onChange={(e) => setNewExp({ ...newExp, employment_type: e.target.value })}
                          className="w-full p-2.5 rounded-xl border border-slate-200 bg-white outline-none"
                        >
                          <option value="Full-time">Full-time</option>
                          <option value="Internship">Internship</option>
                          <option value="Contract">Contract</option>
                        </select>
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Start Date</label>
                        <input
                          type="text"
                          value={newExp.start_date}
                          onChange={(e) => setNewExp({ ...newExp, start_date: e.target.value })}
                          placeholder="MM/YYYY"
                          className="w-full p-2.5 rounded-xl border border-slate-200 bg-white outline-none"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">End Date</label>
                        <input
                          type="text"
                          value={newExp.end_date}
                          onChange={(e) => setNewExp({ ...newExp, end_date: e.target.value })}
                          placeholder="Present or MM/YYYY"
                          className="w-full p-2.5 rounded-xl border border-slate-200 bg-white outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Key Responsibilities & Impact</label>
                      <textarea
                        rows={3}
                        value={newExp.description}
                        onChange={(e) => setNewExp({ ...newExp, description: e.target.value })}
                        placeholder="Built REST APIs using Django, optimized SQL queries by 30%, participated in daily scrums..."
                        className="w-full p-2.5 rounded-xl border border-slate-200 bg-white outline-none"
                      ></textarea>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        type="button"
                        onClick={handleAddExperience}
                        className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
                      >
                        + Add Experience Record
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ================= STEP 6: PROJECTS ================= */}
          {currentStep === 6 && (
            <div className="space-y-6 text-xs">
              <div className="space-y-3">
                <span className="font-bold text-slate-800 text-sm block">Saved Projects ({projectsList.length})</span>
                {projectsList.length === 0 ? (
                  <p className="text-slate-400 p-4 rounded-2xl bg-slate-50 text-center">
                    No projects added yet. Adding portfolio projects boosts your Job Readiness Score significantly!
                  </p>
                ) : (
                  projectsList.map((p, idx) => (
                    <div key={idx} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-start justify-between">
                      <div className="space-y-1">
                        <h4 className="font-bold text-sm text-navy-900">{p.title}</h4>
                        <p className="text-[11px] font-semibold text-blue-600">{p.tech_stack}</p>
                        <p className="text-slate-600 text-xs mt-1 leading-relaxed">{p.description}</p>
                        {p.github_url && (
                          <a href={p.github_url} target="_blank" rel="noreferrer" className="text-[11px] text-teal-600 underline font-medium mr-3">
                            GitHub Repository
                          </a>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveProject(idx)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Add Project Form */}
              <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
                <h4 className="font-bold text-xs text-slate-800">+ Add Portfolio Project</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Project Title</label>
                    <input
                      type="text"
                      value={newProj.title}
                      onChange={(e) => setNewProj({ ...newProj, title: e.target.value })}
                      placeholder="e.g. E-Commerce Microservices, AI Job Portal"
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Technologies Used</label>
                    <input
                      type="text"
                      value={newProj.tech_stack}
                      onChange={(e) => setNewProj({ ...newProj, tech_stack: e.target.value })}
                      placeholder="e.g. React, Django, PostgreSQL, Docker"
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-white outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">GitHub Repo URL</label>
                    <input
                      type="url"
                      value={newProj.github_url}
                      onChange={(e) => setNewProj({ ...newProj, github_url: e.target.value })}
                      placeholder="https://github.com/username/project"
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Live Demo URL</label>
                    <input
                      type="url"
                      value={newProj.live_url}
                      onChange={(e) => setNewProj({ ...newProj, live_url: e.target.value })}
                      placeholder="https://myproject.demo.com"
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-white outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Description & Key Outcomes</label>
                  <textarea
                    rows={3}
                    value={newProj.description}
                    onChange={(e) => setNewProj({ ...newProj, description: e.target.value })}
                    placeholder="Designed RESTful architecture, implemented JWT auth, handled 100+ concurrent users..."
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white outline-none"
                  ></textarea>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={handleAddProject}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
                  >
                    + Add Project
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ================= STEP 7: CERTIFICATIONS ================= */}
          {currentStep === 7 && (
            <div className="space-y-6 text-xs">
              <div className="space-y-3">
                <span className="font-bold text-slate-800 text-sm block">Saved Certifications ({certificationsList.length})</span>
                {certificationsList.length === 0 ? (
                  <p className="text-slate-400 p-4 rounded-2xl bg-slate-50 text-center">
                    No certifications added yet. (Optional - you can skip to next step).
                  </p>
                ) : (
                  certificationsList.map((c, idx) => (
                    <div key={idx} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-start justify-between">
                      <div className="space-y-1">
                        <h4 className="font-bold text-sm text-navy-900">{c.name}</h4>
                        <p className="text-slate-600">{c.issuer} {c.issue_date ? `• Issued ${c.issue_date}` : ''}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveCert(idx)}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Add Cert Form */}
              <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
                <h4 className="font-bold text-xs text-slate-800">+ Add Certification</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Certificate Name</label>
                    <input
                      type="text"
                      value={newCert.name}
                      onChange={(e) => setNewCert({ ...newCert, name: e.target.value })}
                      placeholder="e.g. AWS Certified Cloud Practitioner"
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Issuing Organization</label>
                    <input
                      type="text"
                      value={newCert.issuer}
                      onChange={(e) => setNewCert({ ...newCert, issuer: e.target.value })}
                      placeholder="e.g. Amazon Web Services, Coursera, Meta"
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-white outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Issue Date</label>
                    <input
                      type="text"
                      value={newCert.issue_date}
                      onChange={(e) => setNewCert({ ...newCert, issue_date: e.target.value })}
                      placeholder="e.g. 2024"
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-white outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Credential URL / ID</label>
                    <input
                      type="text"
                      value={newCert.url}
                      onChange={(e) => setNewCert({ ...newCert, url: e.target.value })}
                      placeholder="https://credential.net/..."
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-white outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="button"
                    onClick={handleAddCert}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
                  >
                    + Add Certification
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ================= STEP 8: RESUME UPLOAD ================= */}
          {currentStep === 8 && (
            <div className="space-y-6 text-xs">
              <div className="space-y-3">
                <span className="font-bold text-slate-800 text-sm block">Uploaded Resumes ({resumes.length})</span>
                {resumes.map((r) => (
                  <div key={r.id} className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50/50 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-6 h-6 text-emerald-600" />
                      <div>
                        <p className="font-bold text-sm text-slate-900">{r.title}</p>
                        <p className="text-[11px] text-slate-500">
                          {r.file_type.toUpperCase()} • {r.is_primary ? '★ Primary Resume' : 'Uploaded CV'}
                        </p>
                      </div>
                    </div>
                    <span className="text-emerald-700 font-bold text-[11px] bg-emerald-100 px-3 py-1 rounded-full">
                      Parsed & Ready
                    </span>
                  </div>
                ))}
              </div>

              {/* Upload Dropzone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 hover:border-blue-500 bg-slate-50/60 rounded-3xl p-8 text-center cursor-pointer transition space-y-3"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,.doc,.txt"
                  onChange={handleResumeUpload}
                  className="hidden"
                />
                <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold text-sm text-slate-800">
                    {uploadingResume ? 'Extracting text and analyzing skills...' : 'Upload your primary resume'}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Supports PDF (.pdf) and Word (.docx) up to 5MB
                  </p>
                </div>
                <span className="inline-block px-4 py-2 rounded-xl bg-white border border-slate-200 font-bold text-xs text-slate-700 shadow-sm">
                  {uploadingResume ? 'Uploading...' : 'Select Resume File'}
                </span>
              </div>
            </div>
          )}

          {/* ================= STEP 9: PROFESSIONAL LINKS ================= */}
          {currentStep === 9 && (
            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-800 mb-1">LinkedIn Profile</label>
                <input
                  type="url"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  placeholder="https://linkedin.com/in/username"
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">GitHub Profile</label>
                <input
                  type="url"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/username"
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">Personal Portfolio / Website</label>
                <input
                  type="url"
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  placeholder="https://yourportfolio.dev"
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white outline-none"
                />
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs transition flex items-center space-x-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : (
              <div></div>
            )}

            <div className="flex items-center space-x-3">
              {currentStep < 9 && (
                <button
                  type="button"
                  onClick={() => saveCurrentStepData(currentStep + 1)}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  Skip for now
                </button>
              )}

              <button
                type="button"
                disabled={saving}
                onClick={() => saveCurrentStepData(currentStep + 1)}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition flex items-center space-x-2"
              >
                <span>{currentStep === 9 ? 'Finish & Go to Dashboard' : 'Save & Continue'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

