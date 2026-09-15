import React from 'react';
import { clsx } from 'clsx';

export const StatusIndicator = ({ status = 'HEALTHY', size = 'sm', showLabel = true, className = '' }) => {
  const normalized = status.toUpperCase();

  const isHealthy = ['UP', 'HEALTHY', 'OK', 'RUNNING', 'SUCCESS', 'ON TIME'].includes(normalized);
  const isWarn = ['WARN', 'WARNING', 'DEGRADED', 'RETRY', 'DELAYED'].includes(normalized);
  const isError = ['DOWN', 'ERROR', 'CRITICAL', 'FAILED', 'CANCELLED', '500'].includes(normalized);

  const dotColor = isHealthy
    ? 'bg-emerald-400 shadow-emerald-500/50'
    : isWarn
    ? 'bg-amber-400 shadow-amber-500/50'
    : isError
    ? 'bg-rose-400 shadow-rose-500/50'
    : 'bg-slate-500 shadow-slate-500/50';

  const textColor = isHealthy
    ? 'text-emerald-400'
    : isWarn
    ? 'text-amber-400'
    : isError
    ? 'text-rose-400'
    : 'text-slate-400';

  const badgeBg = isHealthy
    ? 'bg-emerald-500/10 border-emerald-500/30'
    : isWarn
    ? 'bg-amber-500/10 border-amber-500/30'
    : isError
    ? 'bg-rose-500/10 border-rose-500/30'
    : 'bg-slate-800 border-slate-700';

  const dotSize = size === 'xs' ? 'w-1.5 h-1.5' : size === 'lg' ? 'w-3 h-3' : 'w-2 h-2';

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[10px] font-mono font-bold uppercase tracking-wider',
        badgeBg,
        textColor,
        className
      )}
    >
      <span className={clsx('rounded-full animate-pulse shadow-sm', dotSize, dotColor)} />
      {showLabel && <span>{normalized}</span>}
    </span>
  );
};
