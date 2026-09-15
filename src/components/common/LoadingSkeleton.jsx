import React from 'react';

export const LoadingSkeleton = ({ lines = 4, className = '' }) => {
  return (
    <div className={`space-y-3 animate-pulse p-4 rounded-xl bg-slate-950/60 border border-slate-800 ${className}`}>
      <div className="h-4 bg-slate-800 rounded w-1/3" />
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="h-3 bg-slate-900 rounded w-full border border-slate-800/40" />
      ))}
    </div>
  );
};
