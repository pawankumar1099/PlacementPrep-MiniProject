import React from 'react';

export default function Loader({ fullScreen = false, size = 'md', text = '' }) {
  const sizes = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' };

  const spinner = (
    <div className="flex flex-col items-center gap-3">
      <div className={`${sizes[size]} relative`}>
        <div className={`${sizes[size]} rounded-full border-2 border-brand-900 border-t-brand-400 animate-spin`} />
        <div className={`${sizes[size]} rounded-full border-2 border-transparent border-b-accent-cyan absolute inset-0 animate-spin`} style={{ animationDirection: 'reverse', animationDuration: '0.8s' }} />
      </div>
      {text && <p className="text-slate-400 text-sm animate-pulse">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        {spinner}
      </div>
    );
  }

  return spinner;
}
