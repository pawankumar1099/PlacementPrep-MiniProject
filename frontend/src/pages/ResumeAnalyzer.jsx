import React, { useState } from 'react';
import { resumeAPI, progressAPI } from '../services/api';
import ScoreBadge from '../components/ScoreBadge';
import Loader from '../components/Loader';

const COMPANIES = ['General', 'Google', 'Microsoft', 'Amazon', 'TCS', 'Infosys', 'Wipro', 'Accenture', 'Deloitte', 'Flipkart', 'Uber', 'Cognizant'];

export default function ResumeAnalyzer() {
  const [resumeText, setResumeText] = useState('');
  const [targetCompany, setTargetCompany] = useState('General');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [charCount, setCharCount] = useState(0);

  const handleTextChange = (e) => {
    setResumeText(e.target.value);
    setCharCount(e.target.value.length);
  };

  const handleAnalyze = async () => {
    if (resumeText.trim().length < 50) {
      setError('Please paste at least 50 characters of your resume text.');
      return;
    }
    setError('');
    setLoading(true);
    setResult(null);
    try {
      const res = await resumeAPI.analyze({ resumeText, targetCompany });
      setResult(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-brand-400';
    if (score >= 40) return 'text-amber-400';
    return 'text-rose-400';
  };

  return (
    <div className="page-container max-w-5xl animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white mb-2">
          Resume <span className="glow-text">Analyzer</span>
        </h1>
        <p className="text-slate-400">Paste your resume for an AI-powered ATS analysis and personalized feedback</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input panel */}
        <div className="space-y-4">
          <div className="card p-5">
            <label className="label text-base font-semibold text-white mb-3 block">Target Company</label>
            <div className="flex flex-wrap gap-2">
              {COMPANIES.map(c => (
                <button
                  key={c}
                  onClick={() => setTargetCompany(c)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    targetCompany === c
                      ? 'bg-brand-600 text-white shadow-brand'
                      : 'bg-dark-500 border border-white/8 text-slate-400 hover:text-white'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <label className="label text-base font-semibold text-white">Paste Resume Text</label>
              <span className={`text-xs ${charCount < 50 ? 'text-rose-400' : 'text-slate-500'}`}>{charCount} chars</span>
            </div>
            <textarea
              value={resumeText}
              onChange={handleTextChange}
              rows={16}
              className="input-field resize-none font-mono text-xs leading-relaxed"
              placeholder="Paste your entire resume text here...

Include:
• Personal details & contact info
• Education section
• Skills & technologies
• Work experience / internships
• Projects
• Certifications
• Achievements

The more complete your resume text, the better the analysis!"
            />
            {error && (
              <p className="mt-2 text-rose-400 text-xs flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {error}
              </p>
            )}
            <button
              onClick={handleAnalyze}
              disabled={loading || resumeText.trim().length < 50}
              className="btn-primary w-full mt-4 py-3"
            >
              {loading ? (
                <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Analyzing with AI...</>
              ) : (
                <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>Analyze Resume for {targetCompany}</>
              )}
            </button>
          </div>
        </div>

        {/* Results panel */}
        <div>
          {loading && (
            <div className="card p-10 flex flex-col items-center justify-center gap-4 h-full min-h-[400px]">
              <Loader size="lg" text="AI is analyzing your resume..." />
              <p className="text-slate-500 text-xs text-center max-w-xs">Checking ATS compatibility, keywords, strengths & weaknesses...</p>
            </div>
          )}

          {!loading && !result && (
            <div className="card p-10 flex flex-col items-center justify-center gap-4 min-h-[400px] text-center border-dashed">
              <span className="text-6xl">📄</span>
              <div>
                <p className="text-white font-semibold mb-1">No analysis yet</p>
                <p className="text-slate-500 text-sm">Paste your resume and click analyze to get instant AI feedback</p>
              </div>
            </div>
          )}

          {result && !loading && (
            <div className="space-y-4 animate-slide-up">
              {/* ATS Score */}
              <div className="card p-5 flex items-center gap-5">
                <ScoreBadge score={result.atsScore} size="lg" showLabel />
                <div>
                  <h3 className="text-lg font-bold text-white">ATS Score</h3>
                  <p className={`text-2xl font-extrabold ${getScoreColor(result.atsScore)}`}>{result.atsScore}/100</p>
                  <p className="text-xs text-slate-500 mt-0.5">for {result.targetCompany} placement</p>
                </div>
              </div>

              {/* Strengths */}
              <div className="card p-5">
                <h3 className="font-bold text-emerald-400 flex items-center gap-2 mb-3">
                  <span>✅</span> Strengths ({result.strengths?.length})
                </h3>
                <ul className="space-y-2">
                  {result.strengths?.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                      <span className="text-emerald-400 mt-0.5 shrink-0">•</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Weaknesses */}
              <div className="card p-5">
                <h3 className="font-bold text-rose-400 flex items-center gap-2 mb-3">
                  <span>⚠️</span> Weaknesses ({result.weaknesses?.length})
                </h3>
                <ul className="space-y-2">
                  {result.weaknesses?.map((w, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                      <span className="text-rose-400 mt-0.5 shrink-0">•</span>
                      {w}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Missing keywords */}
              <div className="card p-5">
                <h3 className="font-bold text-amber-400 flex items-center gap-2 mb-3">
                  <span>🔑</span> Missing Keywords
                </h3>
                <div className="flex flex-wrap gap-2">
                  {result.missingKeywords?.map((kw, i) => (
                    <span key={i} className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs rounded-lg font-mono">{kw}</span>
                  ))}
                </div>
              </div>

              {/* Suggestions */}
              <div className="card p-5">
                <h3 className="font-bold text-cyan-400 flex items-center gap-2 mb-3">
                  <span>💡</span> Suggestions ({result.suggestions?.length})
                </h3>
                <ul className="space-y-2">
                  {result.suggestions?.map((s, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-slate-300">
                      <span className="px-1.5 py-0.5 bg-cyan-500/15 text-cyan-400 text-xs rounded font-mono shrink-0 mt-0.5">{i + 1}</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Feedback summary */}
              <div className="card p-5 bg-gradient-to-br from-brand-500/10 to-accent-cyan/5 border-brand-500/20">
                <h3 className="font-bold text-brand-300 flex items-center gap-2 mb-3">
                  <span>📝</span> AI Feedback Summary
                </h3>
                <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{result.feedbackSummary}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
