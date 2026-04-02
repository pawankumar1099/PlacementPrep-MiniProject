import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { progressAPI } from '../services/api';
import ProgressBar from '../components/ProgressBar';
import Loader from '../components/Loader';

const COMPANIES = [
  { name: 'Google', tier: 'FAANG', color: 'from-blue-500/20 to-green-500/10', border: 'border-blue-500/20', emoji: '🔍' },
  { name: 'Microsoft', tier: 'FAANG', color: 'from-blue-600/20 to-cyan-500/10', border: 'border-blue-600/20', emoji: '🪟' },
  { name: 'Amazon', tier: 'FAANG', color: 'from-amber-500/20 to-orange-500/10', border: 'border-amber-500/20', emoji: '📦' },
  { name: 'Flipkart', tier: 'Product', color: 'from-yellow-500/20 to-amber-500/10', border: 'border-yellow-500/20', emoji: '🛒' },
  { name: 'Uber', tier: 'Product', color: 'from-slate-500/20 to-zinc-500/10', border: 'border-slate-400/20', emoji: '🚗' },
  { name: 'Swiggy', tier: 'Product', color: 'from-orange-500/20 to-red-500/10', border: 'border-orange-500/20', emoji: '🍔' },
  { name: 'TCS', tier: 'Service', color: 'from-brand-500/20 to-purple-500/10', border: 'border-brand-500/20', emoji: '🏢' },
  { name: 'Infosys', tier: 'Service', color: 'from-indigo-500/20 to-blue-500/10', border: 'border-indigo-500/20', emoji: '🌐' },
  { name: 'Wipro', tier: 'Service', color: 'from-teal-500/20 to-emerald-500/10', border: 'border-teal-500/20', emoji: '💡' },
  { name: 'Accenture', tier: 'Service', color: 'from-purple-500/20 to-pink-500/10', border: 'border-purple-500/20', emoji: '🎯' },
  { name: 'Deloitte', tier: 'Consulting', color: 'from-green-500/20 to-teal-500/10', border: 'border-green-500/20', emoji: '📊' },
  { name: 'Cognizant', tier: 'Service', color: 'from-sky-500/20 to-blue-500/10', border: 'border-sky-500/20', emoji: '⚡' },
];

const TIERS = ['All', 'FAANG', 'Product', 'Service', 'Consulting'];
const ROUNDS = ['aptitude', 'coding', 'technical', 'hr'];

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [allProgress, setAllProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTier, setSelectedTier] = useState('All');

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await progressAPI.getAll();
        setAllProgress(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, []);

  const getCompanyProgress = (companyName) => {
    return allProgress.find(p => p.company === companyName);
  };

  const getCompletedRounds = (progress) => {
    if (!progress) return 0;
    return progress.rounds.filter(r => r.status === 'completed').length;
  };

  const filteredCompanies = selectedTier === 'All' ? COMPANIES : COMPANIES.filter(c => c.tier === selectedTier);

  const totalStarted = allProgress.filter(p => p.status !== 'not-started').length;
  const totalCompleted = allProgress.filter(p => p.status === 'completed').length;
  const avgScore = allProgress.length > 0
    ? Math.round(allProgress.reduce((sum, p) => sum + (p.overallScore || 0), 0) / allProgress.length)
    : 0;

  return (
    <div className="page-container">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white mb-1.5">
              Welcome back, <span className="glow-text">{user?.name?.split(' ')[0]}</span> 👋
            </h1>
            <p className="text-slate-400">
              {user?.college ? `${user.college} • ` : ''}{user?.branch || 'Student'} • Ready to crack placements?
            </p>
          </div>
          <Link to="/resume" className="btn-primary shrink-0">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            Analyze Resume
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Companies Started', value: totalStarted, icon: '🏢', color: 'text-brand-400' },
            { label: 'Completed', value: totalCompleted, icon: '✅', color: 'text-emerald-400' },
            { label: 'Avg Score', value: `${avgScore}%`, icon: '📊', color: 'text-amber-400' },
            { label: 'Rounds Done', value: allProgress.reduce((sum, p) => sum + (p.rounds?.filter(r => r.status === 'completed').length || 0), 0), icon: '🎯', color: 'text-cyan-400' },
          ].map((stat) => (
            <div key={stat.label} className="card p-4 flex items-center gap-3">
              <span className="text-2xl">{stat.icon}</span>
              <div>
                <p className={`text-xl font-extrabold ${stat.color}`}>{stat.value}</p>
                <p className="text-xs text-slate-500">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
        {TIERS.map(t => (
          <button
            key={t}
            onClick={() => setSelectedTier(t)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
              selectedTier === t
                ? 'bg-brand-600 text-white shadow-brand'
                : 'bg-dark-600 border border-white/8 text-slate-400 hover:text-white'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Company cards */}
      {loading ? (
        <div className="flex justify-center py-20"><Loader size="lg" text="Loading your progress..." /></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCompanies.map((company) => {
            const progress = getCompanyProgress(company.name);
            const completedRounds = getCompletedRounds(progress);
            const progressPct = (completedRounds / ROUNDS.length) * 100;
            const status = progress?.status || 'not-started';
            const overallScore = progress?.overallScore || 0;

            return (
              <div
                key={company.name}
                onClick={() => navigate(`/company/${encodeURIComponent(company.name)}`)}
                className={`card-hover bg-gradient-to-br ${company.color} border ${company.border} p-5 group`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{company.emoji}</span>
                    <div>
                      <h3 className="font-bold text-white text-base">{company.name}</h3>
                      <span className="text-xs text-slate-500">{company.tier}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5">
                    <span className={`badge text-xs ${
                      status === 'completed' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' :
                      status === 'in-progress' ? 'bg-brand-500/15 text-brand-400 border border-brand-500/20' :
                      'bg-slate-500/15 text-slate-500 border border-white/10'
                    }`}>
                      {status === 'completed' ? '✓ Done' : status === 'in-progress' ? '⚡ Active' : '○ Start'}
                    </span>
                    {overallScore > 0 && (
                      <span className="text-xs font-bold text-amber-400">{overallScore}%</span>
                    )}
                  </div>
                </div>

                <div className="mt-3">
                  <div className="flex justify-between text-xs text-slate-500 mb-1.5">
                    <span>{completedRounds}/{ROUNDS.length} rounds</span>
                    <span>{Math.round(progressPct)}%</span>
                  </div>
                  <div className="h-1.5 bg-dark-500/60 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-brand-500 to-accent-cyan rounded-full transition-all duration-700"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <div className="flex gap-1">
                    {ROUNDS.map(r => {
                      const rd = progress?.rounds?.find(x => x.roundType === r);
                      return (
                        <div key={r} className={`w-2 h-2 rounded-full ${rd?.status === 'completed' ? 'bg-emerald-400' : 'bg-dark-400 border border-white/10'}`} title={r} />
                      );
                    })}
                  </div>
                  <svg className="w-4 h-4 text-slate-600 group-hover:text-brand-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
