import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Send, AlertCircle, Activity, ShoppingCart, CheckCircle2, XCircle, Clock, Loader2 } from 'lucide-react';
import { GlassCard } from '../common/GlassCard';
import { JsonViewerModal } from '../common/JsonViewerModal';
import { pingTelemetry, traceTelemetry, triggerError, placeOrder } from '../../services/api';
import { clsx } from 'clsx';
import { toast } from 'sonner';

const ACTIONS = [
  {
    id: 'ping',
    label: 'Ping Telemetry',
    description: 'Emits REQUEST_STARTED to Kafka runtime.events',
    endpoint: 'GET /demo/ping',
    origin: 'Port 8085',
    color: 'cyan',
    Icon: Activity,
    fn: pingTelemetry,
  },
  {
    id: 'trace',
    label: 'Trace Request',
    description: 'Emits REQUEST_COMPLETED with latency breakdown',
    endpoint: 'GET /demo/trace',
    origin: 'Port 8085',
    color: 'emerald',
    Icon: Zap,
    fn: traceTelemetry,
  },
  {
    id: 'error',
    label: 'Trigger Error',
    description: 'Simulates exception → ERROR_OCCURRED to runtime.errors',
    endpoint: 'GET /demo/error',
    origin: 'Port 8085',
    color: 'rose',
    Icon: AlertCircle,
    fn: triggerError,
  },
  {
    id: 'order',
    label: 'Place Order',
    description: 'Multi-hop: Gateway → Order → Payment + Inventory',
    endpoint: 'POST /orders',
    origin: 'Port 8081',
    color: 'purple',
    Icon: ShoppingCart,
    fn: () => placeOrder({ item: 'laptop', quantity: 1, price: 1200.0 }),
  },
];

const COLOR_STYLES = {
  cyan: {
    card: 'border-cyan-500/20 hover:border-cyan-400/40 hover:shadow-[0_0_20px_rgba(0,240,255,0.12)]',
    icon: 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400',
    btn: 'bg-cyan-500/20 border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/30 hover:shadow-[0_0_12px_rgba(0,240,255,0.25)]',
    badge: 'bg-cyan-500/10 text-cyan-400',
    bar: 'bg-cyan-400',
  },
  emerald: {
    card: 'border-emerald-500/20 hover:border-emerald-400/40 hover:shadow-[0_0_20px_rgba(16,185,129,0.12)]',
    icon: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
    btn: 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/30 hover:shadow-[0_0_12px_rgba(16,185,129,0.25)]',
    badge: 'bg-emerald-500/10 text-emerald-400',
    bar: 'bg-emerald-400',
  },
  rose: {
    card: 'border-rose-500/20 hover:border-rose-400/40 hover:shadow-[0_0_20px_rgba(244,63,94,0.12)]',
    icon: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
    btn: 'bg-rose-500/20 border-rose-500/40 text-rose-400 hover:bg-rose-500/30 hover:shadow-[0_0_12px_rgba(244,63,94,0.25)]',
    badge: 'bg-rose-500/10 text-rose-400',
    bar: 'bg-rose-400',
  },
  purple: {
    card: 'border-purple-500/20 hover:border-purple-400/40 hover:shadow-[0_0_20px_rgba(168,85,247,0.12)]',
    icon: 'bg-purple-500/10 border-purple-500/30 text-purple-400',
    btn: 'bg-purple-500/20 border-purple-500/40 text-purple-400 hover:bg-purple-500/30 hover:shadow-[0_0_12px_rgba(168,85,247,0.25)]',
    badge: 'bg-purple-500/10 text-purple-400',
    bar: 'bg-purple-400',
  },
};

const RequestLog = ({ logs }) => {
  if (logs.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 text-slate-500 text-sm">
        No requests triggered yet
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-thin">
      <AnimatePresence mode="popLayout">
        {logs.slice().reverse().map((log, i) => (
          <motion.div
            key={log.id}
            layout
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            className={clsx(
              'flex items-start gap-3 p-3 rounded-xl border transition-all',
              log.success
                ? 'bg-emerald-500/5 border-emerald-500/20'
                : 'bg-rose-500/5 border-rose-500/20'
            )}
          >
            {log.loading ? (
              <Loader2 size={14} className="text-cyan-400 animate-spin flex-shrink-0 mt-0.5" />
            ) : log.success ? (
              <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0 mt-0.5" />
            ) : (
              <XCircle size={14} className="text-rose-400 flex-shrink-0 mt-0.5" />
            )}

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-200">{log.label}</span>
                <span className="text-[10px] font-mono text-slate-500">{log.endpoint}</span>
                {log.duration && (
                  <span className="text-[10px] font-mono text-slate-500 ml-auto">
                    <Clock size={9} className="inline mr-1" />{log.duration}ms
                  </span>
                )}
              </div>
              {log.error && (
                <p className="text-xs text-rose-400 mt-0.5 font-mono truncate">{log.error}</p>
              )}
              {log.status && (
                <span className="text-[10px] font-mono text-slate-500">HTTP {log.status}</span>
              )}
            </div>

            {log.data && (
              <button
                onClick={() => log.onViewJson && log.onViewJson(log.data, log.label)}
                className="text-[10px] text-cyan-400 hover:text-cyan-300 font-mono flex-shrink-0 px-2 py-1 rounded-lg border border-cyan-500/20 hover:border-cyan-500/40 transition-all"
              >
                JSON
              </button>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export const LiveTelemetryTriggerPanel = () => {
  const [logs, setLogs] = useState([]);
  const [loadingIds, setLoadingIds] = useState({});
  const [jsonModal, setJsonModal] = useState({ open: false, data: null, title: '' });
  const [orderPayload, setOrderPayload] = useState(JSON.stringify({ item: 'laptop', quantity: 1, price: 1200.0 }, null, 2));

  const handleAction = async (action) => {
    const startTime = Date.now();
    const logId = `${action.id}-${startTime}`;

    setLoadingIds((p) => ({ ...p, [action.id]: true }));

    const pendingLog = {
      id: logId,
      label: action.label,
      endpoint: action.endpoint,
      loading: true,
      success: false,
    };

    setLogs((p) => [pendingLog, ...p.slice(0, 49)]);

    try {
      let fn = action.fn;
      if (action.id === 'order') {
        try {
          const payload = JSON.parse(orderPayload);
          fn = () => placeOrder(payload);
        } catch {
          fn = action.fn;
        }
      }

      const res = await fn();
      const duration = Date.now() - startTime;

      setLogs((p) =>
        p.map((log) =>
          log.id === logId
            ? { ...log, loading: false, success: true, data: res.data, status: res.status, duration }
            : log
        )
      );

      toast.success(`${action.label} succeeded`, {
        description: `${action.endpoint} · ${duration}ms`,
      });
    } catch (err) {
      const duration = Date.now() - startTime;
      const errMsg = err.response?.data?.message ?? err.message ?? 'Request failed';

      setLogs((p) =>
        p.map((log) =>
          log.id === logId
            ? {
                ...log,
                loading: false,
                success: false,
                error: errMsg,
                data: err.response?.data,
                status: err.response?.status,
                duration,
              }
            : log
        )
      );

      toast.error(`${action.label} failed`, {
        description: errMsg,
      });
    } finally {
      setLoadingIds((p) => ({ ...p, [action.id]: false }));
    }
  };

  const openJson = (data, title) => {
    setJsonModal({ open: true, data, title: `${title} — Response` });
  };

  const logsWithCallback = logs.map((log) => ({ ...log, onViewJson: openJson }));

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {ACTIONS.map((action) => {
          const styles = COLOR_STYLES[action.color] ?? COLOR_STYLES.cyan;
          const isLoading = loadingIds[action.id];

          return (
            <div
              key={action.id}
              className={clsx(
                'bg-slate-900/60 backdrop-blur-md border rounded-2xl p-5 transition-all duration-300',
                styles.card
              )}
            >
              <div className="flex items-start gap-3 mb-4">
                <div className={clsx('p-2.5 rounded-xl border flex-shrink-0', styles.icon)}>
                  <action.Icon size={18} />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-slate-100">{action.label}</h3>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{action.description}</p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className={clsx('text-[10px] font-mono px-2 py-1 rounded-lg', styles.badge)}>
                  {action.endpoint}
                </div>
                <div className="text-[10px] text-slate-500 font-mono">{action.origin}</div>
              </div>

              {/* Order payload editor */}
              {action.id === 'order' && (
                <textarea
                  value={orderPayload}
                  onChange={(e) => setOrderPayload(e.target.value)}
                  className="w-full h-24 mb-3 p-2 text-[10px] font-mono bg-slate-800/60 border border-slate-700/50 rounded-xl text-slate-300 resize-none focus:outline-none focus:border-purple-500/50 scrollbar-thin"
                  spellCheck={false}
                />
              )}

              <button
                onClick={() => handleAction(action)}
                disabled={isLoading}
                className={clsx(
                  'w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all duration-200 active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed',
                  styles.btn
                )}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Sending…
                  </>
                ) : (
                  <>
                    <Send size={14} />
                    Trigger
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      {/* Activity Log */}
      <GlassCard glowColor="cyan">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title">Request Activity Log</h2>
          <div className="flex items-center gap-2">
            <div className="live-dot" />
            <span className="text-xs text-slate-400">Live</span>
            {logs.length > 0 && (
              <button
                onClick={() => setLogs([])}
                className="text-xs text-slate-500 hover:text-slate-300 ml-2 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>
        <RequestLog logs={logsWithCallback} />
      </GlassCard>

      <JsonViewerModal
        isOpen={jsonModal.open}
        onClose={() => setJsonModal({ open: false, data: null, title: '' })}
        title={jsonModal.title}
        data={jsonModal.data}
      />
    </>
  );
};
