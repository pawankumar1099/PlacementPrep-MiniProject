import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { codingAPI, progressAPI } from '../services/api';
import ScoreBadge from '../components/ScoreBadge';
import Loader from '../components/Loader';

const LANGUAGES = [
  { id: 'javascript', label: 'JavaScript', monaco: 'javascript' },
  { id: 'python', label: 'Python', monaco: 'python' },
  { id: 'java', label: 'Java', monaco: 'java' },
];

const DIFFICULTY_COLORS = {
  Easy: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  Medium: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  Hard: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
};

export default function CodingRound() {
  const { companyName } = useParams();
  const company = decodeURIComponent(companyName);

  const [state, setState] = useState('loading'); // loading | ready | coding | submitting | result
  const [problem, setProblem] = useState(null);
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const fetchProblem = useCallback(async () => {
    setState('loading');
    setError('');
    setResult(null);
    try {
      const res = await codingAPI.getProblem(company);
      const p = res.data.data;
      setProblem(p);
      setCode(p.starterCode?.javascript || '// Write your solution here');
      setState('ready');
    } catch (err) {
      setError('Failed to load problem. Please try again.');
      setState('ready');
    }
  }, [company]);

  useEffect(() => { fetchProblem(); }, [fetchProblem]);

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    if (problem?.starterCode?.[lang]) setCode(problem.starterCode[lang]);
  };

  const handleSubmit = async () => {
    if (!code.trim() || code.trim().length < 10) {
      setError('Please write your solution before submitting.');
      return;
    }
    setState('submitting');
    setError('');
    try {
      const res = await codingAPI.submit({ code, language, problem, company });
      const data = res.data.data;
      setResult(data);

      await progressAPI.saveRound(company, {
        roundType: 'coding',
        score: data.score,
        feedback: data.feedback,
        details: { passed: data.passedTestCases, total: data.totalTestCases, language },
      });

      setState('result');
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed. Please try again.');
      setState('coding');
    }
  };

  if (state === 'loading') return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <Loader size="lg" text="Generating coding problem with AI..." />
    </div>
  );

  // Result screen
  if (state === 'result' && result) {
    return (
      <div className="page-container max-w-3xl animate-fade-in">
        <div className="card p-8 text-center mb-6">
          <h2 className="text-2xl font-extrabold text-white mb-1">Coding Round Complete!</h2>
          <p className="text-slate-400 mb-5">{problem?.title} · {company}</p>
          <div className="flex justify-center mb-5"><ScoreBadge score={result.score} size="lg" showLabel /></div>
          <div className="grid grid-cols-3 gap-4 mb-5">
            <div className="card p-3 text-center">
              <p className="text-2xl font-bold text-emerald-400">{result.passedTestCases}</p>
              <p className="text-xs text-slate-500">Tests Passed</p>
            </div>
            <div className="card p-3 text-center">
              <p className="text-2xl font-bold text-slate-400">{result.totalTestCases}</p>
              <p className="text-xs text-slate-500">Total Tests</p>
            </div>
            <div className="card p-3 text-center">
              <p className="text-2xl font-bold text-brand-400">{result.score}%</p>
              <p className="text-xs text-slate-500">Score</p>
            </div>
          </div>

          {/* Test cases */}
          {result.testCaseResults?.length > 0 && (
            <div className="text-left space-y-2 mb-5">
              <p className="text-sm font-semibold text-slate-300 mb-2">Test Case Results:</p>
              {result.testCaseResults.map((tc, i) => (
                <div key={i} className={`p-3 rounded-xl border text-xs ${tc.passed ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-rose-500/20 bg-rose-500/5'}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span>{tc.passed ? '✅' : '❌'}</span>
                    <span className={tc.passed ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'}>Test {i + 1}</span>
                  </div>
                  <p className="text-slate-500 font-mono">Input: {tc.input}</p>
                  <p className="text-slate-500 font-mono">Expected: {tc.expectedOutput}</p>
                  {!tc.passed && <p className="text-rose-300 font-mono">Got: {tc.actualOutput}</p>}
                </div>
              ))}
            </div>
          )}

          <div className="bg-dark-600 rounded-xl p-4 mb-5 text-left">
            <p className="text-xs font-semibold text-brand-400 mb-2">AI Feedback:</p>
            <p className="text-slate-300 text-sm leading-relaxed">{result.feedback}</p>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <button onClick={fetchProblem} className="btn-primary">New Problem</button>
            <button onClick={() => { setState('coding'); setResult(null); }} className="btn-secondary">Edit Code</button>
            <Link to={`/company/${encodeURIComponent(company)}`} className="btn-secondary">Back to {company}</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Top bar */}
      <div className="border-b border-white/8 bg-dark-800/80 backdrop-blur-xl px-4 py-3 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <Link to={`/company/${encodeURIComponent(company)}`} className="btn-ghost text-xs">← {company}</Link>
          {problem && (
            <>
              <span className="text-white font-semibold text-sm truncate max-w-xs">{problem.title}</span>
              <span className={`badge border text-xs ${DIFFICULTY_COLORS[problem.difficulty] || DIFFICULTY_COLORS.Medium}`}>{problem.difficulty}</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          {LANGUAGES.map(l => (
            <button
              key={l.id}
              onClick={() => handleLanguageChange(l.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${language === l.id ? 'bg-brand-600 text-white' : 'bg-dark-600 border border-white/8 text-slate-400 hover:text-white'}`}
            >
              {l.label}
            </button>
          ))}
          <button onClick={fetchProblem} className="btn-ghost text-xs text-slate-500 hover:text-white" title="New Problem">↺</button>
          <button onClick={handleSubmit} disabled={state === 'submitting'} className="btn-primary text-sm py-2">
            {state === 'submitting' ? (
              <><div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />Evaluating...</>
            ) : 'Submit ✓'}
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row h-[calc(100vh-65px)]">
        {/* Problem panel */}
        <div className="w-full lg:w-5/12 overflow-y-auto p-5 border-r border-white/8">
          {error && (
            <div className="mb-4 px-3 py-2 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">{error}</div>
          )}

          {!problem && (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <span className="text-5xl">💻</span>
              <p className="text-white font-semibold">No problem loaded</p>
              <button onClick={fetchProblem} className="btn-primary">Generate Problem</button>
            </div>
          )}

          {problem && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <h2 className="text-xl font-bold text-white mb-1">{problem.title}</h2>
                <span className={`badge border text-xs ${DIFFICULTY_COLORS[problem.difficulty]}`}>{problem.difficulty}</span>
              </div>

              <div>
                <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{problem.description}</p>
              </div>

              {problem.examples?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Examples</p>
                  {problem.examples.map((ex, i) => (
                    <div key={i} className="bg-dark-600 rounded-xl p-3 mb-2 font-mono text-xs space-y-1">
                      <p><span className="text-brand-400">Input:</span> <span className="text-slate-300">{ex.input}</span></p>
                      <p><span className="text-emerald-400">Output:</span> <span className="text-slate-300">{ex.output}</span></p>
                      {ex.explanation && <p className="text-slate-500 italic">{ex.explanation}</p>}
                    </div>
                  ))}
                </div>
              )}

              {problem.constraints?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Constraints</p>
                  <ul className="space-y-1">
                    {problem.constraints.map((c, i) => (
                      <li key={i} className="text-slate-500 text-xs font-mono bg-dark-600 px-2.5 py-1.5 rounded-lg">{c}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Test Cases ({problem.testCases?.length})</p>
                <div className="space-y-1.5">
                  {problem.testCases?.slice(0, 3).map((tc, i) => (
                    <div key={i} className="bg-dark-600 rounded-lg px-3 py-2 font-mono text-xs flex gap-4">
                      <span className="text-brand-400">In: {tc.input}</span>
                      <span className="text-emerald-400">Out: {tc.expectedOutput}</span>
                    </div>
                  ))}
                  {problem.testCases?.length > 3 && (
                    <p className="text-xs text-slate-600">+ {problem.testCases.length - 3} hidden test cases</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Editor panel */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 monaco-editor-container">
            <Editor
              height="100%"
              language={LANGUAGES.find(l => l.id === language)?.monaco || 'javascript'}
              value={code}
              onChange={(val) => setCode(val || '')}
              theme="vs-dark"
              options={{
                fontSize: 14,
                fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                fontLigatures: true,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                lineNumbers: 'on',
                roundedSelection: true,
                padding: { top: 16, bottom: 16 },
                wordWrap: 'on',
                renderLineHighlight: 'all',
                smoothScrolling: true,
                cursorBlinking: 'smooth',
              }}
            />
          </div>

          {state === 'submitting' && (
            <div className="p-4 bg-dark-800 border-t border-white/8 flex items-center gap-3">
              <Loader size="sm" />
              <p className="text-slate-400 text-sm">AI is evaluating your code against test cases...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
