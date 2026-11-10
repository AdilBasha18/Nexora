import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../../services/api';
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
  Cpu,
  ChevronRight
} from 'lucide-react';

export default function TakeAssessmentPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // MCQ: { [qId]: optionIdx }
  const [codeAnswers, setCodeAnswers] = useState({}); // Code: { [qId]: codeString }
  const [runResults, setRunResults] = useState({}); // { [qId]: resultObj }
  const [runningCode, setRunningCode] = useState(null);
  const [selectedTestTabs, setSelectedTestTabs] = useState({}); // { [qId]: tabIdx }
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showSubmitModal, setShowSubmitModal] = useState(false);

  useEffect(() => {
    async function loadAssessment() {
      try {
        const data = await api.getAssessmentForTaking(id);
        setAssessment(data);
        setTimeLeft((data.duration_minutes || 45) * 60);

        // Pre-fill code editors with starter code
        const initialCode = {};
        (data.questions || []).forEach(q => {
          if (q.question_type === 'code' && q.starter_code) {
            initialCode[q.id] = q.starter_code;
          }
        });
        setCodeAnswers(initialCode);
      } catch (err) {
        setError("Failed to load assessment. Please ensure you are logged in as a candidate.");
      } finally {
        setLoading(false);
      }
    }
    loadAssessment();
  }, [id]);

  // Countdown Timer
  useEffect(() => {
    if (timeLeft <= 0 || submitting || !assessment) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitAnswers();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, submitting, assessment]);

  const handleSelectOption = (questionId, optionIdx) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionIdx
    }));
  };

  const handleCodeChange = (questionId, code) => {
    setCodeAnswers(prev => ({
      ...prev,
      [questionId]: code
    }));
  };

  const handleResetStarterCode = (question) => {
    if (!question || !question.starter_code) return;
    if (window.confirm("Reset your solution back to the original starter code? Any current edits will be lost.")) {
      setCodeAnswers(prev => ({
        ...prev,
        [question.id]: question.starter_code
      }));
    }
  };

  const handleRunCode = async (question) => {
    const code = codeAnswers[question.id] || question.starter_code || '';
    if (!code.trim()) {
      alert("Please write your solution before running.");
      return;
    }
    setRunningCode(question.id);
    try {
      const result = await api.runCode({
        question_id: question.id,
        code: code,
        language: question.language || 'python',
        function_name: question.function_name || 'solution'
      });
      setRunResults(prev => ({
        ...prev,
        [question.id]: result
      }));
      // Default to first test tab
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

  const handleSubmitAnswers = async () => {
    if (submitting) return;
    setSubmitting(true);
    setShowSubmitModal(false);
    try {
      const res = await api.submitAssessment({
        assessment_id: Number(id),
        answers: selectedAnswers,
        code_answers: codeAnswers
      });
      navigate(`/assessments/results/${res.id}`);
    } catch (err) {
      alert("Submission error. Please try again.");
      setSubmitting(false);
    }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-teal-400" />
        <p className="text-sm font-mono text-slate-400">Loading Assessment Environment & Sandbox...</p>
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
            className="inline-flex items-center px-4 py-2 rounded-xl bg-navy-900 text-white text-xs font-bold hover:bg-slate-800 transition"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Return to Assessments
          </Link>
        </div>
      </div>
    );
  }

  const questions = assessment.questions || [];
  const currentQ = questions[currentIdx] || null;
  const isCodeQ = currentQ?.question_type === 'code';

  // Answered counter
  const mcqAnsweredCount = Object.keys(selectedAnswers).length;
  const codeAnsweredCount = questions
    .filter(q => q.question_type === 'code')
    .filter(q => (codeAnswers[q.id] || '').trim().length > 0 && codeAnswers[q.id] !== q.starter_code)
    .length;
  const totalAnswered = mcqAnsweredCount + codeAnsweredCount;

  // Sandbox results for active question
  const activeRunResult = currentQ ? runResults[currentQ.id] : null;
  const activeTests = activeRunResult?.tests || activeRunResult?.test_results || currentQ?.sample_test_cases || [];
  const activeTabIdx = (currentQ && selectedTestTabs[currentQ.id] !== undefined) ? selectedTestTabs[currentQ.id] : 0;
  const currentTestDetail = activeTests[activeTabIdx] || null;

  // Language configuration helper
  const getLanguageMeta = (lang) => {
    const l = (lang || 'python').toLowerCase();
    if (l === 'javascript' || l === 'js') {
      return { name: 'JavaScript (Node.js 24 Sandbox)', icon: FileCode, ext: 'solution.js', color: 'text-amber-400' };
    }
    if (l === 'sql' || l === 'sqlite') {
      return { name: 'SQL (SQLite In-Memory Engine)', icon: Database, ext: 'query.sql', color: 'text-blue-400' };
    }
    return { name: 'Python (Python 3.12 Sandbox)', icon: Terminal, ext: 'solution.py', color: 'text-emerald-400' };
  };

  const langMeta = getLanguageMeta(currentQ?.language);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* 1. TOP NAV BAR: Header, Timer & Controls */}
      <header className="h-16 bg-slate-900 border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between shrink-0 sticky top-0 z-30">
        <div className="flex items-center space-x-3">
          <Link
            to="/assessments"
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            title="Exit Assessment"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-teal-400 bg-teal-950/70 border border-teal-800/60 px-2 py-0.5 rounded-md">
                {assessment.category_name}
              </span>
              <span className="text-xs text-slate-400 hidden sm:inline">• Passing: {assessment.passing_score}%</span>
            </div>
            <h1 className="text-sm sm:text-base font-bold text-white tracking-tight truncate max-w-xs sm:max-w-md">
              {assessment.title}
            </h1>
          </div>
        </div>

        {/* Center: Live Countdown Timer */}
        <div className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl font-mono text-xs sm:text-sm font-bold border shadow-inner ${
          timeLeft < 180 
            ? 'bg-rose-950/60 border-rose-600 text-rose-300 animate-pulse' 
            : 'bg-slate-800/90 border-slate-700 text-slate-200'
        }`}>
          <Clock className="w-3.5 h-3.5 text-teal-400 shrink-0" />
          <span>{formatTime(timeLeft)}</span>
        </div>

        {/* Right: Progress & Submit Button */}
        <div className="flex items-center space-x-3">
          <div className="text-right hidden md:block">
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">Progress</span>
            <span className="text-xs font-semibold text-slate-200">{totalAnswered} / {questions.length} Answered</span>
          </div>
          <button
            type="button"
            disabled={submitting}
            onClick={() => setShowSubmitModal(true)}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white text-xs font-bold shadow-md transition disabled:opacity-50"
          >
            <Check className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Submit Assessment</span>
            <span className="sm:hidden">Submit</span>
          </button>
        </div>
      </header>

      {/* 2. QUESTION NAVIGATOR BAR: 1-10 Tabs with Badges */}
      <div className="bg-slate-900/60 border-b border-slate-800 px-4 sm:px-6 py-2.5 flex items-center overflow-x-auto space-x-2 scrollbar-thin">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1 hidden sm:inline">
          Questions:
        </span>
        {questions.map((q, idx) => {
          const isCurrent = idx === currentIdx;
          const isCode = q.question_type === 'code';
          const isAnswered = isCode 
            ? ((codeAnswers[q.id] || '').trim().length > 0 && codeAnswers[q.id] !== q.starter_code)
            : selectedAnswers[q.id] !== undefined;

          let btnClass = "border-slate-800 bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-slate-200";
          if (isCurrent) {
            btnClass = "border-teal-500 bg-teal-950/80 text-white font-bold ring-2 ring-teal-500/30";
          } else if (isAnswered) {
            btnClass = "border-emerald-700/60 bg-emerald-950/30 text-emerald-300 font-semibold";
          }

          return (
            <button
              key={q.id || idx}
              type="button"
              onClick={() => setCurrentIdx(idx)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs transition shrink-0 ${btnClass}`}
            >
              <span className="font-mono">{idx + 1}</span>
              <span className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded uppercase ${
                isCode ? 'bg-purple-900/60 text-purple-300' : 'bg-blue-900/60 text-blue-300'
              }`}>
                {isCode ? 'Code' : 'MCQ'}
              </span>
              {isAnswered && <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />}
            </button>
          );
        })}
      </div>

      {/* 3. MAIN WORKSPACE */}
      <main className="flex-1 p-4 sm:p-6 flex flex-col justify-between overflow-y-auto">
        {currentQ && !isCodeQ ? (
          /* ================================================================ */
          /* MCQ QUESTION VIEW */
          /* ================================================================ */
          <div className="max-w-3xl mx-auto w-full space-y-6 my-auto py-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-teal-400 uppercase tracking-widest flex items-center">
                  <HelpCircle className="w-4 h-4 mr-1.5 text-teal-400" />
                  Multiple Choice Question #{currentIdx + 1}
                </span>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 border border-slate-700 uppercase">
                  {currentQ.difficulty || 'Standard'} • 10 Marks
                </span>
              </div>

              <div className="space-y-3">
                {currentQ.title && (
                  <h2 className="text-lg font-bold text-white tracking-tight">
                    {currentQ.title}
                  </h2>
                )}
                <div className="text-sm sm:text-base text-slate-200 leading-relaxed font-normal whitespace-pre-line">
                  {currentQ.question_text}
                </div>
              </div>

              {/* Options list */}
              <div className="space-y-3 pt-2">
                {(currentQ.options || []).map((option, optIdx) => {
                  const isSelected = selectedAnswers[currentQ.id] === optIdx;
                  const optionLetters = ['A', 'B', 'C', 'D', 'E', 'F'];
                  return (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => handleSelectOption(currentQ.id, optIdx)}
                      className={`w-full text-left p-4 rounded-2xl border transition flex items-center justify-between text-xs sm:text-sm group ${
                        isSelected
                          ? 'border-teal-500 bg-teal-950/40 text-white font-semibold ring-1 ring-teal-500/40 shadow-inner'
                          : 'border-slate-800 bg-slate-950/60 hover:bg-slate-800/80 hover:border-slate-700 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center space-x-3.5">
                        <span className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 transition ${
                          isSelected 
                            ? 'bg-teal-500 text-slate-950' 
                            : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700'
                        }`}>
                          {optionLetters[optIdx] || optIdx + 1}
                        </span>
                        <span className="leading-snug">{option}</span>
                      </div>
                      <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ml-3 ${
                        isSelected ? 'border-teal-400 bg-teal-500 text-slate-950' : 'border-slate-700'
                      }`}>
                        {isSelected && <span className="w-2 h-2 rounded-full bg-slate-950"></span>}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="text-[11px] text-slate-500 flex items-center justify-end space-x-1.5 pt-2 border-t border-slate-800/60">
                <span>Select one answer. Answers can be changed anytime before submission.</span>
              </div>
            </div>
          </div>
        ) : currentQ && isCodeQ ? (
          /* ================================================================ */
          /* LEETCODE / HACKERRANK SPLIT WORKSPACE */
          /* ================================================================ */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 w-full max-w-7xl mx-auto items-start">
            
            {/* LEFT PANE: Problem Description, Input/Output, Constraints & Examples */}
            <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-6 max-h-[calc(100vh-170px)] overflow-y-auto shadow-xl scrollbar-thin">
              <div className="space-y-2">
                <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800 flex items-center">
                    <Code2 className="w-3 h-3 mr-1" /> Coding Challenge
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                    currentQ.difficulty === 'Hard' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                    currentQ.difficulty === 'Medium' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                    'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  }`}>
                    {currentQ.difficulty || 'Medium'}
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-md">
                    10 Marks
                  </span>
                </div>

                <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                  {currentQ.title || `Challenge #${currentIdx + 1}`}
                </h2>
              </div>

              {/* Target function badge */}
              {currentQ.function_name && currentQ.function_name !== 'query' && (
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-mono">Target Function:</span>
                  <code className="text-teal-300 font-bold bg-slate-900 px-2 py-0.5 rounded border border-slate-800 font-mono">
                    def {currentQ.function_name}(...)
                  </code>
                </div>
              )}

              {/* Problem Description */}
              <div className="text-xs sm:text-sm text-slate-200 leading-relaxed space-y-2 whitespace-pre-line font-medium">
                {currentQ.question_text}
              </div>

              {/* Input & Output Specifications */}
              {(currentQ.input_format || currentQ.output_format) && (
                <div className="space-y-3 pt-2">
                  {currentQ.input_format && (
                    <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Input Format</span>
                      <p className="text-xs text-slate-300 font-mono">{currentQ.input_format}</p>
                    </div>
                  )}
                  {currentQ.output_format && (
                    <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-1">
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Output Format</span>
                      <p className="text-xs text-slate-300 font-mono">{currentQ.output_format}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Constraints */}
              {currentQ.constraints && (
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Constraints</span>
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-teal-300/90">
                    {currentQ.constraints}
                  </div>
                </div>
              )}

              {/* Sample Examples */}
              {currentQ.examples && currentQ.examples.length > 0 && (
                <div className="space-y-3 pt-2">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Examples</span>
                  {currentQ.examples.map((ex, exIdx) => (
                    <div key={exIdx} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs font-mono">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Example {exIdx + 1}:</span>
                      <div>
                        <span className="text-slate-400">Input: </span>
                        <span className="text-slate-200">{ex.input}</span>
                      </div>
                      <div>
                        <span className="text-slate-400">Output: </span>
                        <span className="text-emerald-400 font-bold">{ex.output}</span>
                      </div>
                      {ex.explanation && (
                        <div className="text-[11px] text-slate-400 font-sans pt-1 border-t border-slate-800/60">
                          <strong>Explanation:</strong> {ex.explanation}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT PANE: Code Editor & Live Test Console */}
            <div className="lg:col-span-7 flex flex-col space-y-4">
              
              {/* Code Editor Box */}
              <div className="rounded-3xl border border-slate-800 bg-slate-950 shadow-2xl overflow-hidden flex flex-col">
                
                {/* Editor Header */}
                <div className="bg-slate-900 px-4 py-2.5 flex items-center justify-between border-b border-slate-800">
                  <div className="flex items-center space-x-2">
                    <langMeta.icon className={`w-4 h-4 ${langMeta.color}`} />
                    <span className="text-xs font-mono text-slate-300 font-semibold">
                      {langMeta.ext}
                    </span>
                    <span className="text-[10px] text-slate-500 hidden sm:inline">
                      ({langMeta.name})
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => handleResetStarterCode(currentQ)}
                      className="px-2.5 py-1.5 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold transition flex items-center space-x-1"
                      title="Reset starter template"
                    >
                      <RotateCcw className="w-3 h-3 mr-1 text-slate-400" />
                      <span>Reset Code</span>
                    </button>

                    <button
                      type="button"
                      disabled={runningCode === currentQ.id}
                      onClick={() => handleRunCode(currentQ)}
                      className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs transition shadow-md flex items-center space-x-1.5 disabled:opacity-50"
                    >
                      {runningCode === currentQ.id ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />
                          <span>Running Sandbox...</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>Run Code</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Textarea Code Editor */}
                <textarea
                  value={codeAnswers[currentQ.id] !== undefined ? codeAnswers[currentQ.id] : (currentQ.starter_code || '')}
                  onChange={(e) => handleCodeChange(currentQ.id, e.target.value)}
                  rows={14}
                  spellCheck={false}
                  placeholder={`// Write your ${currentQ.language || 'code'} solution here...`}
                  className="w-full p-4 bg-slate-950 text-emerald-300 font-mono text-xs sm:text-[13px] leading-relaxed outline-none border-none resize-y selection:bg-teal-900/60"
                />
              </div>

              {/* Execution / Test Console Panel */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-5 space-y-3.5 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <div className="flex items-center space-x-2">
                    <Terminal className="w-4 h-4 text-teal-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-white">
                      Test Cases & Sandbox Console
                    </span>
                  </div>

                  {activeRunResult && (
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] text-slate-400 font-mono">
                        {activeRunResult.elapsed_ms !== undefined && `${activeRunResult.elapsed_ms}ms`}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        activeRunResult.all_passed 
                          ? 'bg-emerald-500 text-slate-950 font-black' 
                          : 'bg-rose-500 text-white font-bold'
                      }`}>
                        {activeRunResult.all_passed ? 'All Passed' : 'Some Tests Failed'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Error Banner */}
                {activeRunResult?.error && (
                  <div className="p-3 rounded-2xl bg-rose-950/60 border border-rose-600/40 text-rose-300 text-xs font-mono whitespace-pre-wrap">
                    <strong className="text-rose-200">Execution Error:</strong> {activeRunResult.error}
                  </div>
                )}

                {/* Test Case Tab Selectors */}
                {activeTests.length > 0 && (
                  <div className="flex items-center space-x-2 overflow-x-auto pb-1">
                    {activeTests.map((t, tIdx) => {
                      const isSelectedTab = activeTabIdx === tIdx;
                      const hasResult = t.passed !== undefined;
                      return (
                        <button
                          key={tIdx}
                          type="button"
                          onClick={() => setSelectedTestTabs(prev => ({ ...prev, [currentQ.id]: tIdx }))}
                          className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold transition flex items-center space-x-1.5 shrink-0 ${
                            isSelectedTab 
                              ? 'bg-slate-800 border-teal-500 text-white shadow-sm ring-1 ring-teal-500/30' 
                              : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {hasResult && (
                            t.passed 
                              ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              : <XSquare className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                          )}
                          <span>Case {tIdx + 1}</span>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Active Test Case Details */}
                {currentTestDetail ? (
                  <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs font-mono">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500 uppercase font-bold">Input:</span>
                      {currentTestDetail.passed !== undefined && (
                        <span className={`font-bold ${currentTestDetail.passed ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {currentTestDetail.passed ? '✓ PASSED' : '✗ FAILED'}
                        </span>
                      )}
                    </div>
                    <div className="p-2 rounded-xl bg-slate-900 border border-slate-800/80 text-slate-200">
                      <code>{JSON.stringify(currentTestDetail.input || currentTestDetail.inputs || 'Default state')}</code>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Expected Output:</span>
                        <div className="p-2 rounded-xl bg-slate-900 border border-slate-800/80 text-emerald-300 font-bold">
                          <code>{JSON.stringify(currentTestDetail.expected)}</code>
                        </div>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-500 uppercase font-bold block mb-1">Actual Sandbox Output:</span>
                        <div className={`p-2 rounded-xl bg-slate-900 border ${
                          currentTestDetail.passed ? 'border-emerald-800/80 text-emerald-300' : 
                          currentTestDetail.actual !== undefined ? 'border-rose-800/80 text-rose-300 font-bold' : 
                          'border-slate-800/80 text-slate-500'
                        }`}>
                          <code>
                            {currentTestDetail.actual !== undefined 
                              ? JSON.stringify(currentTestDetail.actual) 
                              : (activeRunResult ? 'None' : 'Click "Run Code" to evaluate')}
                          </code>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 text-center text-xs text-slate-500 italic">
                    Click "Run Code" above to execute this solution in the secure sandbox.
                  </div>
                )}

              </div>
            </div>

          </div>
        ) : null}

        {/* 4. BOTTOM NAVIGATION BAR */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between max-w-7xl mx-auto w-full">
          <button
            type="button"
            disabled={currentIdx === 0}
            onClick={() => setCurrentIdx(prev => prev - 1)}
            className="px-4 py-2 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white font-semibold text-xs disabled:opacity-30 transition flex items-center"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Previous Question
          </button>

          <span className="text-xs text-slate-400 font-medium hidden sm:inline">
            Question {currentIdx + 1} of {questions.length} ({Math.round(((currentIdx + 1) / questions.length) * 100)}% viewed)
          </span>

          <div className="flex items-center space-x-3">
            {currentIdx < questions.length - 1 ? (
              <button
                type="button"
                onClick={() => setCurrentIdx(prev => prev + 1)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs shadow transition flex items-center"
              >
                Next Question <ArrowRight className="w-4 h-4 ml-1.5" />
              </button>
            ) : (
              <button
                type="button"
                disabled={submitting}
                onClick={() => setShowSubmitModal(true)}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-bold text-xs shadow-lg transition flex items-center disabled:opacity-50"
              >
                {submitting ? 'Grading Sandbox Submissions...' : 'Review & Submit'}
              </button>
            )}
          </div>
        </div>
      </main>

      {/* SUBMISSION CONFIRMATION MODAL */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-6 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-teal-950 text-teal-400 border border-teal-800/80 flex items-center justify-center mx-auto">
              <Award className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-lg font-bold text-white tracking-tight">Submit Your Assessment?</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                You have answered <strong className="text-white">{totalAnswered} of {questions.length} questions</strong>.
                Once submitted, your MCQs and coding solutions will be graded in real-time in the secure execution sandbox.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-2">
              <div className="flex justify-between text-slate-400">
                <span>MCQs Answered:</span>
                <span className="text-white font-bold">{mcqAnsweredCount} / 5</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Coding Challenges Solved:</span>
                <span className="text-white font-bold">{codeAnsweredCount} / 5</span>
              </div>
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <button
                type="button"
                disabled={submitting}
                onClick={() => setShowSubmitModal(false)}
                className="flex-1 py-2.5 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold transition"
              >
                Keep Working
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={handleSubmitAnswers}
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white text-xs font-bold shadow-md transition flex items-center justify-center space-x-1.5"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Grading...</span>
                  </>
                ) : (
                  <span>Yes, Submit</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
