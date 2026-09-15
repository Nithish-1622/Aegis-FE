import React from 'react';
import { useAnomalies } from '../services/useTelemetryStore';
import { AlertOctagon, RefreshCw } from 'lucide-react';

const mockDisruptions = [
  { id: 'd1', line: 'payment', severity: 'Severe', details: 'Payment line: severe delays, repeated timeouts to payment-service after 3 delayed departures.' },
  { id: 'd2', line: 'order', severity: 'Minor', details: 'Order line: minor delays, retry storm detected (15 retries in 30s window).' },
  { id: 'd3', line: 'inventory', severity: 'Part Closure', details: 'Inventory line: threadPool exhausted — queue size 512, active threads 64/64.' },
];

const LINE_BORDER_COLORS = {
  gateway: 'border-l-amber-400',
  order: 'border-l-blue-500',
  payment: 'border-l-purple-500',
  inventory: 'border-l-emerald-500',
};

const SEVERITY_BADGE_STYLE = {
  Severe: 'border-rose-500/40 text-rose-400 bg-rose-500/10',
  Minor: 'border-amber-500/40 text-amber-400 bg-amber-500/10',
  'Part Closure': 'border-slate-700 text-slate-300 bg-slate-800',
};

export const AnomaliesPage = ({ activeFilter }) => {
  const { data: anomaliesData, isLoading, refetch } = useAnomalies();

  const filteredDisruptions = React.useMemo(() => {
    if (!activeFilter) return mockDisruptions;
    return mockDisruptions.filter(d => d.line === activeFilter);
  }, [activeFilter]);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header disruption notice */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-xl font-bold uppercase tracking-tight text-white font-sans">
            Service Disruptions & Anomaly Logs
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            Automated AI telemetry detection for latency spikes, retries, and thread pool exhaustion.
          </p>
        </div>
        <button
          onClick={() => refetch()}
          className="p-2 border border-slate-800 bg-slate-900 text-slate-300 hover:border-cyan-500/40 transition-colors rounded-lg cursor-pointer"
        >
          <RefreshCw size={14} className={isLoading ? 'animate-spin text-cyan-400' : ''} />
        </button>
      </div>

      {/* Disruption Cards */}
      <div className="space-y-4">
        {filteredDisruptions.map((disruption) => {
          const borderClass = LINE_BORDER_COLORS[disruption.line] ?? 'border-l-slate-400';
          const badgeClass = SEVERITY_BADGE_STYLE[disruption.severity] ?? 'border-slate-400';

          return (
            <div
              key={disruption.id}
              className={`flex items-start gap-4 p-5 bg-slate-950/80 border border-slate-800 border-l-4 ${borderClass} rounded-xl shadow-xl hover:border-slate-700 transition-all`}
            >
              <AlertOctagon className="text-amber-400 flex-shrink-0 mt-0.5" size={20} />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-2 flex-wrap font-mono">
                  <span className="text-xs font-bold uppercase text-white font-sans">
                    {disruption.line} Line
                  </span>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${badgeClass}`}>
                    {disruption.severity}
                  </span>
                </div>

                <p className="text-xs font-mono leading-relaxed text-slate-300">
                  {disruption.details}
                </p>
              </div>
            </div>
          );
        })}

        {filteredDisruptions.length === 0 && (
          <div className="text-center py-12 border border-slate-800 bg-slate-950/80 rounded-xl text-slate-400 font-mono text-xs">
            All service lines are currently running healthy with zero anomalies.
          </div>
        )}
      </div>
    </div>
  );
};
