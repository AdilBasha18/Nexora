import React from 'react';
import { 
  Play, 
  Send, 
  RotateCcw, 
  Loader2, 
  Terminal, 
  Code2, 
  CheckCircle2, 
  XSquare, 
  ArrowRight 
} from 'lucide-react';

export default function CodingEditorWorkspace({
  currentQ,
  currentLang,
  currentCode,
  handleSwitchLanguage,
  handleResetStarterCode,
  handleRunCode,
  handleSubmitCode,
  handleCodeChange,
  runningCode,
  submittingCode,
  activeRunResult,
  activeTests,
  activeTabIdx,
  setSelectedTestTabs,
  currentTestDetail,
  currentIdx,
  questionsLength,
  onNextQuestion
}) {
  return (
    <div className="lg:col-span-7 flex flex-col space-y-4">
      
      {/* Code Editor Card */}
      <div className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden flex flex-col">
        
        {/* Editor Header: Language Switcher, Reset, Run, Submit */}
        <div className="bg-slate-50 px-4 py-3 flex flex-wrap items-center justify-between gap-2 border-b border-slate-200">
          
          {/* Working Language Selector (Python & Java) */}
          <div className="flex items-center space-x-1 p-1 bg-slate-200/70 rounded-xl text-xs font-bold">
            <button
              type="button"
              onClick={() => handleSwitchLanguage(currentQ.id, 'python')}
              className={`px-3 py-1 rounded-lg transition flex items-center space-x-1.5 ${
                currentLang === 'python'
                  ? 'bg-white text-teal-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Terminal className="w-3.5 h-3.5 text-blue-600" />
              <span>Python 3</span>
            </button>
            <button
              type="button"
              onClick={() => handleSwitchLanguage(currentQ.id, 'java')}
              className={`px-3 py-1 rounded-lg transition flex items-center space-x-1.5 ${
                currentLang === 'java'
                  ? 'bg-white text-teal-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Code2 className="w-3.5 h-3.5 text-orange-600" />
              <span>Java (JDK 17)</span>
            </button>
          </div>

          <div className="flex items-center space-x-2">
            {/* Reset Code */}
            <button
              type="button"
              onClick={() => handleResetStarterCode(currentQ)}
              className="px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-[11px] font-semibold transition flex items-center space-x-1"
              title="Reset starter template for this language"
            >
              <RotateCcw className="w-3 h-3 text-slate-500" />
              <span className="hidden sm:inline">Reset</span>
            </button>

            {/* Run Code (Sample tests) */}
            <button
              type="button"
              disabled={runningCode === currentQ.id || submittingCode === currentQ.id}
              onClick={() => handleRunCode(currentQ)}
              className="px-3.5 py-1.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs transition shadow-xs flex items-center space-x-1.5 disabled:opacity-50"
            >
              {runningCode === currentQ.id ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin mr-1 text-teal-600" />
                  <span>Running...</span>
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 fill-current text-slate-700" />
                  <span>Run Code</span>
                </>
              )}
            </button>

            {/* Submit Code (Full test evaluation) */}
            <button
              type="button"
              disabled={runningCode === currentQ.id || submittingCode === currentQ.id}
              onClick={() => handleSubmitCode(currentQ)}
              className="px-4 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition shadow-xs flex items-center space-x-1.5 disabled:opacity-50"
            >
              {submittingCode === currentQ.id ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin mr-1" />
                  <span>Evaluating...</span>
                </>
              ) : (
                <>
                  <Send className="w-3 h-3" />
                  <span>Submit Code</span>
                </>
              )}
            </button>
          </div>

        </div>

        {/* Textarea Code Editor */}
        <textarea
          value={currentCode}
          onChange={(e) => handleCodeChange(currentQ.id, e.target.value)}
          rows={14}
          spellCheck={false}
          placeholder={currentLang === 'java' ? "// Write your Java solution in class Solution..." : "# Write your Python solution here..."}
          className="w-full p-4 bg-slate-900 text-teal-300 font-mono text-xs sm:text-[13px] leading-relaxed outline-none border-none resize-y selection:bg-teal-700/60"
        />
      </div>

      {/* Execution / Test Console Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-5 space-y-3.5 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <div className="flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-teal-600" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Sandbox Execution & Test Results ({currentLang.toUpperCase()})
            </span>
          </div>

          {activeRunResult && (
            <div className="flex items-center space-x-2">
              {activeRunResult.elapsed_ms !== undefined && (
                <span className="text-[10px] text-slate-500 font-mono">
                  {activeRunResult.elapsed_ms}ms
                </span>
              )}
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                activeRunResult.all_passed 
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                  : 'bg-rose-100 text-rose-800 border border-rose-200'
              }`}>
                {activeRunResult.action === 'submit' 
                  ? (activeRunResult.all_passed ? '✓ Submission Passed' : '✗ Submission Failed') 
                  : (activeRunResult.all_passed ? 'All Sample Tests Passed' : 'Some Tests Failed')}
              </span>
            </div>
          )}
        </div>

        {/* Submission Success Banner */}
        {activeRunResult?.action === 'submit' && activeRunResult?.completed && (
          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span className="font-semibold">Challenge successfully solved! Question completed.</span>
            </div>
            {currentIdx < questionsLength - 1 && (
              <button
                type="button"
                onClick={onNextQuestion}
                className="px-3 py-1 rounded-xl bg-emerald-600 text-white font-bold text-[11px] hover:bg-emerald-700 transition flex items-center space-x-1"
              >
                <span>Next Question</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        )}

        {/* Error Banner */}
        {activeRunResult?.error && (
          <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-mono whitespace-pre-wrap">
            <strong className="text-rose-900">Execution Error:</strong> {activeRunResult.error}
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
                      ? 'bg-slate-100 border-teal-600 text-slate-900 shadow-xs ring-1 ring-teal-500/20' 
                      : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {hasResult && (
                    t.passed 
                      ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      : <XSquare className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                  )}
                  <span>Test Case #{tIdx + 1}</span>
                  {t.hidden && <span className="text-[9px] text-slate-400 uppercase">[Hidden]</span>}
                </button>
              );
            })}
          </div>
        )}

        {/* Active Test Case Detail */}
        {currentTestDetail && (
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs font-mono">
            <div>
              <span className="text-slate-500">Inputs: </span>
              <span className="text-slate-900 font-semibold">
                {currentTestDetail.hidden ? '[Hidden evaluation case]' : JSON.stringify(currentTestDetail.inputs || currentTestDetail.input)}
              </span>
            </div>

            <div>
              <span className="text-slate-500">Expected: </span>
              <span className="text-teal-700 font-bold">
                {currentTestDetail.hidden ? '[Hidden expected result]' : JSON.stringify(currentTestDetail.expected ?? currentTestDetail.expected_output)}
              </span>
            </div>

            {(currentTestDetail.actual !== undefined || currentTestDetail.actual_output !== undefined) && (
              <div>
                <span className="text-slate-500">Actual Output: </span>
                <span className={currentTestDetail.passed ? "text-emerald-700 font-bold" : "text-rose-600 font-bold"}>
                  {JSON.stringify(currentTestDetail.actual ?? currentTestDetail.actual_output)}
                </span>
              </div>
            )}

            {currentTestDetail.stdout && (
              <div>
                <span className="text-slate-500">Program stdout: </span>
                <span className="text-slate-700 bg-slate-200/50 px-2 py-0.5 rounded">
                  {currentTestDetail.stdout}
                </span>
              </div>
            )}

            {currentTestDetail.stderr && (
              <div>
                <span className="text-rose-500">Runtime stderr: </span>
                <span className="text-rose-700 bg-rose-100/50 px-2 py-0.5 rounded">
                  {currentTestDetail.stderr}
                </span>
              </div>
            )}
          </div>
        )}

      </div>

    </div>
  );
}
