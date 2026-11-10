import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { 
  FileText, 
  UploadCloud, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Sparkles, 
  RefreshCw, 
  ArrowRight, 
  Search, 
  ShieldCheck,
  ChevronDown,
  Briefcase,
  AlertCircle,
  Target,
  TrendingUp,
  Zap,
  Copy,
  Check,
  Download,
  Edit3,
  Bot,
  X,
  Layers,
  FileCheck,
  ExternalLink
} from 'lucide-react';

export default function ATSCheckerPage() {
  const navigate = useNavigate();
  const { isAuthenticated, isCandidate } = useAuth();
  
  // Input Modes: 'upload' | 'saved' | 'paste'
  const [inputMode, setInputMode] = useState('upload');

  // Direct File Upload state
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const fileInputRef = useRef(null);

  // Saved resumes state
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState('');

  // Manual text fallback
  const [manualText, setManualText] = useState('');

  // Step 2: Job Matching state
  const [showJobMatching, setShowJobMatching] = useState(false);
  const [targetRoles, setTargetRoles] = useState([]);
  const [roleSearchQuery, setRoleSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState(null);
  const [customJobDescription, setCustomJobDescription] = useState('');

  // Analysis State
  const [analyzing, setAnalyzing] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  // Step 3: Resume Improvement Studio state
  const [studioOpen, setStudioOpen] = useState(false);
  const [improving, setImproving] = useState(false);
  const [improvementData, setImprovementData] = useState(null);
  const [editableDraft, setEditableDraft] = useState('');
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    async function loadInitialData() {
      try {
        if (isAuthenticated && isCandidate) {
          const resData = await api.getResumes();
          const list = resData.results || resData;
          setResumes(list);
          const primary = list.find(r => r.is_primary);
          if (primary) {
            setSelectedResumeId(primary.id);
          } else if (list.length > 0) {
            setSelectedResumeId(list[0].id);
          }
        }

        // Load 25+ target role presets
        const presets = await api.getATSPresets();
        setTargetRoles(presets);
      } catch (e) {
        console.error("Error loading presets or resumes:", e);
      }
    }
    loadInitialData();
  }, [isAuthenticated, isCandidate]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    validateAndSetFile(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    validateAndSetFile(file);
  };

  const validateAndSetFile = (file) => {
    setFileError('');
    if (!file) return;

    const ext = file.name.split('.').pop().toLowerCase();
    if (!['pdf', 'docx', 'doc', 'txt'].includes(ext)) {
      setFileError('Supported file formats: PDF, DOCX, DOC, or TXT');
      setSelectedFile(null);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setFileError('File size exceeds the 5MB limit.');
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  // Step 1: Independent Analysis
  const handleRunAnalysis = async (includeJob = false) => {
    setError('');
    setResult(null);

    if (inputMode === 'upload' && !selectedFile) {
      setError('Please upload a PDF or DOCX resume to analyze.');
      return;
    }
    if (inputMode === 'saved' && !selectedResumeId) {
      setError('Please select a saved resume from your profile.');
      return;
    }
    if (inputMode === 'paste' && (!manualText || manualText.trim().length < 40)) {
      setError('Please paste at least 40 characters of resume content.');
      return;
    }

    setAnalyzing(true);
    setStatusMessage(includeJob ? 'Evaluating resume against job requirements...' : 'Analyzing formatting, sections, and technical skills...');

    try {
      let response;
      if (inputMode === 'upload' && selectedFile) {
        const formData = new FormData();
        formData.append('file', selectedFile);
        if (includeJob && selectedRole) {
          formData.append('job_title', selectedRole.title);
          formData.append('job_description', customJobDescription || selectedRole.description);
        }
        response = await api.checkATS(formData, true);
      } else {
        const payload = {
          resume_id: inputMode === 'saved' ? Number(selectedResumeId) : null,
          resume_text: inputMode === 'paste' ? manualText : '',
          job_title: includeJob && selectedRole ? selectedRole.title : '',
          job_description: includeJob ? (customJobDescription || selectedRole?.description || '') : ''
        };
        response = await api.checkATS(payload, false);
      }

      setResult(response);
    } catch (err) {
      console.error(err);
      setError(err?.data?.error || 'Failed to analyze resume. Please verify the file format and try again.');
    } finally {
      setAnalyzing(false);
      setStatusMessage('');
    }
  };

  // Step 3: Open Resume Improvement Studio
  const handleOpenImprovementStudio = async () => {
    if (!result) return;
    setStudioOpen(true);
    setImproving(true);
    setCopied(false);

    try {
      const resumeContent = result.extracted_text || manualText || "Software developer with hands-on technical experience.";
      const targetRoleName = selectedRole?.title || result.job_title || "Full Stack Developer";
      const missingSkills = result.missing_skills || [];

      const improvement = await api.improveResume({
        resume_text: resumeContent,
        target_role: targetRoleName,
        missing_skills: missingSkills
      });

      setImprovementData(improvement);
      setEditableDraft(improvement.full_draft);
    } catch (err) {
      console.error("Error generating improvements:", err);
    } finally {
      setImproving(false);
    }
  };

  // Download improved resume
  const handleDownload = async (format) => {
    setDownloading(true);
    try {
      const blob = await api.downloadImprovedResume({
        content: editableDraft || improvementData?.full_draft,
        format: format
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Improved_Resume_${selectedRole?.title?.replace(/\s+/g, '_') || 'Nexora'}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error(err);
      alert("Failed to download improved resume. Please copy the text directly.");
    } finally {
      setDownloading(false);
    }
  };

  // Filter roles for Step 2
  const filteredRoles = targetRoles.filter(role => 
    role.title.toLowerCase().includes(roleSearchQuery.toLowerCase()) ||
    role.skills.some(s => s.toLowerCase().includes(roleSearchQuery.toLowerCase()))
  );

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8">
      
      {/* Top Header */}
      <div>
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold mb-2">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Professional ATS Resume Checker</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
          Applicant Tracking System (ATS) Resume Checker
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-3xl">
          Evaluate your resume independently against modern parser criteria (formatting, sections, skills, and metrics) or compare against 25+ target market roles to maximize interview shortlisting.
        </p>
      </div>

      {/* Main Grid: Upload & Options */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Input Form (Step 1 & Step 2) */}
        <div className="lg:col-span-6 space-y-6">

          {/* STEP 1: Upload Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <span className="w-6 h-6 rounded-full bg-navy-900 text-white text-xs font-bold flex items-center justify-center">1</span>
                <h2 className="text-sm sm:text-base font-bold text-navy-900">Upload or Select Resume</h2>
              </div>
              <span className="text-[11px] font-semibold text-slate-400">Step 1 of 3</span>
            </div>

            {/* Input Mode Selector */}
            <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-2xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setInputMode('upload')}
                className={`py-2 rounded-xl transition ${inputMode === 'upload' ? 'bg-white text-navy-900 shadow-sm' : 'text-slate-500 hover:text-navy-900'}`}
              >
                Upload File
              </button>
              <button
                type="button"
                onClick={() => setInputMode('saved')}
                className={`py-2 rounded-xl transition ${inputMode === 'saved' ? 'bg-white text-navy-900 shadow-sm' : 'text-slate-500 hover:text-navy-900'}`}
              >
                Saved Resumes
              </button>
              <button
                type="button"
                onClick={() => setInputMode('paste')}
                className={`py-2 rounded-xl transition ${inputMode === 'paste' ? 'bg-white text-navy-900 shadow-sm' : 'text-slate-500 hover:text-navy-900'}`}
              >
                Paste Text
              </button>
            </div>

            {/* Mode 1: Direct File Upload */}
            {inputMode === 'upload' && (
              <div className="space-y-3">
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-200 hover:border-blue-400 bg-slate-50 hover:bg-blue-50/40 rounded-2xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center space-y-2"
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".pdf,.docx,.doc,.txt"
                    className="hidden"
                  />
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-200 flex items-center justify-center text-blue-600">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-navy-900">
                      {selectedFile ? selectedFile.name : 'Click to upload or drag & drop resume'}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Accepts PDF, DOCX, DOC (up to 5MB)
                    </p>
                  </div>
                </div>

                {selectedFile && (
                  <div className="flex items-center justify-between p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-xs">
                    <div className="flex items-center space-x-2 text-navy-900 font-semibold truncate">
                      <FileCheck className="w-4 h-4 text-blue-600 shrink-0" />
                      <span className="truncate">{selectedFile.name}</span>
                      <span className="text-slate-400 text-[10px]">({(selectedFile.size / 1024).toFixed(0)} KB)</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedFile(null)}
                      className="text-slate-400 hover:text-red-500 p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
                {fileError && <p className="text-xs text-red-600 font-medium">{fileError}</p>}
              </div>
            )}

            {/* Mode 2: Select Saved Resume */}
            {inputMode === 'saved' && (
              <div className="space-y-3">
                {resumes.length === 0 ? (
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-500 text-center">
                    No saved resumes in your profile. Please switch to "Upload File" or paste text.
                  </div>
                ) : (
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-navy-900 block">Select Saved Profile Resume:</label>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {resumes.map(r => (
                        <div
                          key={r.id}
                          onClick={() => setSelectedResumeId(r.id)}
                          className={`p-3 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition ${
                            selectedResumeId === r.id
                              ? 'bg-blue-50/70 border-blue-400 text-navy-900 font-semibold'
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center space-x-2 truncate">
                            <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                            <span className="truncate">{r.title || r.filename}</span>
                            {r.is_primary && (
                              <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 text-[9px] font-bold">PRIMARY</span>
                            )}
                          </div>
                          {selectedResumeId === r.id && <Check className="w-4 h-4 text-blue-600" />}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mode 3: Paste Text */}
            {inputMode === 'paste' && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-navy-900 block">Paste Resume Content:</label>
                <textarea
                  rows={7}
                  value={manualText}
                  onChange={(e) => setManualText(e.target.value)}
                  placeholder="Paste work experience, education, skills, and summary..."
                  className="w-full p-3 rounded-2xl border border-slate-200 bg-slate-50 text-xs text-navy-900 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            )}

            {/* Step 1 Action Button: Independent Analysis */}
            <button
              type="button"
              disabled={analyzing}
              onClick={() => handleRunAnalysis(false)}
              className="w-full py-3.5 px-4 bg-navy-900 hover:bg-navy-800 text-white rounded-2xl font-bold text-xs tracking-wide shadow-sm flex items-center justify-center space-x-2 transition disabled:opacity-50"
            >
              {analyzing && !showJobMatching ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-blue-400" />
                  <span>{statusMessage || 'Analyzing Resume...'}</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-blue-400" />
                  <span>Analyze Resume (Independent ATS Evaluation)</span>
                </>
              )}
            </button>
          </div>

          {/* STEP 2: Optional Job Matching Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center">2</span>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-navy-900">Compare with a Job (Optional)</h3>
                  <p className="text-[11px] text-slate-400">Match against 25+ standard roles or paste a specific job description</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowJobMatching(!showJobMatching)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center space-x-1"
              >
                <span>{showJobMatching ? 'Hide' : 'Add Target Role'}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition transform ${showJobMatching ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {showJobMatching && (
              <div className="space-y-4 pt-3 border-t border-slate-100">
                {/* Searchable Target Roles List */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-navy-900 block">Select from 25+ Trending Roles:</label>
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      value={roleSearchQuery}
                      onChange={(e) => setRoleSearchQuery(e.target.value)}
                      placeholder="Search roles (e.g. Python, Full Stack, Data Analyst, Cloud)..."
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>

                  <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                    {filteredRoles.map(r => (
                      <div
                        key={r.id}
                        onClick={() => {
                          setSelectedRole(r);
                          setCustomJobDescription(r.description);
                        }}
                        className={`p-2.5 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition ${
                          selectedRole?.id === r.id
                            ? 'bg-blue-50/70 border-blue-400 text-navy-900 font-semibold'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        <div className="truncate">
                          <p className="font-semibold text-navy-900">{r.title}</p>
                          <p className="text-[10px] text-slate-400 truncate">{r.skills.slice(0, 5).join(' • ')}</p>
                        </div>
                        {selectedRole?.id === r.id && <Check className="w-4 h-4 text-blue-600 shrink-0 ml-2" />}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Custom Job Description Area */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-navy-900 block">Or Paste Custom Job Description:</label>
                  <textarea
                    rows={4}
                    value={customJobDescription}
                    onChange={(e) => setCustomJobDescription(e.target.value)}
                    placeholder="Paste job posting description, requirements, and responsibilities..."
                    className="w-full p-3 rounded-2xl border border-slate-200 bg-slate-50 text-xs text-navy-900 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                {/* Recalculate Button */}
                <button
                  type="button"
                  disabled={analyzing || (!selectedRole && !customJobDescription)}
                  onClick={() => handleRunAnalysis(true)}
                  className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-xs tracking-wide shadow-sm flex items-center justify-center space-x-2 transition disabled:opacity-40"
                >
                  {analyzing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                      <span>{statusMessage}</span>
                    </>
                  ) : (
                    <>
                      <Target className="w-4 h-4 text-white" />
                      <span>Recalculate Score with Target Role</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-700 flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

        </div>

        {/* Right Column: Results & Measurable Criteria */}
        <div className="lg:col-span-6 space-y-6">

          {!result && !analyzing && (
            <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center space-y-4 shadow-sm">
              <div className="w-16 h-16 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                <FileText className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-navy-900">No Resume Analyzed Yet</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Upload a PDF/DOCX resume on the left or select a saved resume to view your ATS score and improvement roadmap.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100 flex flex-wrap justify-center gap-4 text-[11px] text-slate-500">
                <span className="flex items-center"><CheckCircle className="w-3.5 h-3.5 text-emerald-500 mr-1" /> 100% Free & Secure</span>
                <span className="flex items-center"><CheckCircle className="w-3.5 h-3.5 text-emerald-500 mr-1" /> PDF & DOCX Support</span>
                <span className="flex items-center"><CheckCircle className="w-3.5 h-3.5 text-emerald-500 mr-1" /> 25+ Target Roles</span>
              </div>
            </div>
          )}

          {analyzing && (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 shadow-sm">
              <RefreshCw className="w-10 h-10 animate-spin text-blue-600 mx-auto" />
              <div className="space-y-1">
                <h3 className="text-base font-bold text-navy-900">Analyzing Your Resume</h3>
                <p className="text-xs text-slate-400">{statusMessage || 'Parsing document structure, keywords, and metrics...'}</p>
              </div>
            </div>
          )}

          {result && (
            <div className="space-y-6">
              
              {/* Score Hero Card */}
              <div className="bg-gradient-to-br from-navy-900 via-navy-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div>
                    <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-[11px] font-bold uppercase tracking-wider">
                      {result.analysis_mode === 'job_matched' ? `Role: ${result.job_title}` : 'Independent Baseline'}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-black mt-2 tracking-tight">
                      ATS Compatibility Score
                    </h2>
                    <p className="text-xs text-slate-300 mt-1 max-w-sm">
                      {result.analysis_mode === 'job_matched' 
                        ? `Evaluated against key competencies for ${result.job_title}.`
                        : 'Evaluated against universal parser standards across formatting, sections, and technical density.'}
                    </p>
                  </div>

                  {/* Circular Score Badge */}
                  <div className="relative flex items-center justify-center shrink-0">
                    <div className="w-28 h-28 rounded-full border-4 border-slate-700/60 flex flex-col items-center justify-center bg-navy-900/80 shadow-2xl">
                      <span className="text-3xl sm:text-4xl font-extrabold text-blue-400">
                        {result.overall_score}
                      </span>
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">/ 100</span>
                    </div>
                  </div>
                </div>

                {/* Achievable Potential Score Callout */}
                <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-white">Achievable Target Score: <span className="text-emerald-400">{result.potential_score}%</span></p>
                      <p className="text-[11px] text-slate-300">Practical edits to formatting, power verbs, and metrics can boost your score.</p>
                    </div>
                  </div>

                  {/* STEP 3 ACTION BUTTON */}
                  <button
                    type="button"
                    onClick={handleOpenImprovementStudio}
                    className="px-4 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-bold text-xs tracking-wide shadow-md transition shrink-0 ml-3 flex items-center space-x-1.5"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Improve My Resume</span>
                  </button>
                </div>
              </div>

              {/* Measurable Criteria Breakdown (Formatting, Sections, Skills, Experience, Keywords) */}
              {result.measurable_criteria && (
                <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
                  <h3 className="text-sm font-bold text-navy-900 flex items-center space-x-2">
                    <Layers className="w-4 h-4 text-blue-600" />
                    <span>Measurable ATS Evaluation Criteria</span>
                  </h3>

                  <div className="space-y-3.5">
                    {Object.entries(result.measurable_criteria).map(([key, item]) => (
                      <div key={key} className="space-y-1">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-slate-700">{item.label}</span>
                          <span className={`font-bold ${item.score >= 80 ? 'text-emerald-600' : item.score >= 60 ? 'text-blue-600' : 'text-amber-600'}`}>
                            {item.score}%
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-2 rounded-full transition-all duration-500 ${
                              item.score >= 80 ? 'bg-emerald-500' : item.score >= 60 ? 'bg-blue-500' : 'bg-amber-500'
                            }`}
                            style={{ width: `${item.score}%` }}
                          />
                        </div>
                        <p className="text-[10px] text-slate-400">{item.details}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Matched vs Missing Skills (If Job Matched) */}
              {result.analysis_mode === 'job_matched' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-2">
                    <p className="text-xs font-bold text-emerald-700 flex items-center">
                      <CheckCircle className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                      Matched Skills ({result.matched_skills?.length || 0})
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {result.matched_skills?.length > 0 ? (
                        result.matched_skills.map((s, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 text-[11px] font-semibold border border-emerald-200">
                            {s}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400">No direct skills matched yet.</span>
                      )}
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-2">
                    <p className="text-xs font-bold text-amber-700 flex items-center">
                      <AlertTriangle className="w-3.5 h-3.5 mr-1 text-amber-600" />
                      Missing Role Skills ({result.missing_skills?.length || 0})
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {result.missing_skills?.length > 0 ? (
                        result.missing_skills.map((s, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded-lg bg-amber-50 text-amber-800 text-[11px] font-semibold border border-amber-200">
                            {s}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-emerald-600 font-medium">All core role skills matched!</span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Strengths & Weaknesses Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Strengths */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
                  <h4 className="text-xs font-bold text-navy-900 flex items-center space-x-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Identified Strengths</span>
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-600">
                    {result.strengths?.map((str, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <span className="text-emerald-500 font-bold">•</span>
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Weaknesses */}
                <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
                  <h4 className="text-xs font-bold text-navy-900 flex items-center space-x-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    <span>Areas for Improvement</span>
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-600">
                    {result.weaknesses?.map((w, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <span className="text-amber-500 font-bold">•</span>
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Actionable Suggestions */}
              {result.suggestions && result.suggestions.length > 0 && (
                <div className="bg-blue-50/60 rounded-3xl border border-blue-200 p-6 space-y-3">
                  <h4 className="text-xs font-bold text-navy-900 flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-blue-600" />
                    <span>Actionable Recommendations</span>
                  </h4>
                  <div className="space-y-2 text-xs text-slate-700">
                    {result.suggestions.map((sug, idx) => (
                      <div key={idx} className="p-3 bg-white rounded-xl border border-blue-100 flex items-start space-x-2 shadow-2xs">
                        <span className="w-4 h-4 rounded-full bg-blue-100 text-blue-700 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span>{sug}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

        </div>

      </div>

      {/* STEP 3 MODAL: RESUME IMPROVEMENT STUDIO */}
      {studioOpen && (
        <div className="fixed inset-0 z-50 bg-navy-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
            
            {/* Studio Header */}
            <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-navy-900 text-white flex items-center justify-center shadow-sm">
                  <Edit3 className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-extrabold text-navy-900">
                    Resume Improvement Studio
                  </h3>
                  <p className="text-xs text-slate-500">
                    Review and edit optimized phrasing, action power verbs, and structured sections before saving.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setStudioOpen(false)}
                className="w-8 h-8 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Studio Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              
              {improving ? (
                <div className="py-16 text-center space-y-3">
                  <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
                  <p className="text-xs text-slate-500 font-semibold">Generating tailored recommendations and draft...</p>
                </div>
              ) : (
                <>
                  {/* Practical Suggestions Banner */}
                  <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex items-start space-x-3 text-xs">
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="font-bold text-emerald-900">Practical Path toward a 90+ Score</p>
                      <p className="text-emerald-800">
                        We have reformatted your skills into clean categories, introduced strong action verbs, and inserted metric placeholders. Edit any text directly in the studio below to match your real achievements.
                      </p>
                    </div>
                  </div>

                  {/* Interactive Textarea Editor */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-navy-900">
                      <span>Editable Improved Resume Draft:</span>
                      <span className="text-[11px] text-slate-400 font-normal">Edit freely below</span>
                    </div>
                    <textarea
                      rows={14}
                      value={editableDraft}
                      onChange={(e) => setEditableDraft(e.target.value)}
                      className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50 text-xs text-navy-900 font-mono leading-relaxed focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                </>
              )}

            </div>

            {/* Studio Footer Actions */}
            <div className="p-4 sm:p-6 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
              
              {/* Left Action: Continue in Full AI Assistant */}
              <button
                type="button"
                onClick={() => {
                  setStudioOpen(false);
                  navigate('/assistant', {
                    state: {
                      initialPrompt: `I just analyzed my resume for ${selectedRole?.title || result?.job_title || 'Software Engineering'}. My ATS score was ${result?.overall_score}%. Can you help me refine my work experience bullets with strong metrics?`,
                      context: `Resume Text:\n${editableDraft || result?.extracted_text || ''}\nTarget Role: ${selectedRole?.title || ''}`
                    }
                  });
                }}
                className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center space-x-1.5 transition"
              >
                <Bot className="w-4 h-4 text-blue-600" />
                <span>Continue in Full AI Assistant</span>
              </button>

              {/* Right Actions: Copy & Downloads */}
              <div className="w-full sm:w-auto flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(editableDraft);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2500);
                  }}
                  className="px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center space-x-1 transition"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>

                <button
                  type="button"
                  disabled={downloading}
                  onClick={() => handleDownload('txt')}
                  className="px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold flex items-center space-x-1 transition"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  <span>Download .TXT</span>
                </button>

                <button
                  type="button"
                  disabled={downloading}
                  onClick={() => handleDownload('docx')}
                  className="px-4 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-xs font-bold flex items-center space-x-1.5 shadow transition"
                >
                  {downloading ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" />
                  ) : (
                    <Download className="w-3.5 h-3.5 text-blue-400" />
                  )}
                  <span>Download .DOCX</span>
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
