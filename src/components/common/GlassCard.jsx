import React from 'react';
import { clsx } from 'clsx';

export const GlassCard = ({ children, className = '', glowColor = 'cyan', ...props }) => {
  const glowMap = {
    cyan: 'hover:border-cyan-500/40 hover:shadow-cyan-500/5',
    purple: 'hover:border-purple-500/40 hover:shadow-purple-500/5',
    emerald: 'hover:border-emerald-500/40 hover:shadow-emerald-500/5',
    amber: 'hover:border-amber-500/40 hover:shadow-amber-500/5',
    rose: 'hover:border-rose-500/40 hover:shadow-rose-500/5',
  };

  return (
    <div
      className={clsx(
        'bg-slate-900/70 backdrop-blur-md border border-slate-800 rounded-xl p-4 shadow-xl transition-all',
        glowMap[glowColor] || glowMap.cyan,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
