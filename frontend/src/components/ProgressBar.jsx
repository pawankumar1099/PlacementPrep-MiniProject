import React from 'react';

export default function ProgressBar({ value = 0, max = 100, color = 'brand', showLabel = true, size = 'md', animated = true }) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));

  const colors = {
    brand: 'from-brand-500 to-brand-400',
    cyan: 'from-accent-cyan to-brand-400',
    emerald: 'from-accent-emerald to-accent-cyan',
    amber: 'from-accent-amber to-orange-400',
    rose: 'from-accent-rose to-orange-400',
  };

  const sizes = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const getColor = () => {
    if (percent >= 75) return colors.emerald;
    if (percent >= 50) return colors.brand;
    if (percent >= 25) return colors.amber;
    return colors.rose;
  };

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs text-slate-400">Progress</span>
          <span className="text-xs font-semibold text-white">{Math.round(percent)}%</span>
        </div>
      )}
      <div className={`w-full ${sizes[size]} bg-dark-500 rounded-full overflow-hidden`}>
        <div
          className={`h-full bg-gradient-to-r ${color === 'auto' ? getColor() : colors[color] || colors.brand} rounded-full transition-all duration-700 ease-out ${animated ? 'animate-fade-in' : ''}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
