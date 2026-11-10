import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { 
  Award, 
  Clock, 
  CheckCircle, 
  HelpCircle, 
  ArrowRight, 
  Sparkles, 
  Code, 
  Database, 
  Globe, 
  Cpu, 
  BarChart3,
  Filter
} from 'lucide-react';

export default function CandidateAssessmentsPage() {
  const [categories, setCategories] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [catData, asmData] = await Promise.all([
          api.getAssessmentCategories(),
          api.getAssessments(selectedCategory)
        ]);
        setCategories(catData.results || catData);
        setAssessments(asmData.results || asmData);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [selectedCategory]);

  const getCategoryIcon = (name) => {
    if (name.includes('Python')) return <Code className="w-5 h-5 text-blue-600" />;
    if (name.includes('SQL') || name.includes('Database')) return <Database className="w-5 h-5 text-teal-600" />;
    if (name.includes('Web') || name.includes('React')) return <Globe className="w-5 h-5 text-cyan-600" />;
    if (name.includes('Aptitude') || name.includes('Logic')) return <Cpu className="w-5 h-5 text-purple-600" />;
    return <BarChart3 className="w-5 h-5 text-emerald-600" />;
  };

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold mb-2">
            <Award className="w-3.5 h-3.5" />
            <span>Verified Candidate Benchmarking</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
            Skill Assessments & Quizzes
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Prove your hands-on competencies through timed, server-validated multiple choice and technical evaluations.
          </p>
        </div>

        <Link
          to="/assessments/history"
          className="self-start md:self-auto px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-sm"
        >
          View Attempt History
        </Link>
      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedCategory('')}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition ${
            selectedCategory === '' 
              ? 'bg-navy-900 text-white shadow-sm' 
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          All Categories
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.slug)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition ${
              selectedCategory === cat.slug 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Assessments Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(n => (
            <div key={n} className="p-6 rounded-3xl bg-white border border-slate-200 animate-pulse h-52"></div>
          ))}
        </div>
      ) : assessments.length === 0 ? (
        <div className="p-16 bg-white rounded-3xl border border-slate-200 text-center text-xs text-slate-500">
          No assessments found in this category.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assessments.map((asm) => (
            <div
              key={asm.id}
              className="bg-white p-6 rounded-3xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center border border-slate-100">
                    {getCategoryIcon(asm.category_name)}
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 capitalize">
                    {asm.difficulty?.toLowerCase()}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-base text-navy-900 leading-snug">
                    {asm.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {asm.description}
                  </p>
                </div>

                <div className="flex items-center space-x-4 text-xs text-slate-500 pt-1">
                  <span className="flex items-center">
                    <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
                    {asm.duration_minutes} mins
                  </span>
                  <span className="flex items-center">
                    <HelpCircle className="w-3.5 h-3.5 mr-1 text-slate-400" />
                    {asm.question_count} Questions
                  </span>
                  <span className="flex items-center text-teal-600 font-semibold">
                    Pass: {asm.passing_score}%
                  </span>
                </div>
              </div>

              <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between">
                <div>
                  {asm.user_best_score ? (
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">Best Score</span>
                      <span className={`text-xs font-bold ${asm.user_best_score.passed ? 'text-emerald-600' : 'text-slate-600'}`}>
                        {asm.user_best_score.percentage}% ({asm.user_best_score.passed ? 'Passed' : 'Completed'})
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400">Not Attempted</span>
                  )}
                </div>

                <Link
                  to={`/assessments/${asm.id}/take`}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm transition flex items-center"
                >
                  {asm.user_best_score ? 'Retake Quiz' : 'Start Assessment'}
                  <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}

