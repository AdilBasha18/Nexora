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
  History,
  CheckCircle2,
  Code2,
  HelpCircle,
  TrendingUp,
  Cpu,
  FileCode,
  Database
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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white space-y-4">
        <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-mono text-slate-400">Grading Assessment & Compiling Score Report...</p>
      </div>
    );
  }

  if (!attempt) {
    return (
      <div className="p-16 text-center space-y-4 max-w-md mx-auto">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
        <h2 className="text-base font-bold text-slate-800">Assessment Result Not Found</h2>
        <Link
          to="/assessments"
          className="inline-flex items-center px-4 py-2 rounded-xl bg-navy-900 text-white text-xs font-semibold"
        >
          <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Assessments
        </Link>
      </div>
    );
  }

  const reviewItems = attempt.responses || [];
  const mcqScore = attempt.mcq_score !== undefined ? attempt.mcq_score : (attempt.score ? Math.min(50, attempt.score) : 0);
  const codingScore = attempt.coding_score !== undefined ? attempt.coding_score : (attempt.score ? Math.max(0, attempt.score - mcqScore) : 0);
  const totalMcqs = attempt.total_mcqs || 5;
  const totalCoding = attempt.total_coding || 5;
  const mcqsPassed = Math.round(mcqScore / 10);
  const codingPassed = Math.round(codingScore / 10);

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* HERO BANNER: Assessment Score & Status */}
        <div className={`p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 ${
          attempt.passed 
            ? 'bg-gradient-to-tr from-emerald-950 via-teal-900 to-navy-950 border border-emerald-500/30' 
            : 'bg-gradient-to-tr from-slate-950 via-navy-900 to-blue-950 border border-slate-700/50'
        }`}>
          <div className="space-y-3 relative z-10">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[10px] font-black uppercase tracking-wider">
              <Award className="w-3.5 h-3.5 text-teal-300" />
              <span>{attempt.category_name} Benchmark</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              {attempt.assessment_title}
            </h1>
            <p className="text-xs text-slate-300 flex items-center space-x-2">
              <Calendar className="w-3.5 h-3.5" />
              <span>Completed on {new Date(attempt.completed_at).toLocaleString()}</span>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 relative z-10">
            <div className="text-center bg-black/30 backdrop-blur-md px-6 py-4 rounded-2xl border border-white/10 shrink-0 w-full sm:w-auto">
              <div className="text-4xl sm:text-5xl font-black tracking-tight">
                {attempt.percentage}<span className="text-xl text-teal-400">/100</span>
              </div>
              <span className={`text-[11px] font-bold uppercase tracking-wider block mt-1 ${
                attempt.passed ? 'text-teal-300' : 'text-amber-300'
              }`}>
                {attempt.passed ? 'Benchmark Passed' : 'Below Passing Threshold'}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                Passing requirement: {attempt.passing_score}%
              </span>
            </div>
          </div>
        </div>

        {/* 3 PERFORMANCE CARDS: Overall, MCQs & Coding Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Card 1: Overall Score */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
              <span>Overall Score</span>
              <Award className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-black text-navy-900">
              {attempt.score} <span className="text-sm font-semibold text-slate-400">/ 100 Pts</span>
            </div>
            <div className="text-xs text-slate-500">
              {attempt.correct_answers} of {attempt.total_questions} total questions correct
            </div>
          </div>

          {/* Card 2: MCQ Performance */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
              <span>MCQ Domain Knowledge</span>
              <HelpCircle className="w-4 h-4 text-teal-600" />
            </div>
            <div className="text-2xl font-black text-navy-900">
              {mcqScore} <span className="text-sm font-semibold text-slate-400">/ 50 Pts</span>
            </div>
            <div className="text-xs text-slate-500">
              {mcqsPassed} of {totalMcqs} MCQs answered correctly
            </div>
          </div>

          {/* Card 3: Coding Challenges Performance */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase tracking-wider">
              <span>Sandbox Coding Challenges</span>
              <Terminal className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-2xl font-black text-navy-900">
              {codingScore} <span className="text-sm font-semibold text-slate-400">/ 50 Pts</span>
            </div>
            <div className="text-xs text-slate-500">
              {codingPassed} of {totalCoding} code challenges passed
            </div>
          </div>

        </div>

        {/* ACTION BUTTONS: Attempt History & Retake */}
        <div className="flex items-center justify-between flex-wrap gap-3 pt-2">
          <Link
            to="/assessments"
            className="inline-flex items-center text-xs font-semibold text-slate-600 hover:text-blue-600 transition"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to All Assessments
          </Link>

          <div className="flex items-center space-x-3">
            <Link
              to="/assessments/history"
              className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs shadow-2xs flex items-center transition"
            >
              <History className="w-3.5 h-3.5 mr-1.5 text-slate-500" /> View Attempt History
            </Link>

            <Link
              to={`/assessments/${attempt.assessment}/take`}
              className="px-4 py-2 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-semibold text-xs shadow-sm flex items-center transition"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1.5" /> Retake Assessment
            </Link>
          </div>
        </div>

        {/* DETAILED QUESTION REVIEW */}
        <div className="space-y-6 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-navy-900 tracking-tight">
              Detailed Question-by-Question Review & Sandbox Logs
            </h2>
            <span className="text-xs text-slate-500">
              {reviewItems.length} questions evaluated
            </span>
          </div>

          <div className="space-y-4">
            {reviewItems.map((item, idx) => {
              const q = item.question || item;
              const isCorrect = item.is_correct !== undefined ? item.is_correct : q.is_correct;
              const isCodeQ = q.question_type === 'code' || (item.test_results && Object.keys(item.test_results).length > 0);
              const testResultsData = item.test_results || {};
              const testList = testResultsData.tests || testResultsData.test_results || [];
              const passedTests = testList.filter(t => t.passed).length;

              return (
                <div 
                  key={item.id || idx}
                  className={`p-6 rounded-3xl border bg-white shadow-xs space-y-4 transition ${
                    isCorrect ? 'border-emerald-200' : 'border-rose-200'
                  }`}
                >
                  {/* Top Bar of Card */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start space-x-3 flex-1">
                      <span className="font-bold text-xs text-slate-400 mt-1">#{idx + 1}</span>
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center space-x-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            isCodeQ ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {isCodeQ ? 'Coding Sandbox' : 'Multiple Choice'}
                          </span>
                          {q.difficulty && (
                            <span className="text-[10px] font-bold text-slate-500 uppercase">
                              • {q.difficulty}
                            </span>
                          )}
                        </div>
                        {q.title && (
                          <h3 className="text-sm font-bold text-navy-900">
                            {q.title}
                          </h3>
                        )}
                        <p className="text-xs sm:text-sm text-slate-700 whitespace-pre-line leading-relaxed">
                          {q.question_text}
                        </p>
                      </div>
                    </div>

                    {/* Result Badge */}
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold shrink-0 ${
                      isCorrect 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-rose-100 text-rose-800'
                    }`}>
                      {isCorrect ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                          <span>{isCodeQ ? `${passedTests}/${testList.length} Passed` : 'Correct (+10 pts)'}</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5 mr-1" />
                          <span>{isCodeQ ? `${passedTests}/${testList.length} Passed` : 'Incorrect (0 pts)'}</span>
                        </>
                      )}
                    </span>
                  </div>

                  {/* CODING QUESTION REVIEW BODY */}
                  {isCodeQ ? (
                    <div className="space-y-3 pt-2">
                      {/* Candidate Submitted Code */}
                      <div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                          Your Submitted Solution:
                        </span>
                        {item.code_answer ? (
                          <div className="rounded-2xl bg-slate-950 text-emerald-300 p-4 font-mono text-xs overflow-x-auto border border-slate-800 shadow-inner">
                            <pre className="leading-relaxed whitespace-pre-wrap">{item.code_answer}</pre>
                          </div>
                        ) : (
                          <div className="text-xs text-slate-400 italic bg-slate-100 p-3 rounded-xl">
                            No code submitted for this challenge.
                          </div>
                        )}
                      </div>

                      {/* Sandbox Test Case Breakdown */}
                      {testList.length > 0 && (
                        <div className="space-y-2 pt-1">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                            Secure Sandbox Unit Test Executions ({passedTests} of {testList.length} passed):
                          </span>
                          <div className="space-y-1.5">
                            {testList.map((t, ti) => (
                              <div
                                key={ti}
                                className={`p-3 rounded-xl border text-xs font-mono flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                                  t.passed 
                                    ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950' 
                                    : 'bg-rose-50/70 border-rose-200 text-rose-950'
                                }`}
                              >
                                <div className="flex items-center space-x-2">
                                  {t.passed ? (
                                    <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                                  ) : (
                                    <XSquare className="w-4 h-4 text-rose-600 shrink-0" />
                                  )}
                                  <span className="font-bold">Test #{ti + 1}:</span>
                                  <span className="text-slate-600">Input: {JSON.stringify(t.input)}</span>
                                </div>
                                <div className="text-[11px] space-x-2">
                                  <span className="text-slate-500">Expected: {JSON.stringify(t.expected)}</span>
                                  {!t.passed && t.actual !== undefined && (
                                    <span className="text-rose-700 font-bold">| Actual: {JSON.stringify(t.actual)}</span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {testResultsData.error && (
                        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-mono text-rose-800">
                          <strong>Runtime / Sandbox Error:</strong> {testResultsData.error}
                        </div>
                      )}
                    </div>
                  ) : (
                    /* MCQ OPTION REVIEW BODY */
                    <div className="space-y-2 pt-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        {(q.options || []).map((opt, optIdx) => {
                          const isCandidateChoice = item.selected_option_index === optIdx;
                          const isCorrectOption = q.correct_option_index === optIdx;

                          let style = "bg-slate-50 border-slate-200 text-slate-700";
                          if (isCorrectOption) {
                            style = "bg-emerald-50 border-emerald-300 text-emerald-900 font-bold";
                          } else if (isCandidateChoice && !isCorrectOption) {
                            style = "bg-rose-50 border-rose-300 text-rose-900 font-medium";
                          }

                          return (
                            <div key={optIdx} className={`p-3 rounded-xl border flex items-center justify-between ${style}`}>
                              <span>{opt}</span>
                              {isCorrectOption && (
                                <span className="text-[10px] text-emerald-700 font-bold ml-2">✓ Correct Answer</span>
                              )}
                              {isCandidateChoice && !isCorrectOption && (
                                <span className="text-[10px] text-rose-600 font-bold ml-2">Your Answer</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Technical Explanation */}
                  {q.explanation && (
                    <div className="p-4 bg-blue-50/70 border border-blue-100 rounded-2xl text-xs text-blue-950 space-y-1">
                      <span className="font-bold text-[10px] uppercase text-blue-700 block tracking-wider">
                        Technical Explanation & Optimal Approach:
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
    </div>
  );
}
