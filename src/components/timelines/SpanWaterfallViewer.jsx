import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ChevronRight, Clock, Tag } from 'lucide-react';
import { clsx } from 'clsx';

const STATUS_COLORS = {
  SUCCESS: { bar: 'bg-emerald-500', text: 'text-emerald-400', badge: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
  ERROR: { bar: 'bg-rose-500', text: 'text-rose-400', badge: 'bg-rose-500/15 text-rose-400 border-rose-500/30' },
  RETRY: { bar: 'bg-amber-500', text: 'text-amber-400', badge: 'bg-amber-500/15 text-amber-400 border-amber-500/30' },
  RUNNING: { bar: 'bg-cyan-500', text: 'text-cyan-400', badge: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30' },
  TIMEOUT: { bar: 'bg-rose-500', text: 'text-rose-400', badge: 'bg-rose-500/15 text-rose-400 border-rose-500/30' },
  default: { bar: 'bg-slate-500', text: 'text-slate-400', badge: 'bg-slate-500/15 text-slate-400 border-slate-500/30' },
};

const SpanBar = ({ span, maxDuration, startOffset = 0, depth = 0, totalWidth = 100 }) => {
  const [expanded, setExpanded] = React.useState(true);
  const status = span.status?.toUpperCase() ?? 'SUCCESS';
  const colors = STATUS_COLORS[status] ?? STATUS_COLORS.default;
  const hasChildren = span.children?.length > 0;

  const spanDuration = span.duration ?? span.durationMs ?? 0;
  const spanStart = span.startOffset ?? span.relativeStart ?? startOffset;
  const barWidth = Math.max((spanDuration / maxDuration) * 60, 0.5);
  const barLeft = (spanStart / maxDuration) * 60;

  return (
    <div className="select-none">
      <motion.div
        initial={{ opacity: 0, x: -4 }}
        animate={{ opacity: 1, x: 0 }}
        className="group flex items-center gap-2 py-1 px-2 rounded-lg hover:bg-slate-800/40 transition-all cursor-pointer"
        onClick={() => hasChildren && setExpanded(!expanded)}
      >
        {/* Indent + expand toggle */}
        <div className="flex items-center flex-shrink-0" style={{ paddingLeft: `${depth * 16}px`, width: `${180 + depth * 16}px` }}>
          <span className="text-slate-600 mr-1 flex-shrink-0">
            {hasChildren ? (
              expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />
            ) : (
              <span className="w-3 inline-block" />
            )}
          </span>
          <div className="flex flex-col min-w-0">
            <span className="text-xs font-medium text-slate-200 truncate">
              {span.operationName ?? span.service ?? span.name ?? 'span'}
            </span>
            <span className="text-[10px] font-mono text-slate-500 truncate">
              {span.service ?? span.component ?? ''}
            </span>
          </div>
        </div>

        {/* Waterfall bar */}
        <div className="flex-1 relative h-5 flex items-center">
          <div className="absolute inset-0 opacity-5 bg-slate-400 rounded" />
          <motion.div
            className={clsx('absolute h-3.5 rounded', colors.bar)}
            style={{
              left: `${Math.min(barLeft, 95)}%`,
              width: `${Math.min(barWidth, 100 - barLeft)}%`,
              opacity: 0.85,
            }}
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.4, ease: 'easeOut', delay: depth * 0.05 }}
          />
        </div>

        {/* Duration */}
        <div className="flex items-center gap-2 flex-shrink-0 w-28 justify-end">
          <span
            className={clsx('text-[10px] px-1.5 py-0.5 rounded border font-mono', colors.badge)}
          >
            {status}
          </span>
          <span className="text-xs font-mono text-slate-400 min-w-[50px] text-right">
            {spanDuration}ms
          </span>
        </div>
      </motion.div>

      {/* Children */}
      {expanded && hasChildren && (
        <div>
          {span.children.map((child, i) => (
            <SpanBar
              key={child.spanId ?? child.id ?? i}
              span={child}
              maxDuration={maxDuration}
              startOffset={spanStart}
              depth={depth + 1}
              totalWidth={totalWidth}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const generateMockTimeline = () => {
  const traceId = `trace-${Math.random().toString(36).substring(2, 10)}`;
  return {
    traceId,
    service: 'gateway-service',
    duration: 342,
    status: 'SUCCESS',
    spans: [
      {
        spanId: 'span-001',
        operationName: 'HTTP POST /orders',
        service: 'gateway-service',
        duration: 342,
        status: 'SUCCESS',
        startOffset: 0,
        children: [
          {
            spanId: 'span-002',
            operationName: 'OrderService.createOrder()',
            service: 'order-service',
            duration: 280,
            status: 'SUCCESS',
            startOffset: 20,
            children: [
              {
                spanId: 'span-003',
                operationName: 'InventoryService.reserve()',
                service: 'inventory-service',
                duration: 145,
                status: 'SUCCESS',
                startOffset: 40,
                children: [],
              },
              {
                spanId: 'span-004',
                operationName: 'PaymentService.charge()',
                service: 'payment-service',
                duration: 98,
                status: 'SUCCESS',
                startOffset: 195,
                children: [],
              },
            ],
          },
          {
            spanId: 'span-005',
            operationName: 'Kafka.publish(runtime.events)',
            service: 'telemetry-service',
            duration: 15,
            status: 'SUCCESS',
            startOffset: 320,
            children: [],
          },
        ],
      },
    ],
  };
};

export const SpanWaterfallViewer = ({ data, loading }) => {
  const [selectedTrace, setSelectedTrace] = React.useState(null);

  const timelines = React.useMemo(() => {
    // If we have flat span list from API, group them by traceId and build nested hierarchy
    if (data && Array.isArray(data) && data.length > 0 && data[0].spanId) {
      // Group by traceId
      const tracesMap = {};
      data.forEach(span => {
        const tId = span.traceId ?? 'unknown-trace';
        if (!tracesMap[tId]) {
          tracesMap[tId] = [];
        }
        tracesMap[tId].push(span);
      });

      return Object.entries(tracesMap).map(([traceId, spans]) => {
        // Build parent-child tree mapping
        const nodesMap = {};
        spans.forEach(s => {
          nodesMap[s.spanId] = {
            ...s,
            spanId: s.spanId,
            operationName: s.operationName ?? s.serviceName ?? 'span',
            service: s.serviceName ?? s.service ?? 'service',
            duration: s.latency ?? s.duration ?? 0,
            status: s.status ?? 'SUCCESS',
            children: []
          };
        });

        const roots = [];
        spans.forEach(s => {
          const node = nodesMap[s.spanId];
          if (s.parentSpanId && nodesMap[s.parentSpanId]) {
            nodesMap[s.parentSpanId].children.push(node);
          } else {
            roots.push(node);
          }
        });

        // Determine trace total duration (max span end)
        let totalDur = 0;
        spans.forEach(s => {
          const dur = s.latency ?? s.duration ?? 0;
          totalDur = Math.max(totalDur, dur);
        });

        return {
          traceId,
          service: roots[0]?.service ?? 'gateway-service',
          duration: totalDur,
          status: roots[0]?.status ?? 'SUCCESS',
          spans: roots
        };
      });
    }

    if (data && data.traces) {
      return data.traces;
    }
    return [generateMockTimeline(), generateMockTimeline(), generateMockTimeline()];
  }, [data]);

  const activeTrace = selectedTrace ?? timelines[0];

  const maxDuration = React.useMemo(() => {
    const getMax = (span) => {
      if (!span) return 0;
      const myEnd = (span.startOffset ?? 0) + (span.duration ?? 0);
      const childMax = (span.children ?? []).reduce((m, c) => Math.max(m, getMax(c)), 0);
      return Math.max(myEnd, childMax);
    };
    if (!activeTrace?.spans) return 1000;
    return Math.max(...activeTrace.spans.map(getMax), 1);
  }, [activeTrace]);

  return (
    <div className="flex gap-4 h-full">
      {/* Trace list */}
      <div className="w-64 flex-shrink-0 space-y-2">
        {timelines.map((trace, i) => (
          <button
            key={trace.traceId ?? i}
            onClick={() => setSelectedTrace(trace)}
            className={clsx(
              'w-full text-left p-3 rounded-xl border transition-all duration-200',
              activeTrace?.traceId === trace.traceId
                ? 'bg-cyan-500/10 border-cyan-500/40 shadow-[0_0_15px_rgba(0,240,255,0.1)]'
                : 'bg-slate-800/40 border-slate-700/30 hover:border-slate-600/50'
            )}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <Tag size={10} className="text-slate-400" />
              <span className="text-[10px] font-mono text-slate-400 truncate">
                {(trace.traceId ?? `trace-${i}`).substring(0, 16)}…
              </span>
            </div>
            <p className="text-xs font-medium text-slate-200 truncate">{trace.service ?? 'gateway-service'}</p>
            <div className="flex items-center gap-2 mt-1.5">
              <Clock size={9} className="text-slate-500" />
              <span className="text-[10px] font-mono text-slate-500">{trace.duration ?? '--'}ms</span>
              <span
                className={clsx(
                  'text-[9px] font-medium px-1.5 py-0.5 rounded border',
                  STATUS_COLORS[trace.status?.toUpperCase?.() ?? 'SUCCESS']?.badge ?? STATUS_COLORS.default.badge
                )}
              >
                {trace.status ?? 'SUCCESS'}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Waterfall panel */}
      <div className="flex-1 min-w-0 overflow-hidden">
        {activeTrace && (
          <>
            {/* Header row */}
            <div className="flex items-center gap-2 px-2 pb-2 mb-2 border-b border-slate-700/30 sticky top-0 bg-slate-900/50">
              <div style={{ width: '180px' }} className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                Span / Service
              </div>
              <div className="flex-1 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                Timeline (0 → {maxDuration}ms)
              </div>
              <div className="w-28 text-right text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                Status · Duration
              </div>
            </div>

            <div className="space-y-0.5 overflow-y-auto scrollbar-thin max-h-96">
              {(activeTrace.spans ?? []).map((span, i) => (
                <SpanBar
                  key={span.spanId ?? i}
                  span={span}
                  maxDuration={maxDuration}
                  depth={0}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
