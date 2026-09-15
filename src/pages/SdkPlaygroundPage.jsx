import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Zap, 
  Sliders, 
  Activity, 
  RefreshCw, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  ChevronDown, 
  ChevronRight,
  Database,
  Globe,
  Cpu
} from 'lucide-react';
import { toast } from 'sonner';

const SERVICES = ['gateway-service', 'order-service', 'payment-service', 'inventory-service'];
const HTTP_METHODS = ['GET', 'POST', 'PUT', 'DELETE'];

export const SdkPlaygroundPage = () => {
  const [spans, setSpans] = useState([]);
  const [latency, setLatency] = useState(120);
  const [failureRate, setFailureRate] = useState(5);
  const [selectedService, setSelectedService] = useState('gateway-service');
  const [isStreaming, setIsStreaming] = useState(false);
  const [expandedSpanId, setExpandedSpanId] = useState(null);

  // Helper to generate a random trace span
  const generateSpan = (overrideStatus = null, parentId = null) => {
    const isError = overrideStatus === 'ERROR' || Math.random() * 100 < failureRate;
    const isWarn = !isError && Math.random() > 0.8;
    const status = isError ? 'ERROR' : isWarn ? 'WARN' : 'SUCCESS';
    const method = HTTP_METHODS[Math.floor(Math.random() * HTTP_METHODS.length)];
    const duration = Math.round(latency + (Math.random() * 80 - 40));

    const traceId = 'aegis-' + Math.random().toString(36).substring(2, 11);
    const spanId = 'span-' + Math.random().toString(36).substring(2, 8);

    const endpoints = {
      'gateway-service': '/api/v1/checkout',
      'order-service': '/orders/process',
      'payment-service': '/payments/charge',
      'inventory-service': '/inventory/reserve'
    };

    return {
      traceId,
      spanId,
      parentSpanId: parentId || '00000000',
      serviceName: selectedService,
      endpoint: endpoints[selectedService] || '/api/resource',
      method,
      durationMs: Math.max(10, duration),
      status,
      statusCode: isError ? 500 : isWarn ? 429 : 200,
      timestamp: new Date().toISOString(),
      attributes: {
        'http.user_agent': 'Mozilla/5.0 (Aegis-Telemetry-SDK/v0.1.0-SNAPSHOT)',
        'db.connection_time_ms': (Math.random() * 5).toFixed(2),
        'thread.name': 'http-nio-8080-exec-' + Math.floor(Math.random() * 10),
        'aegis.disruptor.ring_buffer_usage': '12%'
      }
    };
  };

  const handleEmitSpan = () => {
    const newSpan = generateSpan();
    setSpans((prev) => [newSpan, ...prev].slice(0, 50));
    toast.success(`Emitted span for ${newSpan.serviceName}`);
  };

  const handleEmitBurst = () => {
    const burst = Array.from({ length: 20 }, () => generateSpan());
    setSpans((prev) => [...burst, ...prev].slice(0, 50));
    toast.success('Emitted burst of 20 spans across services!');
  };

  const handleInjectFailure = () => {
    const errorSpan = generateSpan('ERROR');
    setSpans((prev) => [errorSpan, ...prev].slice(0, 50));
    toast.error(`Injected 500 Internal Server Error span on ${errorSpan.serviceName}`);
  };

  const handleClear = () => {
    setSpans([]);
    toast.info('Cleared span console.');
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 rounded-xl p-6 border border-slate-800 shadow-2xl space-y-8 animate-fade-in font-sans">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
            <Play className="text-cyan-400" size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white uppercase tracking-tight">Interactive Telemetry Playground</h1>
            <p className="text-xs text-slate-400">Simulate live span generation, adjust network latency injection, and inspect trace context carriers.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleClear}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-rose-500/50 text-slate-400 hover:text-rose-400 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Trash2 size={14} />
            Clear Feed
          </button>
        </div>
      </div>

      {/* Control Panel Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Service Selector */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
          <label className="text-xs font-mono text-slate-400 uppercase font-bold flex items-center gap-2">
            <Globe size={14} className="text-cyan-400" />
            Select Microservice Target
          </label>
          <select
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-cyan-300 focus:outline-none focus:border-cyan-500"
          >
            {SERVICES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Latency Slider */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="flex justify-between items-center text-xs font-mono font-bold">
            <span className="text-slate-400 flex items-center gap-2">
              <Sliders size={14} className="text-purple-400" />
              Latency Injection
            </span>
            <span className="text-purple-300 font-mono">{latency} ms</span>
          </div>
          <input
            type="range"
            min="10"
            max="2000"
            step="10"
            value={latency}
            onChange={(e) => setLatency(Number(e.target.value))}
            className="w-full accent-purple-500 bg-slate-950 rounded cursor-pointer"
          />
        </div>

        {/* Failure Rate Slider */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="flex justify-between items-center text-xs font-mono font-bold">
            <span className="text-slate-400 flex items-center gap-2">
              <AlertTriangle size={14} className="text-rose-400" />
              Failure Rate Target
            </span>
            <span className="text-rose-400 font-mono">{failureRate}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={failureRate}
            onChange={(e) => setFailureRate(Number(e.target.value))}
            className="w-full accent-rose-500 bg-slate-950 rounded cursor-pointer"
          />
        </div>

      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-4">
        <button
          onClick={handleEmitSpan}
          className="px-4 py-2.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
        >
          <Zap size={15} />
          Emit Single Span
        </button>
        <button
          onClick={handleEmitBurst}
          className="px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-purple-500/50 hover:bg-slate-800 text-slate-200 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
        >
          <Activity size={15} className="text-purple-400" />
          Simulate Burst Traffic (20 Spans)
        </button>
        <button
          onClick={handleInjectFailure}
          className="px-4 py-2.5 rounded-lg bg-rose-500/10 border border-rose-500/40 hover:bg-rose-500/20 text-rose-300 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
        >
          <AlertTriangle size={15} className="text-rose-400" />
          Inject Network Failure
        </button>
      </div>

      {/* Live Span Console Feed */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-mono uppercase text-slate-400 font-bold tracking-wider">Live Span Streaming Feed</h3>
          <span className="text-[11px] font-mono text-slate-500">{spans.length} active spans recorded</span>
        </div>

        {spans.length === 0 ? (
          <div className="p-12 text-center border border-dashed border-slate-800 rounded-xl bg-slate-950/40 space-y-2">
            <Activity className="mx-auto text-slate-600 animate-pulse" size={32} />
            <p className="text-xs text-slate-400 font-mono">No telemetry spans emitted yet. Click "Emit Single Span" or "Simulate Burst Traffic" to start.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {spans.map((span) => {
              const isExpanded = expandedSpanId === span.spanId;
              return (
                <div
                  key={span.spanId}
                  className={`p-3 rounded-lg border transition-all ${
                    span.status === 'ERROR'
                      ? 'bg-rose-950/20 border-rose-500/40'
                      : span.status === 'WARN'
                      ? 'bg-amber-950/20 border-amber-500/40'
                      : 'bg-slate-900/60 border-slate-800 hover:border-cyan-500/30'
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setExpandedSpanId(isExpanded ? null : span.spanId)}
                        className="text-slate-500 hover:text-slate-300 cursor-pointer"
                      >
                        {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      </button>

                      {/* Status Icon */}
                      {span.status === 'ERROR' ? (
                        <XCircle size={16} className="text-rose-400" />
                      ) : span.status === 'WARN' ? (
                        <AlertTriangle size={16} className="text-amber-400" />
                      ) : (
                        <CheckCircle2 size={16} className="text-emerald-400" />
                      )}

                      {/* Method & Endpoint */}
                      <span className="px-2 py-0.5 rounded bg-slate-800 font-bold text-[10px] text-cyan-300">
                        {span.method}
                      </span>
                      <span className="font-bold text-white">{span.endpoint}</span>
                      <span className="text-[10px] text-slate-500">[{span.serviceName}]</span>
                    </div>

                    <div className="flex items-center gap-4 text-[11px]">
                      <span className="text-slate-400">
                        Trace: <code className="text-cyan-400">{span.traceId}</code>
                      </span>
                      <span className="text-emerald-400 font-bold">{span.durationMs} ms</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          span.statusCode >= 500
                            ? 'bg-rose-500/20 text-rose-300'
                            : span.statusCode >= 400
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-emerald-500/20 text-emerald-300'
                        }`}
                      >
                        {span.statusCode}
                      </span>
                    </div>
                  </div>

                  {/* Expanded JSON Attributes */}
                  {isExpanded && (
                    <div className="mt-3 pt-3 border-t border-slate-800 text-[11px] font-mono bg-slate-950 p-3 rounded text-slate-300 space-y-1">
                      <div className="text-[10px] text-slate-500 uppercase font-bold">Span Context Attributes</div>
                      <pre className="text-cyan-200 overflow-x-auto">
                        {JSON.stringify(span, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
