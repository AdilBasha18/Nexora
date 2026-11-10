import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  Calendar, 
  ArrowRight, 
  RotateCcw, 
  BookOpen, 
  Clock, 
  AlertCircle,
  TrendingUp,
  FileText,
  ChevronRight
} from 'lucide-react';

export default function AssessmentHistoryPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadHistory() {
      setLoading(true);
      setError('');
      try {
        const data = await api.getMyAssessmentAttempts();
        const list = data.results || data;
        setAttempts(list);
      } catch (err) {
        console.error("Failed to load attempt history:", err);
        setError("Failed to load your assessment attempts. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    loadHistory();
  }, []);

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold mb-2">
            <Award className="w-3.5 h-3.5" />
            <span>Verified Candidate Benchmarking</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
            Assessment Attempt History
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review your past test scores, verified badges, and examine detailed question-by-question explanations.
          </p>
        </div>

        <Link
          to="/assessments"
          className="self-start sm:self-auto px-4 py-2 rounded-xl bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold shadow-sm transition"
        >
          Browse All Assessments
        </Link>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-700 flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map(n => (
            <div key={n} className="p-6 bg-white rounded-3xl border border-slate-200 animate-pulse space-y-3">
              <div className="h-4 bg-slate-200 rounded w-1/3" />
              <div className="h-3 bg-slate-100 rounded w-1/4" />
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && attempts.length === 0 && !error && (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
            <BookOpen className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-navy-900">No Assessment Attempts Yet</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              You haven't completed any skill assessments or coding challenges. Take an assessment to benchmark your skills!
            </p>
          </div>
          <Link
            to="/assessments"
            className="inline-flex items-center px-4 py-2.5 rounded-xl bg-navy-900 text-white text-xs font-bold hover:bg-navy-800 transition"
          >
            <span>Explore Skill Assessments</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </Link>
        </div>
      )}

      {/* Attempts List */}
      {!loading && attempts.length > 0 && (
        <div className="space-y-4">
          {attempts.map(attempt => {
            const isPassed = attempt.passed;
            const completedDate = new Date(attempt.completed_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            });

            return (
              <div
                key={attempt.id}
                className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
              >
                {/* Left: Info */}
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold uppercase tracking-wider">
                      {attempt.category_name || 'General'}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      isPassed ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {isPassed ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" /> Passed
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3 mr-1 text-amber-600" /> Completed
                        </>
                      )}
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {completedDate}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-navy-900">
                    {attempt.assessment_title}
                  </h3>

                  <div className="flex items-center space-x-4 text-xs text-slate-500">
                    <span>Score: <strong className="text-navy-900">{attempt.correct_answers}/{attempt.total_questions}</strong> correct</span>
                    <span>•</span>
                    <span>Passing threshold: <strong className="text-navy-900">{attempt.passing_score}%</strong></span>
                  </div>
                </div>

                {/* Right: Score Gauge & Actions */}
                <div className="flex items-center space-x-6 self-stretch md:self-auto justify-between md:justify-end pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <div className="text-center">
                    <div className={`text-2xl font-black ${isPassed ? 'text-emerald-600' : 'text-amber-600'}`}>
                      {attempt.percentage}%
                    </div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Final Score
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Link
                      to={`/assessments/results/${attempt.id}`}
                      className="px-4 py-2.5 rounded-xl border border-slate-200 hover:border-blue-400 bg-white hover:bg-blue-50/50 text-navy-900 text-xs font-bold transition flex items-center shadow-2xs"
                    >
                      <span>View Results</span>
                      <ChevronRight className="w-3.5 h-3.5 ml-1" />
                    </Link>

                    <Link
                      to={`/assessments/${attempt.assessment}/take`}
                      className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition"
                      title="Retake Assessment"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}

