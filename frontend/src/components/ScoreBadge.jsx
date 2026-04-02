import React from 'react';

export default function ScoreBadge({ score, size = 'md', showLabel = false }) {
  const getColor = (s) => {
    if (s >= 80) return { ring: '#10b981', text: '#10b981', bg: 'rgba(16,185,129,0.1)', label: 'Excellent' };
    if (s >= 65) return { ring: '#6366f1', text: '#818cf8', bg: 'rgba(99,102,241,0.1)', label: 'Good' };
    if (s >= 45) return { ring: '#f59e0b', text: '#f59e0b', bg: 'rgba(245,158,11,0.1)', label: 'Average' };
    return { ring: '#f43f5e', text: '#f43f5e', bg: 'rgba(244,63,94,0.1)', label: 'Needs Work' };
  };

  const color = getColor(score);
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const sizeDims = {
    sm: { svg: 60, r: 24, sw: 3, fontSize: 12 },
    md: { svg: 100, r: 42, sw: 5, fontSize: 22 },
    lg: { svg: 140, r: 60, sw: 6, fontSize: 30 },
  };
  const d = sizeDims[size] || sizeDims.md;
  const circ = 2 * Math.PI * d.r;
  const dash = circ - (score / 100) * circ;

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative" style={{ width: d.svg, height: d.svg }}>
        <svg viewBox={`0 0 ${d.svg} ${d.svg}`} className="-rotate-90" style={{ width: d.svg, height: d.svg }}>
          <circle
            cx={d.svg / 2} cy={d.svg / 2} r={d.r}
            fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={d.sw}
          />
          <circle
            cx={d.svg / 2} cy={d.svg / 2} r={d.r}
            fill="none"
            stroke={color.ring}
            strokeWidth={d.sw}
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={dash}
            style={{ transition: 'stroke-dashoffset 1.5s ease-out', filter: `drop-shadow(0 0 6px ${color.ring})` }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-bold" style={{ fontSize: d.fontSize, color: color.text }}>{score}</span>
        </div>
      </div>
      {showLabel && (
        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full" style={{ color: color.text, backgroundColor: color.bg }}>
          {color.label}
        </span>
      )}
    </div>
  );
}
