import React from 'react';
import { clsx } from 'clsx';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export const MetricTile = ({
  label,
  value,
  unit = '',
  context = '',
  trend = 'neutral', // 'up' | 'down' | 'neutral'
  trendValue = '',
  status = 'normal', // 'normal' | 'warn' | 'error' | 'success'
  className = '',
}) => {
  const statusColors = {
    normal: 'border-slate-800 bg-slate-900/80 text-slate-100',
    success: 'border-emerald-500/30 bg-emerald-950/20 text-emerald-300',
    warn: 'border-amber-500/30 bg-amber-950/20 text-amber-300',
    error: 'border-rose-500/30 bg-rose-950/20 text-rose-300',
  };

  return (
    <div
      className={clsx(
        'p-3.5 rounded-xl border font-sans shadow-lg transition-all hover:border-slate-700',
        statusColors[status] || statusColors.normal,
        className
      )}
    >
      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 uppercase tracking-wider mb-1">
        <span>{label}</span>
        {trendValue && (
          <span className="flex items-center gap-0.5 text-[10px] font-bold">
            {trend === 'up' && <TrendingUp size={12} className="text-emerald-400" />}
            {trend === 'down' && <TrendingDown size={12} className="text-rose-400" />}
            {trend === 'neutral' && <Minus size={12} className="text-slate-500" />}
            <span className={trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-rose-400' : 'text-slate-400'}>
              {trendValue}
            </span>
          </span>
        )}
      </div>

      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-extrabold font-mono tracking-tight text-white">{value}</span>
        {unit && <span className="text-xs font-mono text-slate-400">{unit}</span>}
      </div>

      {context && (
        <div className="text-[10px] font-mono text-slate-500 mt-1 truncate">
          {context}
        </div>
      )}
    </div>
  );
};
