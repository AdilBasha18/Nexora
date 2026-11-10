import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../../services/api';
import { 
  Award, 
  CheckCircle, 
  XCircle, 
  ArrowLeft, 
  RotateCcw, 
  BookOpen, 
  Calendar,
  AlertCircle,
  Terminal,
  CheckSquare,
  XSquare,
  History
} from 'lucide-react';

export default function AssessmentResultPage() {
  const { id } = useParams();
  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAttempt() {
      try {
        const data = await api.getAssessmentAttemptDetail(id);
        setAttempt(data);
      } catch (e) {
        console.error("Failed to load attempt:", e);
      } finally {
        setLoading(false);
      }
    }
    loadAttempt();
  }, [id]);

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
    return <div className="p-16 text-center text-xs text-slate-500">Grading assessment results...</div>;
  }

  if (!attempt) {
    return <div className="p-16 text-center text-xs text-red-600">Assessment result not found.</div>;
  }

  // Support both responses array from DRF serializer and legacy review array
  const reviewItems = attempt.responses || attempt.questions_review || [];

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto space-y-8">
      
      {/* Result Hero Banner */}
      <div className={`p-8 rounded-3xl text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6 ${
        attempt.passed 
          ? 'bg-gradient-to-tr from-emerald-900 via-teal-900 to-navy-900' 
          : 'bg-gradient-to-tr from-slate-900 via-navy-900 to-blue-950'
      }`}>
        <div className="space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/20">
            {attempt.category_name}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {attempt.assessment_title}
          </h1>
          <p className="text-xs text-slate-300">
            Completed on {new Date(attempt.completed_at).toLocaleString()}
          </p>
        </div>

        <div className="text-center sm:text-right bg-white/10 px-6 py-4 rounded-2xl border border-white/10 shrink-0">
          <span className="text-4xl font-extrabold text-white block">
            {attempt.percentage}%
          </span>
          <span className={`text-xs font-bold uppercase tracking-wider block mt-1 ${
            attempt.passed ? 'text-teal-300' : 'text-slate-300'
          }`}>
            {attempt.passed ? 'Passed Benchmark' : 'Below Passing Score'}
          </span>
          <span className="text-[11px] text-slate-300 block mt-0.5">
            {attempt.correct_answers} / {attempt.total_questions} Correct (Req: {attempt.passing_score}%)
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <Link
          to="/assessments"
          className="inline-flex items-center text-xs font-semibold text-slate-600 hover:text-blue-600"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to All Assessments
        </Link>
        <div className="flex items-center space-x-3">
          <Link
            to="/assessments/history"
            className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs shadow-sm flex items-center"
          >
            <History className="w-3.5 h-3.5 mr-1.5 text-slate-500" /> View Attempt History
          </Link>
          <Link
            to={`/assessments/${attempt.assessment}/take`}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm flex items-center"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" /> Retake Assessment
          </Link>
        </div>
      </div>

      {/* Question by Question Detailed Review */}
      <div className="space-y-6">
        <h2 className="text-base font-bold text-navy-900">
          Question Review & Technical Explanations
        </h2>

        <div className="space-y-4">
          {reviewItems.map((item, idx) => {
            const q = item.question || item;
            const isCorrect = item.is_correct !== undefined ? item.is_correct : q.is_correct;
            const isCodeQ = q.question_type === 'code' || (item.test_results && Object.keys(item.test_results).length > 0);
            const testResultsData = item.test_results || {};
            const testList = testResultsData.test_results || [];
            const passedTests = testList.filter(t => t.passed).length;

            return (
              <div 
                key={item.id || idx}
                className={`p-6 rounded-3xl border bg-white shadow-sm space-y-4 ${
                  isCorrect ? 'border-emerald-200' : 'border-rose-200'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start space-x-2 flex-1">
                    <span className="font-bold text-xs text-slate-400 mt-0.5">#{idx + 1}.</span>
                    <div className="text-sm font-bold text-slate-900 leading-snug flex-1">
                      {isCodeQ && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-700 mb-2 mr-2">
                          <Terminal className="w-3 h-3 mr-1" /> Coding Challenge
                        </span>
                      )}
                      {renderFormattedText(q.question_text)}
                    </div>
                  </div>

                  {isCodeQ ? (
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold shrink-0 ${
                      isCorrect ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {isCorrect ? <CheckCircle className="w-3.5 h-3.5 mr-1" /> : <XCircle className="w-3.5 h-3.5 mr-1" />}
                      {testList.length > 0 ? `${passedTests}/${testList.length} Tests Passed` : (isCorrect ? 'Correct' : 'Failed')}
                    </span>
                  ) : (
                    isCorrect ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 shrink-0">
                        <CheckCircle className="w-3 h-3 mr-1" /> Correct
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800 shrink-0">
                        <XCircle className="w-3 h-3 mr-1" /> Incorrect
                      </span>
                    )
                  )}
                </div>

                {isCodeQ ? (
                  /* Coding Question Review: User Code + Sandbox Results */
                  <div className="space-y-3">
                    {item.code_answer ? (
                      <div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                          Your Submitted Python Solution
                        </span>
                        <div className="rounded-2xl bg-slate-950 text-emerald-300 p-4 font-mono text-xs overflow-x-auto border border-slate-800">
                          <pre className="leading-relaxed whitespace-pre-wrap">{item.code_answer}</pre>
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-slate-400 italic">No code submitted for this challenge.</div>
                    )}

                    {testList.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                          Sandbox Test Executions ({passedTests} of {testList.length} passed)
                        </span>
                        {testList.map((t, ti) => (
                          <div 
                            key={ti} 
                            className={`p-2.5 rounded-xl border text-xs font-mono flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                              t.passed 
                                ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900' 
                                : 'bg-rose-50/70 border-rose-200 text-rose-900'
                            }`}
                          >
                            <div className="flex items-center space-x-2">
                              {t.passed ? (
                                <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                              ) : (
                                <XSquare className="w-4 h-4 text-rose-600 shrink-0" />
                              )}
                              <span className="font-bold">Test #{ti + 1}:</span>
                              <span>Inputs: {JSON.stringify(t.input)}</span>
                            </div>
                            <div className="text-[11px] space-x-2">
                              <span className="text-slate-600">Expected: {JSON.stringify(t.expected)}</span>
                              {!t.passed && t.actual !== undefined && (
                                <span className="text-rose-700 font-bold">| Actual: {JSON.stringify(t.actual)}</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {testResultsData.error && (
                      <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-mono text-rose-800">
                        <strong>Runtime / Exception:</strong> {testResultsData.error}
                      </div>
                    )}
                  </div>
                ) : (
                  /* Standard MCQ Option Review */
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {(q.options || []).map((opt, optIdx) => {
                      const isCandidateChoice = item.selected_option_index === optIdx;
                      const isCorrectOption = q.correct_option_index === optIdx;

                      let style = "bg-slate-50 border-slate-200 text-slate-600";
                      if (isCorrectOption) {
                        style = "bg-emerald-50 border-emerald-300 text-emerald-900 font-bold";
                      } else if (isCandidateChoice && !isCorrectOption) {
                        style = "bg-red-50 border-red-300 text-red-800 font-medium";
                      }

                      return (
                        <div key={optIdx} className={`p-3 rounded-xl border flex items-center justify-between ${style}`}>
                          <span>{opt}</span>
                          {isCorrectOption && <span className="text-[10px] text-emerald-700 ml-2">✓ Correct Answer</span>}
                          {isCandidateChoice && !isCorrectOption && <span className="text-[10px] text-red-600 ml-2">Your Answer</span>}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Technical Explanation */}
                {q.explanation && (
                  <div className="p-3.5 bg-blue-50/70 border border-blue-100 rounded-2xl text-xs text-blue-950 space-y-1">
                    <span className="font-bold text-[10px] uppercase text-blue-700 block">
                      Explanation & Rationale:
                    </span>
                    <p className="leading-relaxed">{q.explanation}</p>
                  </div>
                )}

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
