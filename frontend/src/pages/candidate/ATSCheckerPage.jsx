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
  ExternalLink,
  Save,
  Undo2,
  CheckCheck,
  Eye,
  Sliders,
  HelpCircle
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
  const [sectionsState, setSectionsState] = useState([]); // Array of section objects
  const [editableFullDraft, setEditableFullDraft] = useState('');
  const [studioTab, setStudioTab] = useState('sections'); // 'sections' | 'preview' | 'reevaluate'
  const [reEvaluating, setReEvaluating] = useState(false);
  const [reEvaluatedResult, setReEvaluatedResult] = useState(null);
  const [savingToProfile, setSavingToProfile] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    async function loadInitialData() {
      try {
        if (isAuthenticated && isCandidate) {
          const resData = await api.getResumes();
          const list = resData.results || resData || [];
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
        setTargetRoles(presets || []);
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

  // Run ATS / Resume Quality Analysis
  const handleRunAnalysis = async (includeJob = false) => {
    setError('');
    setResult(null);
    setReEvaluatedResult(null);

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
    setStatusMessage(includeJob ? 'Evaluating resume against job requirements...' : 'Analyzing document structure, sections, and technical skills...');

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
      setError(err?.data?.error || 'Failed to analyze resume. Please verify the file is text-readable and try again.');
    } finally {
      setAnalyzing(false);
      setStatusMessage('');
    }
  };

  // Open Resume Improvement Studio
  const handleOpenImprovementStudio = async () => {
    if (!result) return;
    setStudioOpen(true);
    setImproving(true);
    setCopied(false);
    setSaveSuccessMsg('');
    setStudioTab('sections');

    try {
      const resumeContent = result.extracted_text || manualText || "";
      const targetRoleName = selectedRole?.title || result.job_title || "Software Professional";
      const missingSkills = result.missing_skills || [];

      const improvement = await api.improveResume({
        resume_text: resumeContent,
        target_role: targetRoleName,
        missing_skills: missingSkills
      });

      setImprovementData(improvement);
      // Initialize sections state
      const initializedSections = (improvement.sections || []).map(sec => ({
        ...sec,
        currentContent: sec.suggested || sec.original,
        decision: 'accepted' // 'accepted' | 'original' | 'custom'
      }));
      setSectionsState(initializedSections);
      setEditableFullDraft(improvement.full_draft || '');
    } catch (err) {
      console.error("Error generating improvements:", err);
    } finally {
      setImproving(false);
    }
  };

  // Section Action: Accept Suggested
  const handleAcceptSection = (secId) => {
    setSectionsState(prev => prev.map(sec => {
      if (sec.id === secId) {
        return { ...sec, currentContent: sec.suggested, decision: 'accepted' };
      }
      return sec;
    }));
  };

  // Section Action: Keep Original
  const handleRejectSection = (secId) => {
    setSectionsState(prev => prev.map(sec => {
      if (sec.id === secId) {
        return { ...sec, currentContent: sec.original, decision: 'original' };
      }
      return sec;
    }));
  };

  // Section Action: Inline Edit
  const handleEditSectionContent = (secId, newText) => {
    setSectionsState(prev => prev.map(sec => {
      if (sec.id === secId) {
        return { ...sec, currentContent: newText, decision: 'custom' };
      }
      return sec;
    }));
  };

  // Assemble full draft from individual section states
  const getAssembledDraft = () => {
    if (sectionsState.length === 0) return editableFullDraft;
    const name = improvementData?.candidate_info?.name?.toUpperCase() || "CANDIDATE";
    const contact = Object.values(improvementData?.candidate_info || {})
      .filter(v => v && v !== name)
      .join(" | ");

    let doc = `${name}\n${contact}\n\n`;
    sectionsState.forEach(sec => {
      doc += `${sec.title.toUpperCase()}\n${'-'.repeat(30)}\n${sec.currentContent}\n\n`;
    });
    return doc.trim();
  };

  // Re-evaluate Revised Resume (CHUNK 4: Transparent, real calculation)
  const handleReEvaluateResume = async () => {
    setReEvaluating(true);
    const textToScore = getAssembledDraft();
    try {
      const res = await api.reEvaluateRevisedResume({
        revised_text: textToScore,
        job_title: selectedRole?.title || result?.job_title || '',
        job_description: customJobDescription || selectedRole?.description || ''
      });
      setReEvaluatedResult(res);
    } catch (err) {
      alert("Failed to re-evaluate revised resume.");
    } finally {
      setReEvaluating(false);
    }
  };

  // Save Improved Resume to Profile
  const handleSaveToProfile = async () => {
    setSavingToProfile(true);
    setSaveSuccessMsg('');
    const content = getAssembledDraft();
    const roleName = selectedRole?.title || result?.job_title || 'Software';

    try {
      const res = await api.saveImprovedToResumes({
        content: content,
        title: `Optimized Resume - ${roleName}`,
        target_role: roleName
      });
      setSaveSuccessMsg('Changes saved successfully to your resume data! Your improvements are preserved.');
    } catch (err) {
      alert("Error saving resume changes.");
    } finally {
      setSavingToProfile(false);
    }
  };

  // Download improved resume (.docx or .txt)
  const handleDownload = async (format) => {
    setDownloading(true);
    const content = getAssembledDraft();
    try {
      const blob = await api.downloadImprovedResume({
        content: content,
        format: format
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ATS_Optimized_Resume_${selectedRole?.title?.replace(/\s+/g, '_') || 'Nexora'}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error(err);
      alert("Failed to download resume. You can copy the text directly.");
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
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8 font-sans">
      
      {/* Top Header */}
      <div>
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-50 text-teal-700 border border-teal-200 text-xs font-bold mb-2">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
          <span>Evidence-Based ATS Resume Evaluation</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          ATS Resume Checker & Quality Evaluator
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
          Get honest, transparent feedback on your resume’s parser readability, section structure, and technical skill density. Never generates fake scores, inflated metrics, or false promises.
        </p>
      </div>

      {/* Main Grid: Upload & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Input Form (Step 1 & Step 2) */}
        <div className="lg:col-span-6 space-y-6">

          {/* STEP 1: Upload Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <span className="w-6 h-6 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center">1</span>
                <h2 className="text-sm sm:text-base font-bold text-slate-900">Upload or Select Resume</h2>
              </div>
              <span className="text-[11px] font-semibold text-slate-400">Step 1 of 2</span>
            </div>

            {/* Input Mode Selector */}
            <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-2xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setInputMode('upload')}
                className={`py-2 rounded-xl transition ${inputMode === 'upload' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'}`}
              >
                Upload File
              </button>
              <button
                type="button"
                onClick={() => setInputMode('saved')}
                className={`py-2 rounded-xl transition ${inputMode === 'saved' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'}`}
              >
                Saved Resume
              </button>
              <button
                type="button"
                onClick={() => setInputMode('paste')}
                className={`py-2 rounded-xl transition ${inputMode === 'paste' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'}`}
              >
                Paste Text
              </button>
            </div>

            {/* Mode 1: File Upload */}
            {inputMode === 'upload' && (
              <div className="space-y-3">
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-200 hover:border-teal-400 bg-slate-50 hover:bg-teal-50/20 rounded-2xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center space-y-2"
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".pdf,.docx,.doc,.txt"
                    className="hidden"
                  />
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-xs border border-slate-200 flex items-center justify-center text-teal-600">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">
                      {selectedFile ? selectedFile.name : 'Click to upload or drag & drop resume'}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Accepts PDF, DOCX, DOC (up to 5MB)
                    </p>
                  </div>
                </div>

                {selectedFile && (
                  <div className="flex items-center justify-between p-3 bg-teal-50/60 border border-teal-200 rounded-xl text-xs">
                    <div className="flex items-center space-x-2 text-slate-900 font-semibold truncate">
                      <FileCheck className="w-4 h-4 text-teal-600 shrink-0" />
                      <span className="truncate">{selectedFile.name}</span>
                      <span className="text-slate-500 text-[10px]">({(selectedFile.size / 1024).toFixed(0)} KB)</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedFile(null)}
                      className="text-slate-400 hover:text-rose-500 p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
                {fileError && <p className="text-xs text-rose-600 font-medium">{fileError}</p>}
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
                    <label className="text-xs font-bold text-slate-900 block">Select Saved Profile Resume:</label>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {resumes.map(r => (
                        <div
                          key={r.id}
                          onClick={() => setSelectedResumeId(r.id)}
                          className={`p-3 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition ${
                            selectedResumeId === r.id
                              ? 'bg-teal-50/70 border-teal-500 text-slate-900 font-semibold'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center space-x-2 truncate">
                            <FileText className="w-4 h-4 text-teal-600 shrink-0" />
                            <span className="truncate">{r.title || r.filename}</span>
                            {r.is_primary && (
                              <span className="px-1.5 py-0.5 rounded bg-teal-100 text-teal-800 text-[9px] font-bold">PRIMARY</span>
                            )}
                          </div>
                          {selectedResumeId === r.id && <Check className="w-4 h-4 text-teal-600" />}
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
                <label className="text-xs font-bold text-slate-900 block">Paste Resume Content:</label>
                <textarea
                  rows={7}
                  value={manualText}
                  onChange={(e) => setManualText(e.target.value)}
                  placeholder="Paste work experience, education, skills, and summary..."
                  className="w-full p-3 rounded-2xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none"
                />
              </div>
            )}

            {/* Independent Evaluation Button */}
            <button
              type="button"
              disabled={analyzing}
              onClick={() => handleRunAnalysis(false)}
              className="w-full py-3.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-xs tracking-wide shadow-xs flex items-center justify-center space-x-2 transition disabled:opacity-50"
            >
              {analyzing && !showJobMatching ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-teal-400" />
                  <span>{statusMessage || 'Analyzing Document...'}</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-teal-400" />
                  <span>Calculate Resume Quality Score (Independent)</span>
                </>
              )}
            </button>
          </div>

          {/* STEP 2: Optional Job Matching Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center">2</span>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">Compare with a Job (Optional)</h3>
                  <p className="text-[11px] text-slate-500">Calculate separate Job Match Score against 25+ roles or a custom JD</p>
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
                {/* Searchable Target Roles */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-900 block">Select from 25+ Industry Roles:</label>
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
                    <input
                      type="text"
                      value={roleSearchQuery}
                      onChange={(e) => setRoleSearchQuery(e.target.value)}
                      placeholder="Search roles (e.g. Python, Full Stack, Data Analyst, Cloud)..."
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none"
                    />
                  </div>

                  <div className="max-h-44 overflow-y-auto space-y-1.5 pr-1">
                    {filteredRoles.map(r => (
                      <div
                        key={r.id}
                        onClick={() => {
                          setSelectedRole(r);
                          setCustomJobDescription(r.description);
                        }}
                        className={`p-2.5 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition ${
                          selectedRole?.id === r.id
                            ? 'bg-teal-50/70 border-teal-500 text-slate-900 font-semibold'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className="truncate">
                          <p className="font-semibold text-slate-900">{r.title}</p>
                          <p className="text-[10px] text-slate-400 truncate">{r.skills.slice(0, 5).join(' • ')}</p>
                        </div>
                        {selectedRole?.id === r.id && <Check className="w-4 h-4 text-teal-600 shrink-0 ml-2" />}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Custom Job Description Area */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-900 block">Or Paste Custom Job Description:</label>
                  <textarea
                    rows={4}
                    value={customJobDescription}
                    onChange={(e) => setCustomJobDescription(e.target.value)}
                    placeholder="Paste job posting description and requirements..."
                    className="w-full p-3 rounded-2xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none"
                  />
                </div>

                {/* Recalculate Button */}
                <button
                  type="button"
                  disabled={analyzing || (!selectedRole && !customJobDescription)}
                  onClick={() => handleRunAnalysis(true)}
                  className="w-full py-3 px-4 bg-teal-600 hover:bg-teal-700 text-white rounded-2xl font-bold text-xs tracking-wide shadow-xs flex items-center justify-center space-x-2 transition disabled:opacity-40"
                >
                  {analyzing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                      <span>{statusMessage}</span>
                    </>
                  ) : (
                    <>
                      <Target className="w-4 h-4 text-white" />
                      <span>Calculate Job Match Score</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {error && (
            <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

        </div>

        {/* Right Column: Results & Measurable Criteria */}
        <div className="lg:col-span-6 space-y-6">

          {!result && !analyzing && (
            <div className="bg-white rounded-3xl border border-slate-200 p-10 text-center space-y-4 shadow-xs">
              <div className="w-16 h-16 rounded-3xl bg-slate-100 text-slate-700 flex items-center justify-center mx-auto">
                <FileText className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">No Resume Analyzed Yet</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Upload a PDF/DOCX resume on the left or select a saved resume to view your honest Resume Quality Score and evidence breakdown.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100 flex flex-wrap justify-center gap-4 text-[11px] text-slate-500">
                <span className="flex items-center"><CheckCircle className="w-3.5 h-3.5 text-teal-600 mr-1" /> Transparent 6-Category Scoring</span>
                <span className="flex items-center"><CheckCircle className="w-3.5 h-3.5 text-teal-600 mr-1" /> PDF & DOCX Support</span>
                <span className="flex items-center"><CheckCircle className="w-3.5 h-3.5 text-teal-600 mr-1" /> No Fabricated Numbers</span>
              </div>
            </div>
          )}

          {analyzing && (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 shadow-xs">
              <RefreshCw className="w-10 h-10 animate-spin text-teal-600 mx-auto" />
              <div className="space-y-1">
                <h3 className="text-base font-bold text-slate-900">Evaluating Resume Integrity</h3>
                <p className="text-xs text-slate-500">{statusMessage || 'Parsing structure, skills, and metrics...'}</p>
              </div>
            </div>
          )}

          {result && (
            <div className="space-y-6">
              
              {/* Parsing Warnings / Scanned PDF alerts */}
              {result.parsing_alerts && result.parsing_alerts.length > 0 && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs space-y-1.5 text-amber-900">
                  <div className="flex items-center space-x-1.5 font-bold text-amber-800">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Parser Notice:</span>
                  </div>
                  {result.parsing_alerts.map((al, idx) => (
                    <p key={idx} className="text-[11px] text-amber-800 leading-relaxed">• {al}</p>
                  ))}
                </div>
              )}

              {/* Primary Score Hero Card */}
              <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-sm space-y-6">
                
                {/* Score Header */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-100">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200 text-[10px] font-bold uppercase tracking-wider">
                        {result.analysis_mode === 'job_matched' ? `Job Match: ${result.job_title}` : 'Universal Quality Baseline'}
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                      {result.analysis_mode === 'job_matched' ? 'Job Match Compatibility' : 'Resume Quality Score'}
                    </h2>
                    <p className="text-xs text-slate-500 max-w-sm">
                      {result.analysis_mode === 'job_matched' 
                        ? `Evaluated against core and preferred requirements for ${result.job_title}.`
                        : 'Evaluated against universal parser standards: formatting, section structure, skill density, and impact evidence.'}
                    </p>
                  </div>

                  {/* Circular Score Badge */}
                  <div className="relative flex items-center justify-center shrink-0">
                    <div className={`w-24 h-24 rounded-full border-4 flex flex-col items-center justify-center shadow-xs ${
                      result.overall_score >= 80 ? 'border-emerald-500 bg-emerald-50/40 text-emerald-800' :
                      result.overall_score >= 60 ? 'border-teal-500 bg-teal-50/40 text-teal-800' :
                      'border-amber-500 bg-amber-50/40 text-amber-800'
                    }`}>
                      <span className="text-3xl font-black">
                        {result.overall_score}
                      </span>
                      <span className="text-[9px] uppercase font-bold text-slate-400">/ 100</span>
                    </div>
                  </div>
                </div>

                {/* Score Dual Callout (If Job Matched, show both) */}
                {result.analysis_mode === 'job_matched' && (
                  <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-500 block">Resume Quality Score</span>
                      <span className="text-base font-bold text-slate-800">{result.resume_quality_score} / 100</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase text-teal-700 block">Job Match Score</span>
                      <span className="text-base font-bold text-teal-700">{result.job_match_score} / 100</span>
                    </div>
                  </div>
                )}

                {/* Studio CTA Button */}
                <div className="flex items-center justify-between pt-2">
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">Resume Improvement Studio</span>
                    <span className="text-[11px] text-slate-500">Review section-by-section suggestions and add real metrics.</span>
                  </div>

                  <button
                    type="button"
                    onClick={handleOpenImprovementStudio}
                    className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs tracking-wide shadow-xs transition shrink-0 ml-3 flex items-center space-x-1.5"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Open Studio</span>
                  </button>
                </div>

              </div>

              {/* 6-Category Transparent Criteria Breakdown (CHUNK 2) */}
              {result.measurable_criteria && (
                <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
                      <Layers className="w-4 h-4 text-teal-600" />
                      <span>Transparent Scoring Breakdown (100 Pts Total)</span>
                    </h3>
                    <span className="text-[10px] text-slate-400 font-semibold">Points Earned / Max</span>
                  </div>

                  <div className="space-y-4">
                    {Object.entries(result.measurable_criteria).map(([key, item]) => (
                      <div key={key} className="space-y-1.5">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-slate-800">{item.label}</span>
                          <span className="font-bold text-slate-900">
                            {item.earned} / {item.max} pts ({item.score}%)
                          </span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-2 rounded-full transition-all duration-500 ${
                              item.score >= 80 ? 'bg-emerald-500' : item.score >= 60 ? 'bg-teal-500' : 'bg-amber-500'
                            }`}
                            style={{ width: `${item.score}%` }}
                          />
                        </div>
                        <p className="text-[10px] text-slate-500">{item.details}</p>
                        
                        {/* Deductions notes */}
                        {item.deductions && item.deductions.length > 0 && (
                          <div className="pt-1">
                            {item.deductions.map((ded, dIdx) => (
                              <p key={dIdx} className="text-[10px] text-amber-700 flex items-center space-x-1">
                                <span className="text-amber-500 font-bold">•</span>
                                <span>{ded}</span>
                              </p>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Matched vs Missing Skills (When Job Matched - CHUNK 3) */}
              {result.analysis_mode === 'job_matched' && (
                <div className="space-y-4">
                  
                  {/* Mandatory Skills Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-2">
                      <p className="text-xs font-bold text-emerald-800 flex items-center">
                        <CheckCircle className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                        Core / Mandatory Skills Matched ({result.matched_mandatory?.length || 0})
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {result.matched_mandatory?.length > 0 ? (
                          result.matched_mandatory.map((s, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 text-[11px] font-semibold border border-emerald-200">
                              {s}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-slate-400">No core mandatory skills matched yet.</span>
                        )}
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-2">
                      <p className="text-xs font-bold text-amber-800 flex items-center">
                        <AlertTriangle className="w-3.5 h-3.5 mr-1 text-amber-600" />
                        Core Skills Missing ({result.missing_mandatory?.length || 0})
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {result.missing_mandatory?.length > 0 ? (
                          result.missing_mandatory.map((s, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded-lg bg-amber-50 text-amber-800 text-[11px] font-semibold border border-amber-200">
                              {s}
                            </span>
                          ))
                        ) : (
                          <span className="text-xs text-emerald-700 font-medium">All mandatory skills matched!</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Partially Demonstrated Skills */}
                  {result.partially_matched && result.partially_matched.length > 0 && (
                    <div className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-2xl text-xs space-y-1">
                      <span className="font-bold text-blue-900 block">Transferable / Related Competencies Detected:</span>
                      {result.partially_matched.map((pm, idx) => (
                        <p key={idx} className="text-[11px] text-blue-800">• {pm}</p>
                      ))}
                    </div>
                  )}

                  {/* Role Recommendations */}
                  {result.role_recommendations && result.role_recommendations.length > 0 && (
                    <div className="bg-white rounded-2xl border border-slate-200 p-4 space-y-2 text-xs">
                      <span className="font-bold text-slate-900 block">Target Role Recommendations:</span>
                      {result.role_recommendations.map((rec, idx) => (
                        <p key={idx} className="text-slate-700 leading-relaxed">• {rec}</p>
                      ))}
                    </div>
                  )}

                </div>
              )}

              {/* Point-Bearing Improvement Opportunities (CHUNK 4: Measurable Points) */}
              {result.improvement_opportunities && result.improvement_opportunities.length > 0 && (
                <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 flex items-center space-x-2">
                    <Zap className="w-4 h-4 text-teal-600" />
                    <span>Evidence-Based Point Gain Opportunities</span>
                  </h4>
                  <div className="space-y-2.5">
                    {result.improvement_opportunities.map((opp, idx) => (
                      <div key={idx} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-start justify-between space-x-3 text-xs">
                        <div className="space-y-0.5">
                          <p className="font-bold text-slate-900">{opp.action}</p>
                          <p className="text-[11px] text-slate-600 leading-relaxed">{opp.description}</p>
                        </div>
                        <span className="px-2 py-1 rounded-xl bg-teal-50 border border-teal-200 text-teal-800 text-[10px] font-black shrink-0">
                          +{opp.points_available} pts
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Identified Strengths & Weaknesses */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Verified Strengths</span>
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-700">
                    {result.strengths?.map((str, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <span className="text-emerald-500 font-bold">•</span>
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    <span>Areas for Improvement</span>
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-700">
                    {result.weaknesses?.slice(0, 4).map((w, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <span className="text-amber-500 font-bold">•</span>
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>

      {/* ========================================================================= */}
      {/* RESUME IMPROVEMENT STUDIO (Simplified, Section-by-Section Workflow) */}
      {/* ========================================================================= */}
      {studioOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden">
            
            {/* Studio Header */}
            <div className="p-5 sm:p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
                  <Edit3 className="w-5 h-5 text-teal-400" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-slate-900">
                    Resume Improvement Studio
                  </h3>
                  <p className="text-xs text-slate-500">
                    Section-by-section suggestions to improve readability and keyword alignment. Edit directly below.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStudioOpen(false)}
                className="w-8 h-8 rounded-xl border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Studio Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              
              {improving ? (
                <div className="py-20 text-center space-y-3">
                  <RefreshCw className="w-8 h-8 animate-spin text-teal-600 mx-auto" />
                  <p className="text-xs text-slate-500 font-semibold">Analyzing resume and generating section suggestions...</p>
                </div>
              ) : (
                <>
                  {saveSuccessMsg && (
                    <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="font-semibold">{saveSuccessMsg}</span>
                    </div>
                  )}

                  {/* Trust & Transparency Guidance */}
                  <div className="p-4 bg-teal-50/70 border border-teal-200 rounded-2xl space-y-1.5 text-xs">
                    <div className="flex items-center space-x-2 text-teal-950 font-bold">
                      <CheckCircle className="w-4 h-4 text-teal-600 shrink-0" />
                      <span>Authentic Phrasing & Section Improvements</span>
                    </div>
                    <p className="text-teal-800 leading-relaxed text-[11px]">
                      The AI-suggested version below refines active verbs, professional structure, and keyword relevance strictly based on your uploaded experience. <strong>No skills, certifications, or metrics are ever fabricated.</strong> You can edit the suggested text directly.
                    </p>
                    <p className="text-teal-700/80 text-[10px] italic">
                      *Note: Suggestions help enhance clarity and ATS readability; they do not guarantee a specific automated score.
                    </p>
                  </div>

                  {/* Section List */}
                  <div className="space-y-6">
                    {sectionsState.map((sec, idx) => (
                      <div key={sec.id || idx} className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4 shadow-2xs">
                        
                        {/* Section Title & Rationale */}
                        <div className="border-b border-slate-200 pb-2.5">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">{sec.title}</span>
                            <span className="text-[10px] font-semibold text-teal-700 bg-teal-100/70 px-2 py-0.5 rounded-md">Suggested Revision</span>
                          </div>
                          {sec.rationale && (
                            <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                              <strong>Why this helps ATS:</strong> {sec.rationale}
                            </p>
                          )}
                        </div>

                        {/* Side-by-side or Original Reference + Suggested Editor */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                          
                          {/* Original Text Reference (4 cols) */}
                          <div className="lg:col-span-5 bg-white border border-slate-200 rounded-xl p-3.5 space-y-1.5">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Original Section:</span>
                            <div className="text-xs text-slate-600 whitespace-pre-wrap font-sans leading-relaxed max-h-48 overflow-y-auto pr-1">
                              {sec.original || "No original content provided for this section."}
                            </div>
                          </div>

                          {/* Suggested & Editable Textarea (7 cols - Main Focus) */}
                          <div className="lg:col-span-7 space-y-1.5">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="font-bold text-slate-800">Suggested Version (Click & edit directly):</span>
                              <span className="text-[10px] text-slate-400">Directly editable</span>
                            </div>
                            <textarea
                              rows={Math.max(4, Math.min(10, (sec.currentContent || '').split('\n').length + 2))}
                              value={sec.currentContent}
                              onChange={(e) => handleEditSectionContent(sec.id, e.target.value)}
                              className="w-full p-3 rounded-xl border border-teal-300 bg-white text-xs text-slate-900 font-mono leading-relaxed focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none shadow-xs transition"
                              placeholder="Edit your improved text here..."
                            />
                          </div>

                        </div>

                      </div>
                    ))}
                  </div>

                </>
              )}

            </div>

            {/* Studio Footer Actions */}
            <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3 shrink-0">
              
              <button
                type="button"
                onClick={() => setStudioOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold transition"
              >
                Close
              </button>

              <div className="flex items-center space-x-2">
                {/* Copy Assembled Draft */}
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(getAssembledDraft());
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2500);
                  }}
                  className="px-3.5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold flex items-center space-x-1.5 transition"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                  <span>{copied ? 'Copied' : 'Copy Text'}</span>
                </button>

                {/* Clear Primary Action: Save Changes */}
                <button
                  type="button"
                  disabled={savingToProfile || improving}
                  onClick={handleSaveToProfile}
                  className="px-5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center space-x-1.5 shadow-sm transition disabled:opacity-50"
                  title="Save revised sections to your resume data"
                >
                  {savingToProfile ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-white" />
                      <span>Saving Changes...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5 text-white" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
