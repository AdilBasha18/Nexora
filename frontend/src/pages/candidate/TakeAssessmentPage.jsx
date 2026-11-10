import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { 
  Clock, 
  AlertCircle, 
  CheckCircle, 
  ArrowRight, 
  ArrowLeft, 
  Award,
  HelpCircle,
  Terminal,
  Play,
  CheckSquare,
  XSquare,
  Loader2
} from 'lucide-react';

export default function TakeAssessmentPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // MCQ: { [qId]: optionIdx }
  const [codeAnswers, setCodeAnswers] = useState({}); // Code: { [qId]: codeString }
  const [runResults, setRunResults] = useState({}); // { [qId]: {success, output, error, test_results, all_passed} }
  const [runningCode, setRunningCode] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0); // seconds
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadAssessment() {
      try {
        const data = await api.getAssessmentForTaking(id);
        setAssessment(data);
        setTimeLeft(data.duration_minutes * 60);

        // Pre-fill code editors with starter code
        const initialCode = {};
        (data.questions || []).forEach(q => {
          if (q.question_type === 'code' && q.starter_code) {
            initialCode[q.id] = q.starter_code;
          }
        });
        setCodeAnswers(initialCode);
      } catch (err) {
        setError("Failed to load assessment. Please ensure you are logged in.");
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

  const handleRunCode = async (questionId) => {
    const code = codeAnswers[questionId] || '';
    if (!code.trim()) {
      alert("Please write some code before running.");
      return;
    }
    setRunningCode(questionId);
    try {
      const result = await api.runCode({
        question_id: questionId,
        code: code
      });
      setRunResults(prev => ({
        ...prev,
        [questionId]: result
      }));
    } catch (err) {
      setRunResults(prev => ({
        ...prev,
        [questionId]: {
          success: false,
          error: err.data?.error || "Failed to execute code in sandbox. Please try again."
        }
      }));
    } finally {
      setRunningCode(null);
    }
  };

  const handleSubmitAnswers = async () => {
    if (submitting) return;
    setSubmitting(true);
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

  const renderFormattedText = (text) => {
    if (!text) return null;
    const codeBlockRegex = /```([a-zA-Z]*)\n([\s\S]*?)```/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push({ type: 'text', content: text.substring(lastIndex, match.index) });
      }
      parts.push({ type: 'code', lang: match[1] || 'code', content: match[2].trim() });
      lastIndex = match.index + match[0].length;
    }
    if (lastIndex < text.length) {
      parts.push({ type: 'text', content: text.substring(lastIndex) });
    }

    if (parts.length === 0) {
      return <p className="whitespace-pre-line">{text}</p>;
    }

    return (
      <div className="space-y-3">
        {parts.map((p, idx) => {
          if (p.type === 'code') {
            return (
              <div key={idx} className="rounded-2xl bg-slate-900 text-slate-100 p-4 font-mono text-xs overflow-x-auto shadow-inner border border-slate-800">
                <div className="flex items-center justify-between text-[10px] text-slate-400 border-b border-slate-800 pb-2 mb-2 font-sans uppercase">
                  <span>{p.lang || 'Code Snippet'}</span>
                  <span>Sandbox Verified</span>
                </div>
                <pre className="leading-relaxed"><code>{p.content}</code></pre>
              </div>
            );
          }
          return <p key={idx} className="whitespace-pre-line leading-relaxed text-slate-800 font-medium">{p.content.replace(/^###\s+/gm, '')}</p>;
        })}
      </div>
    );
  };

  if (loading) {
    return <div className="p-16 text-center text-xs text-slate-500">Loading assessment questions...</div>;
  }

  if (error || !assessment) {
    return (
      <div className="p-8 max-w-xl mx-auto text-center space-y-4">
        <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
        <h2 className="text-base font-bold text-slate-800">{error || "Assessment unavailable"}</h2>
      </div>
    );
  }

  const questions = assessment.questions || [];
  const currentQ = questions[currentIdx];
  const isCodeQ = currentQ?.question_type === 'code';
  
  // Count answered MCQs + code questions that have content
  const mcqAnswered = Object.keys(selectedAnswers).length;
  const codeAnswered = Object.keys(codeAnswers).filter(k => (codeAnswers[k] || '').trim().length > 0).length;
  const answeredCount = mcqAnswered + codeAnswered;
  const runResult = currentQ ? runResults[currentQ.id] : null;

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-8 flex flex-col justify-between max-w-4xl mx-auto">
      
      {/* Top Bar: Assessment Title & Timer */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between mb-6">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
            {assessment.category_name}
          </span>
          <h1 className="text-base sm:text-lg font-bold text-navy-900 mt-1">
            {assessment.title}
          </h1>
        </div>

        {/* Live Timer Pill */}
        <div className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-mono text-sm font-bold shadow-sm ${
          timeLeft < 120 ? 'bg-red-50 text-red-600 border border-red-200 animate-pulse' : 'bg-slate-100 text-slate-800'
        }`}>
          <Clock className="w-4 h-4 text-slate-500" />
          <span>{formatTime(timeLeft)}</span>
        </div>
      </div>

      {/* Question Tracker Progress */}
      <div className="mb-6 space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
          <span>Question {currentIdx + 1} of {questions.length}</span>
          <div className="flex items-center space-x-2">
            {isCodeQ && (
              <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 text-[10px] font-bold flex items-center">
                <Terminal className="w-3 h-3 mr-1" /> Coding Sandbox Challenge
              </span>
            )}
            <span>{answeredCount} Answered ({Math.round((answeredCount / Math.max(1, questions.length)) * 100)}%)</span>
          </div>
        </div>
        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
          <div 
            className="bg-blue-600 h-1.5 transition-all duration-300"
            style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Question Box */}
      {currentQ ? (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 flex-1">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Question #{currentIdx + 1}
              </span>
              {isCodeQ && (
                <span className="text-[11px] font-semibold text-slate-500">
                  Target Function: <code className="bg-slate-100 px-1.5 py-0.5 rounded text-blue-600 font-mono font-bold">{currentQ.function_name || 'solution'}</code>
                </span>
              )}
            </div>
            <div className="text-base font-bold text-navy-900 leading-snug">
              {renderFormattedText(currentQ.question_text)}
            </div>
          </div>

          {isCodeQ ? (
            /* Code Challenge: Sandbox Editor & Run Console */
            <div className="space-y-4 pt-2">
              <div className="rounded-2xl border border-slate-700 overflow-hidden shadow-inner bg-slate-950">
                <div className="bg-slate-900 px-4 py-2.5 flex items-center justify-between border-b border-slate-800">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                    <span className="ml-3 text-xs text-slate-300 font-mono flex items-center">
                      <Terminal className="w-3.5 h-3.5 mr-1 text-slate-400" />
                      solution.py (Python 3.12 Sandbox)
                    </span>
                  </div>

                  <button
                    type="button"
                    disabled={runningCode === currentQ.id}
                    onClick={() => handleRunCode(currentQ.id)}
                    className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm disabled:opacity-50"
                  >
                    {runningCode === currentQ.id ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" />
                        <span>Running Sandbox...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Run & Test Code</span>
                      </>
                    )}
                  </button>
                </div>

                <textarea
                  value={codeAnswers[currentQ.id] !== undefined ? codeAnswers[currentQ.id] : (currentQ.starter_code || '')}
                  onChange={(e) => handleCodeChange(currentQ.id, e.target.value)}
                  rows={10}
                  spellCheck={false}
                  placeholder="# Write your Python implementation here..."
                  className="w-full p-4 bg-slate-950 text-emerald-300 font-mono text-xs leading-relaxed outline-none border-none resize-y selection:bg-slate-700"
                />
              </div>

              {/* Execution / Test Results Output Panel */}
              {runResult && (
                <div className={`p-4 rounded-2xl border text-xs font-mono space-y-3 ${
                  runResult.all_passed 
                    ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-900' 
                    : 'bg-slate-900 border-slate-700 text-slate-100'
                }`}>
                  <div className="flex items-center justify-between border-b border-slate-700/60 pb-2">
                    <span className="font-bold flex items-center">
                      <Terminal className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                      Sandbox Test Results
                    </span>
                    {runResult.test_results && (
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        runResult.all_passed ? 'bg-emerald-500 text-slate-950' : 'bg-rose-500/80 text-white'
                      }`}>
                        {runResult.test_results.filter(t => t.passed).length} / {runResult.test_results.length} Tests Passed
                      </span>
                    )}
                  </div>

                  {runResult.error && (
                    <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 whitespace-pre-wrap">
                      <strong>Runtime Error:</strong> {runResult.error}
                    </div>
                  )}

                  {runResult.output && (
                    <div className="p-2.5 rounded-xl bg-slate-950/80 text-slate-300 whitespace-pre-wrap">
                      <span className="text-[10px] text-slate-500 block uppercase">Standard Output:</span>
                      {runResult.output}
                    </div>
                  )}

                  {runResult.test_results && runResult.test_results.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      {runResult.test_results.map((t, ti) => (
                        <div key={ti} className={`p-2.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                          t.passed 
                            ? 'bg-emerald-900/30 border-emerald-500/30 text-emerald-200' 
                            : 'bg-rose-900/30 border-rose-500/30 text-rose-200'
                        }`}>
                          <div className="flex items-center space-x-2">
                            {t.passed ? (
                              <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                            ) : (
                              <XSquare className="w-4 h-4 text-rose-400 shrink-0" />
                            )}
                            <span className="font-bold">Test #{ti + 1}:</span>
                            <span className="text-slate-300">Inputs: {JSON.stringify(t.input)}</span>
                          </div>
                          <div className="text-[11px] space-x-2">
                            <span className="text-slate-400">Expected: {JSON.stringify(t.expected)}</span>
                            {!t.passed && t.actual !== undefined && (
                              <span className="text-rose-300 font-bold">| Actual: {JSON.stringify(t.actual)}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            /* Standard MCQ Options */
            <div className="space-y-3 pt-2">
              {(currentQ.options || []).map((option, idx) => {
                const isSelected = selectedAnswers[currentQ.id] === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectOption(currentQ.id, idx)}
                    className={`w-full text-left p-4 rounded-2xl border transition flex items-center justify-between text-xs ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/70 text-blue-900 font-bold shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 font-medium'
                    }`}
                  >
                    <span className="flex-1">{option}</span>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ml-3 ${
                      isSelected ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300'
                    }`}>
                      {isSelected && <span className="w-2 h-2 rounded-full bg-white"></span>}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      ) : null}

      {/* Navigation & Submission Bar */}
      <div className="mt-6 flex items-center justify-between pt-4 border-t border-slate-200">
        <button
          type="button"
          disabled={currentIdx === 0}
          onClick={() => setCurrentIdx(prev => prev - 1)}
          className="px-4 py-2 rounded-xl border border-slate-200 font-semibold text-xs text-slate-700 hover:bg-slate-100 disabled:opacity-40 transition flex items-center"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Previous
        </button>

        <div className="flex items-center space-x-2">
          {currentIdx < questions.length - 1 ? (
            <button
              type="button"
              onClick={() => setCurrentIdx(prev => prev + 1)}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-semibold text-xs shadow transition flex items-center"
            >
              Next <ArrowRight className="w-4 h-4 ml-1.5" />
            </button>
          ) : (
            <button
              type="button"
              disabled={submitting}
              onClick={handleSubmitAnswers}
              className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition flex items-center disabled:opacity-50"
            >
              {submitting ? 'Grading Answers...' : 'Submit Assessment'}
            </button>
          )}
        </div>
      </div>

    </div>
  );
}
