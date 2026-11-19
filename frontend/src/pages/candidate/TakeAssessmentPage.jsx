import React, { useState, useEffect, useRef, Suspense, lazy } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../../services/api';

const CodingEditorWorkspace = lazy(() => import('./CodingEditorWorkspace'));
import { 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Award,
  HelpCircle,
  Terminal,
  Play,
  CheckSquare,
  XSquare,
  Loader2,
  RotateCcw,
  Check,
  Code2,
  FileCode,
  Database,
  Lock,
  Unlock,
  Send,
  Sparkles,
  SkipForward,
  AlertTriangle
} from 'lucide-react';

export default function TakeAssessmentPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentIdx, setCurrentIdx] = useState(0);

  // User responses
  const [selectedAnswers, setSelectedAnswers] = useState({}); // MCQ: { [qId]: optionIdx }
  
  // Dual-language code answers: { [qId]: { python: string, java: string } }
  const [codeAnswersByLang, setCodeAnswersByLang] = useState({});
  // Selected language per question: { [qId]: 'python' | 'java' }
  const [selectedLanguages, setSelectedLanguages] = useState({});

  // Solved / completed question tracking
  const [completedQuestionIds, setCompletedQuestionIds] = useState(new Set());

  // Execution & Testing states
  const [runResults, setRunResults] = useState({}); // { [qId]: resultObj }
  const [runningCode, setRunningCode] = useState(null); // qId being executed
  const [submittingCode, setSubmittingCode] = useState(null); // qId being submitted
  const [selectedTestTabs, setSelectedTestTabs] = useState({}); // { [qId]: tabIdx }

  // Countdown Timer (Strictly 60 Minutes & Non-Resetting)
  const [timeLeft, setTimeLeft] = useState(3600);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  const timerKey = `nexora_assessment_timer_${id}`;

  useEffect(() => {
    async function loadAssessment() {
      try {
        const data = await api.getAssessmentForTaking(id);
        setAssessment(data);

        // 60-Minute Persistent Timer initialization
        const durationSecs = 60 * 60; // strictly 60 minutes
        const storedEnd = localStorage.getItem(timerKey);
        let remaining = durationSecs;

        if (storedEnd) {
          const endTime = parseInt(storedEnd, 10);
          const diff = Math.floor((endTime - Date.now()) / 1000);
          if (diff > 0) {
            remaining = Math.min(diff, durationSecs);
          } else {
            remaining = 0;
          }
        } else {
          const newEndTime = Date.now() + durationSecs * 1000;
          localStorage.setItem(timerKey, newEndTime.toString());
        }

        setTimeLeft(remaining);

        // Pre-fill dual-language code templates per coding question
        const initialCodeByLang = {};
        const initialLangMap = {};

        (data.questions || []).forEach(q => {
          if (q.question_type === 'code') {
            const pyDefault = q.starter_code || `def ${q.function_name || 'solution'}(*args):\n    # Write your Python solution here\n    pass\n`;
            const javaDefault = q.starter_code_java || `import java.util.*;\n\nclass Solution {\n    public static Object ${q.function_name_java || q.function_name || 'solution'}() {\n        // Write your Java solution here\n        return null;\n    }\n}\n`;

            initialCodeByLang[q.id] = {
              python: pyDefault,
              java: javaDefault
            };
            initialLangMap[q.id] = (q.language && q.language.toLowerCase() === 'java') ? 'java' : 'python';
          }
        });

        setCodeAnswersByLang(initialCodeByLang);
        setSelectedLanguages(initialLangMap);

      } catch (err) {
        setError("Failed to load assessment. Please ensure you are logged in as a candidate.");
      } finally {
        setLoading(false);
      }
    }
    loadAssessment();
  }, [id]);

  // Countdown Timer Tick
  useEffect(() => {
    if (timeLeft <= 0) {
      if (assessment && !submitting) {
        handleSubmitAnswers(true); // Auto-submit when time expires
      }
      return;
    }
    if (submitting || !assessment) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitAnswers(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, submitting, assessment]);

  const questions = assessment?.questions || [];
  const currentQ = questions[currentIdx] || null;
  const isCodeQ = currentQ?.question_type === 'code';

  // Current active language for current coding question
  const currentLang = currentQ ? (selectedLanguages[currentQ.id] || 'python') : 'python';
  const currentCode = currentQ && isCodeQ ? (codeAnswersByLang[currentQ.id]?.[currentLang] || '') : '';

  // Language Switcher Handler (Never erases user code)
  const handleSwitchLanguage = (qId, newLang) => {
    setSelectedLanguages(prev => ({
      ...prev,
      [qId]: newLang
    }));
  };

  // Code editor text change handler (Saves per language)
  const handleCodeChange = (qId, newCode) => {
    setCodeAnswersByLang(prev => ({
      ...prev,
      [qId]: {
        ...(prev[qId] || {}),
        [currentLang]: newCode
      }
    }));
  };

  // Reset starter code for current language only
  const handleResetStarterCode = (question) => {
    if (!question) return;
    if (window.confirm(`Reset your ${currentLang.toUpperCase()} code back to the starter template?`)) {
      const resetTemplate = currentLang === 'java' 
        ? (question.starter_code_java || `import java.util.*;\n\nclass Solution {\n    public static Object ${question.function_name_java || question.function_name || 'solution'}() {\n        return null;\n    }\n}\n`)
        : (question.starter_code || `def ${question.function_name || 'solution'}(*args):\n    pass\n`);

      setCodeAnswersByLang(prev => ({
        ...prev,
        [question.id]: {
          ...(prev[question.id] || {}),
          [currentLang]: resetTemplate
        }
      }));
    }
  };

  // MCQ Selection handler
  const handleSelectOption = (questionId, optionIdx) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionIdx
    }));
    setCompletedQuestionIds(prev => new Set(prev).add(questionId));
  };

  // Skip / Next Question Handler
  const handleSkipOrNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      setShowSubmitModal(true);
    }
  };

  // Action: "Run Code" (Runs against sample test cases)
  const handleRunCode = async (question) => {
    if (!currentCode.trim()) {
      alert("Please write your solution code before running.");
      return;
    }
    setRunningCode(question.id);
    try {
      const fnName = currentLang === 'java' 
        ? (question.function_name_java || question.function_name || 'solution') 
        : (question.function_name || 'solution');

      const result = await api.runCode({
        question_id: question.id,
        code: currentCode,
        language: currentLang,
        function_name: fnName,
        action: 'run'
      });
      setRunResults(prev => ({
        ...prev,
        [question.id]: result
      }));
      setSelectedTestTabs(prev => ({
        ...prev,
        [question.id]: 0
      }));
    } catch (err) {
      setRunResults(prev => ({
        ...prev,
        [question.id]: {
          success: false,
          all_passed: false,
          error: err.data?.error || "Execution error in secure sandbox.",
          tests: []
        }
      }));
    } finally {
      setRunningCode(null);
    }
  };

  // Action: "Submit Code" (Evaluates full test suite)
  const handleSubmitCode = async (question) => {
    if (!currentCode.trim()) {
      alert("Please write your solution code before submitting.");
      return;
    }
    setSubmittingCode(question.id);
    try {
      const fnName = currentLang === 'java' 
        ? (question.function_name_java || question.function_name || 'solution') 
        : (question.function_name || 'solution');

      const result = await api.runCode({
        question_id: question.id,
        code: currentCode,
        language: currentLang,
        function_name: fnName,
        action: 'submit'
      });

      setRunResults(prev => ({
        ...prev,
        [question.id]: result
      }));
      setSelectedTestTabs(prev => ({
        ...prev,
        [question.id]: 0
      }));

      if (result.completed || result.all_passed) {
        setCompletedQuestionIds(prev => new Set(prev).add(question.id));
      }
    } catch (err) {
      setRunResults(prev => ({
        ...prev,
        [question.id]: {
          success: false,
          all_passed: false,
          completed: false,
          error: err.data?.error || "Evaluation failed in sandbox.",
          tests: []
        }
      }));
    } finally {
      setSubmittingCode(null);
    }
  };

  // Final Assessment Submission
  const handleSubmitAnswers = async (isAutoSubmit = false) => {
    if (submitting) return;
    setSubmitting(true);
    setShowSubmitModal(false);

    // Format code answers payload with language information
    const formattedCodeAnswers = {};
    Object.keys(codeAnswersByLang).forEach(qId => {
      const activeL = selectedLanguages[qId] || 'python';
      const c = codeAnswersByLang[qId]?.[activeL] || '';
      formattedCodeAnswers[qId] = {
        code: c,
        language: activeL
      };
    });

    try {
      localStorage.removeItem(timerKey);
      const res = await api.submitAssessment({
        assessment_id: Number(id),
        answers: selectedAnswers,
        code_answers: formattedCodeAnswers
      });
      navigate(`/assessments/results/${res.id}`);
    } catch (err) {
      const errDetail = err.data?.error || err.data?.detail || (typeof err.data === 'object' ? JSON.stringify(err.data) : null) || err.message || "Please check your connection and try again.";
      alert(`Submission error: ${errDetail}`);
      setSubmitting(false);
    }
  };

  const formatTime = (secs) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    if (h > 0) {
      return `${h}:${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
    }
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-800 space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
        <p className="text-sm font-medium text-slate-600">Initializing Assessment Environment (60 Min Session)...</p>
      </div>
    );
  }

  if (error || !assessment) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="bg-white p-8 max-w-md w-full rounded-3xl border border-slate-200 shadow-xl text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
          <h2 className="text-lg font-bold text-slate-900">{error || "Assessment unavailable"}</h2>
          <Link
            to="/assessments"
            className="inline-flex items-center px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Return to Assessments
          </Link>
        </div>
      </div>
    );
  }

  // Question counts
  const answeredMcqCount = Object.keys(selectedAnswers).length;
  const answeredCodingCount = questions.filter(q => q.question_type === 'code' && (codeAnswersByLang[q.id]?.[selectedLanguages[q.id] || 'python'] || '').trim().length > 0).length;
  const totalAnswered = answeredMcqCount + answeredCodingCount;
  const totalQuestions = questions.length;
  const isCurrentAnswered = currentQ ? (
    currentQ.question_type === 'code' 
      ? (codeAnswersByLang[currentQ.id]?.[currentLang] || '').trim().length > 0
      : selectedAnswers[currentQ.id] !== undefined
  ) : false;

  const isCurrentSolved = currentQ ? completedQuestionIds.has(currentQ.id) : false;

  // Sandbox results for active question
  const activeRunResult = currentQ ? runResults[currentQ.id] : null;
  const activeTests = activeRunResult?.tests || currentQ?.sample_test_cases || [];
  const activeTabIdx = (currentQ && selectedTestTabs[currentQ.id] !== undefined) ? selectedTestTabs[currentQ.id] : 0;
  const currentTestDetail = activeTests[activeTabIdx] || null;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans">
      
      {/* ========================================================================= */}
      {/* 1. DEDICATED TOP BAR: Title, Timer (60m), Progress & Submit */}
      {/* ========================================================================= */}
      <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between shrink-0 sticky top-0 z-30 shadow-xs">
        <div className="flex items-center space-x-3">
          <Link
            to="/assessments"
            className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition"
            title="Exit to Assessments"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-md">
                {assessment.category_name}
              </span>
              <span className="text-xs text-slate-400 hidden sm:inline">• 60 Mins • Passing: {assessment.passing_score}%</span>
            </div>
            <h1 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight truncate max-w-xs sm:max-w-md">
              {assessment.title}
            </h1>
          </div>
        </div>

        {/* Center: Live 60-Minute Countdown Timer */}
        <div className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl font-mono text-xs sm:text-sm font-bold border shadow-xs ${
          timeLeft <= 300 
            ? 'bg-rose-50 border-rose-300 text-rose-700 animate-pulse' 
            : 'bg-slate-50 border-slate-200 text-slate-800'
        }`}>
          <Clock className={`w-4 h-4 ${timeLeft <= 300 ? 'text-rose-600' : 'text-teal-600'} shrink-0`} />
          <span>{formatTime(timeLeft)}</span>
          {timeLeft <= 300 && (
            <span className="text-[10px] uppercase font-bold text-rose-600 hidden md:inline ml-1">
              (Ending Soon!)
            </span>
          )}
        </div>

        {/* Right: Progress & Submit */}
        <div className="flex items-center space-x-3">
          <div className="text-right hidden md:block">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Answered</span>
            <span className="text-xs font-semibold text-slate-700">{totalAnswered} of {totalQuestions} Questions</span>
          </div>
          <button
            type="button"
            disabled={submitting}
            onClick={() => setShowSubmitModal(true)}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs transition disabled:opacity-50"
          >
            <Check className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Review & Submit</span>
            <span className="sm:hidden">Submit</span>
          </button>
        </div>
      </header>

      {/* Expiration Warning Banner if < 5 mins */}
      {timeLeft <= 300 && timeLeft > 0 && (
        <div className="bg-rose-600 text-white px-4 py-2 text-xs font-bold flex items-center justify-center space-x-2 animate-in fade-in">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>Warning: Less than 5 minutes remaining. Your assessment will automatically submit when the timer reaches zero.</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. FREELY NAVIGABLE QUESTION BAR: All 10 questions accessible at any time */}
      {/* ========================================================================= */}
      <div className="bg-white/90 backdrop-blur-xs border-b border-slate-200 px-4 sm:px-6 py-2.5 flex items-center justify-between overflow-x-auto gap-2">
        <div className="flex items-center space-x-2 shrink-0">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider shrink-0 mr-1 hidden sm:inline">
            Jump to:
          </span>
          {questions.map((q, idx) => {
            const isCurrent = idx === currentIdx;
            const isCode = q.question_type === 'code';
            const isAnswered = isCode 
              ? (codeAnswersByLang[q.id]?.[selectedLanguages[q.id] || 'python'] || '').trim().length > 0
              : selectedAnswers[q.id] !== undefined;
            const isSolved = completedQuestionIds.has(q.id);

            let btnClass = "border-slate-200 bg-white text-slate-600 hover:bg-slate-50";
            if (isCurrent) {
              btnClass = "border-teal-600 bg-teal-50 text-teal-900 font-bold ring-2 ring-teal-500/30";
            } else if (isSolved) {
              btnClass = "border-emerald-300 bg-emerald-50 text-emerald-800 font-semibold";
            } else if (isAnswered) {
              btnClass = "border-blue-300 bg-blue-50 text-blue-800 font-semibold";
            }

            return (
              <button
                key={q.id || idx}
                type="button"
                onClick={() => setCurrentIdx(idx)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs transition shrink-0 ${btnClass}`}
                title={`Question ${idx + 1} (${isCode ? 'Coding Challenge' : 'MCQ'}) - ${isSolved ? 'Solved' : isAnswered ? 'Answered' : 'Unanswered / Skipped'}`}
              >
                <span className="font-mono">{idx + 1}</span>
                <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                  isCode ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {isCode ? 'Code' : 'MCQ'}
                </span>
                {isSolved ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                ) : isAnswered ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                ) : null}
              </button>
            );
          })}
        </div>

        {/* Current status pill */}
        <div className="shrink-0 text-xs text-slate-500 font-medium hidden lg:flex items-center space-x-2">
          <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-emerald-500 mr-1" /> Solved</span>
          <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-blue-500 mr-1" /> Answered</span>
          <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-slate-300 mr-1" /> Skipped/Pending</span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. MAIN WORKSPACE: MCQ or Coding Challenge */}
      {/* ========================================================================= */}
      <main className="flex-1 p-4 sm:p-6 flex flex-col justify-between overflow-y-auto">
        {currentQ && !isCodeQ ? (
          
          /* MCQ Question Layout */
          <div className="max-w-2xl mx-auto w-full my-auto py-4">
            <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
              
              {/* Question Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <span className="text-xs font-bold text-teal-700 uppercase tracking-wider flex items-center">
                  <HelpCircle className="w-4 h-4 mr-1.5 text-teal-600" />
                  Question {currentIdx + 1} of {questions.length} • Multiple Choice
                </span>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 uppercase">
                  {currentQ.difficulty || 'Standard'} • 10 Marks
                </span>
              </div>

              {/* Question Prompt */}
              <div className="space-y-3">
                {currentQ.title && (
                  <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                    {currentQ.title}
                  </h2>
                )}
                <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-normal whitespace-pre-line">
                  {currentQ.question_text}
                </p>
              </div>

              {/* MCQ Options List */}
              <div className="space-y-3 pt-2">
                {(currentQ.options || []).map((opt, optIdx) => {
                  const isSelected = selectedAnswers[currentQ.id] === optIdx;
                  return (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => handleSelectOption(currentQ.id, optIdx)}
                      className={`w-full text-left p-4 rounded-2xl border transition flex items-start space-x-3 ${
                        isSelected 
                          ? 'border-teal-600 bg-teal-50/80 text-teal-950 font-semibold ring-2 ring-teal-500/30' 
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span className={`w-6 h-6 rounded-xl flex items-center justify-center font-mono text-xs font-bold shrink-0 transition ${
                        isSelected 
                          ? 'bg-teal-600 text-white' 
                          : 'bg-slate-100 text-slate-600 border border-slate-200'
                      }`}>
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      <span className="text-xs sm:text-sm leading-relaxed flex-1 mt-0.5">{opt}</span>
                    </button>
                  );
                })}
              </div>

              {/* Bottom Actions for MCQ */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleSkipOrNext}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition flex items-center space-x-1.5"
                  title="Move to next question without answering"
                >
                  <SkipForward className="w-3.5 h-3.5 text-slate-500" />
                  <span>Skip / Next Question</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (currentIdx < questions.length - 1) {
                      setCurrentIdx(prev => prev + 1);
                    } else {
                      setShowSubmitModal(true);
                    }
                  }}
                  className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs transition flex items-center space-x-1.5"
                >
                  <span>{selectedAnswers[currentQ.id] !== undefined ? 'Next Question' : 'Next Question'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          </div>
        ) : currentQ && isCodeQ ? (
          
          /* Coding Challenge Layout with Python & Java */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 w-full max-w-7xl mx-auto items-start">
            
            {/* LEFT COLUMN: Problem Details */}
            <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 space-y-6 max-h-[calc(100vh-170px)] overflow-y-auto shadow-sm">
              <div className="space-y-2">
                <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 flex items-center">
                    <Code2 className="w-3 h-3 mr-1" /> Coding Challenge
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    currentQ.difficulty === 'Hard' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                    currentQ.difficulty === 'Medium' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                    'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}>
                    {currentQ.difficulty || 'Medium'}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                    10 Marks
                  </span>
                  {isCurrentSolved && (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center">
                      <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" /> Solved
                    </span>
                  )}
                </div>

                <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
                  {currentQ.title || `Challenge #${currentIdx + 1}`}
                </h2>
              </div>

              {/* Target function info */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <span className="text-slate-500 font-mono">Target Function:</span>
                <code className="text-teal-700 font-bold bg-white px-2.5 py-1 rounded-lg border border-slate-200 font-mono">
                  {currentLang === 'java' 
                    ? `${currentQ.function_name_java || currentQ.function_name || 'solution'}(...)` 
                    : `def ${currentQ.function_name || 'solution'}(...)`}
                </code>
              </div>

              {/* Problem Statement */}
              <div className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line font-normal">
                {currentQ.question_text}
              </div>

              {/* Input & Output Specifications */}
              {(currentQ.input_format || currentQ.output_format) && (
                <div className="space-y-3 pt-2">
                  {currentQ.input_format && (
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">Input Format</span>
                      <p className="text-xs text-slate-800 font-mono">{currentQ.input_format}</p>
                    </div>
                  )}
                  {currentQ.output_format && (
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">Output Format</span>
                      <p className="text-xs text-slate-800 font-mono">{currentQ.output_format}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Constraints */}
              {currentQ.constraints && (
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">Constraints</span>
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 font-mono text-[11px] text-teal-800">
                    {currentQ.constraints}
                  </div>
                </div>
              )}

              {/* Sample Examples */}
              {currentQ.examples && currentQ.examples.length > 0 && (
                <div className="space-y-3 pt-2">
                  <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider block">Sample Examples</span>
                  {currentQ.examples.map((ex, exIdx) => (
                    <div key={exIdx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs font-mono">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Example {exIdx + 1}:</span>
                      <div>
                        <span className="text-slate-500">Input: </span>
                        <span className="text-slate-900 font-semibold">{typeof ex.input === 'object' ? JSON.stringify(ex.input) : String(ex.input)}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Output: </span>
                        <span className="text-teal-700 font-bold">{typeof ex.output === 'object' ? JSON.stringify(ex.output) : String(ex.output)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Skip Option at Bottom of Problem Statement */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Can't solve right now? You can skip and revisit later.</span>
                <button
                  type="button"
                  onClick={handleSkipOrNext}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center space-x-1.5 transition"
                >
                  <SkipForward className="w-3.5 h-3.5 text-slate-500" />
                  <span>Skip Coding Challenge</span>
                </button>
              </div>

            </div>

            {/* RIGHT COLUMN: Lazy-Loaded Code Editor Workspace & Sandbox Console */}
            <Suspense fallback={
              <div className="lg:col-span-7 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm flex flex-col items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 text-teal-600 animate-spin mb-3" />
                <p className="text-xs font-bold text-slate-700 uppercase tracking-wide">Loading Coding Sandbox...</p>
                <span className="text-[11px] text-slate-400 mt-1">Initializing Python 3 & Java JDK 17 environments</span>
              </div>
            }>
              <CodingEditorWorkspace
                currentQ={currentQ}
                currentLang={currentLang}
                currentCode={currentCode}
                handleSwitchLanguage={handleSwitchLanguage}
                handleResetStarterCode={handleResetStarterCode}
                handleRunCode={handleRunCode}
                handleSubmitCode={handleSubmitCode}
                handleCodeChange={handleCodeChange}
                runningCode={runningCode}
                submittingCode={submittingCode}
                activeRunResult={activeRunResult}
                activeTests={activeTests}
                activeTabIdx={activeTabIdx}
                setSelectedTestTabs={setSelectedTestTabs}
                currentTestDetail={currentTestDetail}
                currentIdx={currentIdx}
                questionsLength={questions.length}
                onNextQuestion={() => setCurrentIdx(prev => prev + 1)}
              />
            </Suspense>

          </div>
        ) : null}

        {/* ========================================================================= */}
        {/* 4. BOTTOM FOOTER NAVIGATION: Previous, Skip / Next Question, Submit */}
        {/* ========================================================================= */}
        <div className="mt-6 pt-4 border-t border-slate-200 flex items-center justify-between flex-wrap gap-3">
          
          <button
            type="button"
            disabled={currentIdx === 0}
            onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
            className="px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Previous Question
          </button>

          <span className="text-xs text-slate-500 font-medium hidden sm:inline">
            Question {currentIdx + 1} of {questions.length} • {totalAnswered} Answered
          </span>

          <div className="flex items-center space-x-3">
            {/* Clearly Visible Skip / Next Question Option */}
            <button
              type="button"
              onClick={handleSkipOrNext}
              className="px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs shadow-xs transition flex items-center space-x-1.5"
              title="Skip this question immediately and proceed to the next"
            >
              <SkipForward className="w-3.5 h-3.5 text-slate-500" />
              <span>Skip / Next Question</span>
            </button>

            {currentIdx === questions.length - 1 && (
              <button
                type="button"
                disabled={submitting}
                onClick={() => setShowSubmitModal(true)}
                className="px-6 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition flex items-center disabled:opacity-50"
              >
                {submitting ? 'Grading Submissions...' : 'Review & Submit Assessment'}
              </button>
            )}
          </div>
        </div>
      </main>

      {/* ========================================================================= */}
      {/* 5. SUBMISSION CONFIRMATION MODAL */}
      {/* ========================================================================= */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-6 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 border border-teal-200 flex items-center justify-center mx-auto">
              <Award className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">Submit Your Assessment?</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                You have answered <strong className="text-slate-900">{totalAnswered} of {questions.length} questions</strong>.
                {totalQuestions - totalAnswered > 0 && (
                  <span className="text-amber-700 font-semibold block mt-1">
                    {totalQuestions - totalAnswered} question(s) will be submitted as unanswered and receive 0 marks.
                  </span>
                )}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2.5">
              <div className="flex justify-between text-slate-600">
                <span>MCQs Answered:</span>
                <span className="text-slate-900 font-bold">{answeredMcqCount} / 5</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Coding Challenges Solved/Submitted:</span>
                <span className="text-slate-900 font-bold">{answeredCodingCount} / 5</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Time Remaining:</span>
                <span className="text-teal-700 font-mono font-bold">{formatTime(timeLeft)}</span>
              </div>
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <button
                type="button"
                disabled={submitting}
                onClick={() => setShowSubmitModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition"
              >
                Keep Working
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={() => handleSubmitAnswers(false)}
                className="flex-1 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md transition flex items-center justify-center space-x-1.5"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Grading...</span>
                  </>
                ) : (
                  <span>Yes, Submit Assessment</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
