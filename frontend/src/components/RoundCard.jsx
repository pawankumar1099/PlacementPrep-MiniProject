import React from 'react';
import { useNavigate } from 'react-router-dom';

const ROUND_META = {
  aptitude: {
    label: 'Aptitude',
    icon: '🧮',
    desc: 'Quant, Logical, Verbal & DI',
    path: 'aptitude',
    gradient: 'from-amber-500/20 to-orange-500/10',
    border: 'border-amber-500/20',
    color: 'text-amber-400',
  },
  coding: {
    label: 'Coding',
    icon: '💻',
    desc: 'DSA Problem with Monaco Editor',
    path: 'coding',
    gradient: 'from-brand-500/20 to-purple-500/10',
    border: 'border-brand-500/20',
    color: 'text-brand-400',
  },
  technical: {
    label: 'Technical',
    icon: '⚙️',
    desc: 'CS Fundamentals AI Interview',
    path: 'technical',
    gradient: 'from-cyan-500/20 to-blue-500/10',
    border: 'border-cyan-500/20',
    color: 'text-cyan-400',
  },
  hr: {
    label: 'HR',
    icon: '🤝',
    desc: 'Behavioral & STAR Method',
    path: 'hr',
    gradient: 'from-emerald-500/20 to-teal-500/10',
    border: 'border-emerald-500/20',
    color: 'text-emerald-400',
  },
};

export default function RoundCard({ roundType, companyName, roundData }) {
  const navigate = useNavigate();
  const meta = ROUND_META[roundType];
  const isCompleted = roundData?.status === 'completed';
  const score = roundData?.score ?? null;

  return (
    <div
      onClick={() => navigate(`/${meta.path}/${encodeURIComponent(companyName)}`)}
      className={`card-hover bg-gradient-to-br ${meta.gradient} border ${meta.border} p-5 flex items-start gap-4 group`}
    >
      <div className="text-3xl mt-0.5">{meta.icon}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h3 className={`font-bold text-base ${meta.color}`}>{meta.label} Round</h3>
          {isCompleted ? (
            <span className="badge bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              Done
            </span>
          ) : (
            <span className="badge bg-slate-500/15 text-slate-400 border border-white/10">Pending</span>
          )}
        </div>
        <p className="text-xs text-slate-500 mt-0.5">{meta.desc}</p>
        {isCompleted && score !== null && (
          <div className="mt-2 flex items-center gap-2">
            <div className="flex-1 h-1.5 bg-dark-500 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${score >= 75 ? 'from-emerald-500 to-teal-400' : score >= 50 ? 'from-brand-500 to-brand-400' : 'from-amber-500 to-orange-400'}`}
                style={{ width: `${score}%` }}
              />
            </div>
            <span className={`text-xs font-bold ${meta.color}`}>{score}%</span>
          </div>
        )}
      </div>
      <svg className="w-4 h-4 text-slate-600 group-hover:text-slate-300 transition-colors mt-1 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </div>
  );
}
