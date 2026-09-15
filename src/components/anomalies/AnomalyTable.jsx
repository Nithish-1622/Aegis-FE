import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, XCircle, Info, X, ChevronDown, ChevronUp, Clock } from 'lucide-react';
import { clsx } from 'clsx';

const SEVERITY_CONFIG = {
  CRITICAL: {
    icon: XCircle,
    color: 'rose',
    border: 'border-rose-500/30',
    bg: 'bg-rose-500/10',
    text: 'text-rose-400',
    dot: 'bg-rose-400',
    badge: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
    glow: 'shadow-[0_0_15px_rgba(244,63,94,0.2)]',
  },
  WARN: {
    icon: AlertTriangle,
    color: 'amber',
    border: 'border-amber-500/30',
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    dot: 'bg-amber-400',
    badge: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    glow: 'shadow-[0_0_15px_rgba(245,158,11,0.15)]',
  },
  WARNING: {
    icon: AlertTriangle,
    color: 'amber',
    border: 'border-amber-500/30',
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    dot: 'bg-amber-400',
    badge: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    glow: 'shadow-[0_0_15px_rgba(245,158,11,0.15)]',
  },
  INFO: {
    icon: Info,
    color: 'cyan',
    border: 'border-cyan-500/30',
    bg: 'bg-cyan-500/10',
    text: 'text-cyan-400',
    dot: 'bg-cyan-400',
    badge: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
    glow: '',
  },
};
const FALLBACK_SEV = SEVERITY_CONFIG.WARN;

const generateMockAnomalies = () => [
  { id: 'a1', severity: 'CRITICAL', type: 'HIGH_LATENCY', service: 'payment-service', message: 'P99 latency exceeded 2000ms threshold (actual: 2847ms)', timestamp: new Date(Date.now() - 45000).toISOString(), traceId: 'trace-ab3f12', latency: 2847 },
  { id: 'a2', severity: 'WARN', type: 'RETRY_AMPLIFICATION', service: 'order-service', message: 'Retry storm detected: 15 retries in 30s window from order-service → payment-service', timestamp: new Date(Date.now() - 120000).toISOString(), traceId: 'trace-cd5e78', retryCount: 15 },
  { id: 'a3', severity: 'CRITICAL', type: 'THREAD_TIMEOUT', service: 'inventory-service', message: 'ThreadPool exhausted — queue size 512, active threads 64/64', timestamp: new Date(Date.now() - 300000).toISOString(), traceId: 'trace-ef9012', threadCount: 64 },
  { id: 'a4', severity: 'INFO', type: 'CIRCUIT_OPEN', service: 'gateway-service', message: 'Circuit breaker OPEN for payment-service route after 5 failures', timestamp: new Date(Date.now() - 600000).toISOString(), traceId: 'trace-gh3456' },
  { id: 'a5', severity: 'WARN', type: 'MEMORY_PRESSURE', service: 'telemetry-service', message: 'Heap utilization at 87% — GC pause 340ms detected', timestamp: new Date(Date.now() - 900000).toISOString(), traceId: 'trace-ij7890' },
];

const AnomalyRow = ({ anomaly }) => {
  const [expanded, setExpanded] = React.useState(false);
  const sev = (anomaly.severity ?? 'INFO').toUpperCase();
  const cfg = SEVERITY_CONFIG[sev] ?? FALLBACK_SEV;
  const Icon = cfg.icon;

  const relativeTime = React.useMemo(() => {
    const diff = Date.now() - new Date(anomaly.timestamp).getTime();
    if (diff < 60000) return `${Math.floor(diff / 1000)}s ago`;
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    return `${Math.floor(diff / 3600000)}h ago`;
  }, [anomaly.timestamp]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      className={clsx(
        'border rounded-xl overflow-hidden transition-all duration-200',
        cfg.border,
        cfg.glow
      )}
    >
      <div
        className={clsx('flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-slate-800/30 transition-colors', cfg.bg)}
        onClick={() => setExpanded(!expanded)}
      >
        <Icon size={16} className={clsx('flex-shrink-0 mt-0.5', cfg.text)} />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={clsx('text-xs font-semibold px-1.5 py-0.5 rounded border', cfg.badge)}>
              {sev}
            </span>
            <span className="text-xs text-slate-300 font-mono truncate max-w-[160px]">
              {anomaly.type?.replace(/_/g, ' ')}
            </span>
            <span className="text-[10px] text-slate-500 font-mono ml-auto flex-shrink-0">
              {relativeTime}
            </span>
          </div>

          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed line-clamp-2">
            {anomaly.message ?? anomaly.details}
          </p>

          <div className="flex items-center gap-3 mt-2">
            <span className="text-[10px] font-mono text-slate-500">
              🔗 {anomaly.serviceName ?? anomaly.service ?? 'unknown-service'}
            </span>
            {anomaly.traceId && (
              <span className="text-[10px] font-mono text-cyan-500/70">
                #{anomaly.traceId.substring(0, 12)}
              </span>
            )}
          </div>
        </div>

        <button className="flex-shrink-0 p-1 text-slate-500 hover:text-slate-300 transition-colors">
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-4 py-3 border-t border-slate-700/30 bg-slate-900/50">
              <div className="grid grid-cols-2 gap-3 text-xs">
                {[
                  ['Trace ID', anomaly.traceId ?? 'N/A'],
                  ['Service', anomaly.serviceName ?? anomaly.service ?? 'N/A'],
                  ['Type', anomaly.type ?? 'N/A'],
                  ['Timestamp', anomaly.timestamp ? new Date(anomaly.timestamp).toLocaleString() : 'N/A'],
                  anomaly.latency && ['Latency', `${anomaly.latency}ms`],
                  anomaly.retryCount && ['Retry Count', anomaly.retryCount],
                  anomaly.threadCount && ['Active Threads', anomaly.threadCount],
                ].filter(Boolean).map(([k, v]) => (
                  <div key={k}>
                    <span className="text-slate-500">{k}: </span>
                    <span className="font-mono text-slate-300">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export const AnomalyTable = ({ data, loading, severityFilter }) => {
  const anomalies = React.useMemo(() => {
    const raw = (Array.isArray(data) ? data : data?.anomalies ?? generateMockAnomalies());
    if (!severityFilter || severityFilter === 'ALL') return raw;
    return raw.filter((a) => a.severity?.toUpperCase() === severityFilter);
  }, [data, severityFilter]);

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-slate-800/40 rounded-xl animate-pulse border border-slate-700/30" />
        ))}
      </div>
    );
  }

  if (anomalies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-slate-500">
        <Info size={32} className="mb-3 opacity-40" />
        <p className="text-sm">No anomalies detected</p>
        <p className="text-xs mt-1 text-slate-600">System operating within normal parameters</p>
      </div>
    );
  }

  return (
    <AnimatePresence mode="popLayout">
      <div className="space-y-2">
        {anomalies.map((anomaly, i) => (
          <AnomalyRow key={anomaly.id ?? i} anomaly={anomaly} />
        ))}
      </div>
    </AnimatePresence>
  );
};
