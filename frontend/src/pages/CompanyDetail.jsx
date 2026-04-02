import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { progressAPI } from '../services/api';
import RoundCard from '../components/RoundCard';
import ScoreBadge from '../components/ScoreBadge';
import Loader from '../components/Loader';

const ROUNDS = ['aptitude', 'coding', 'technical', 'hr'];

export default function CompanyDetail() {
  const { companyName } = useParams();
  const company = decodeURIComponent(companyName);
  const navigate = useNavigate();
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await progressAPI.getCompany(company);
        setProgress(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, [company]);

  const handleReset = async () => {
    if (!window.confirm(`Reset all progress for ${company}?`)) return;
    try {
      await progressAPI.reset(company);
      const res = await progressAPI.getCompany(company);
      setProgress(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const completedRounds = progress?.rounds?.filter(r => r.status === 'completed') || [];
  const completedPct = Math.round((completedRounds.length / ROUNDS.length) * 100);

  const getRoundData = (roundType) => progress?.rounds?.find(r => r.roundType === roundType);

  if (loading) return <div className="flex justify-center items-center min-h-[60vh]"><Loader size="lg" text="Loading company data..." /></div>;

  return (
    <div className="page-container max-w-4xl animate-fade-in">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
        <Link to="/dashboard" className="hover:text-slate-300 transition-colors">Dashboard</Link>
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        <span className="text-slate-300">{company}</span>
      </div>

      {/* Header */}
      <div className="card p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white mb-1">{company}</h1>
            <p className="text-slate-400 text-sm">
              {completedRounds.length} of {ROUNDS.length} rounds completed
              {progress?.status === 'completed' && <span className="ml-2 badge bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">✓ All Done!</span>}
            </p>
            <div className="mt-3 w-full max-w-xs">
              <div className="flex justify-between text-xs text-slate-500 mb-1">
                <span>Overall Progress</span>
                <span>{completedPct}%</span>
              </div>
              <div className="h-2 bg-dark-500 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-brand-500 to-accent-cyan rounded-full transition-all duration-700" style={{ width: `${completedPct}%` }} />
              </div>
            </div>
          </div>

          {progress?.overallScore > 0 && (
            <ScoreBadge score={progress.overallScore} size="lg" showLabel />
          )}
        </div>

        {/* Round score summary */}
        {completedRounds.length > 0 && (
          <div className="mt-5 pt-5 border-t border-white/8">
            <p className="text-xs text-slate-500 uppercase tracking-widest mb-3">Completed Rounds</p>
            <div className="flex flex-wrap gap-3">
              {completedRounds.map(r => (
                <div key={r.roundType} className="flex items-center gap-2 px-3 py-1.5 bg-dark-600 border border-white/8 rounded-xl">
                  <span className="capitalize text-sm text-slate-300">{r.roundType}</span>
                  <span className={`text-sm font-bold ${r.score >= 75 ? 'text-emerald-400' : r.score >= 50 ? 'text-brand-400' : 'text-amber-400'}`}>{r.score}%</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Interview Rounds */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title">Interview Rounds</h2>
          <p className="text-xs text-slate-500">Click a round to begin or retry</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {ROUNDS.map(roundType => (
            <RoundCard
              key={roundType}
              roundType={roundType}
              companyName={company}
              roundData={getRoundData(roundType)}
            />
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <button onClick={() => navigate('/dashboard')} className="btn-secondary">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back to Dashboard
        </button>
        {completedRounds.length > 0 && (
          <button onClick={handleReset} className="btn-ghost text-rose-400 hover:text-rose-300 hover:bg-rose-500/10">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            Reset Progress
          </button>
        )}
      </div>
    </div>
  );
}
