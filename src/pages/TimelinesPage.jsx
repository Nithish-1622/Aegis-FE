import React, { useState, useMemo } from 'react';
import { useTimelines } from '../services/useTelemetryStore';
import { Clock, AlertTriangle, CheckCircle2, Search } from 'lucide-react';

const mockTraces = [
  {
    traceId: 'T-982',
    service: 'gateway-service',
    status: 'SUCCESS',
    duration: 382,
    stops: [
      { station: 'Gateway Interchange', duration: 12, status: 'ON TIME' },
      { station: 'Order Station', duration: 140, status: 'ON TIME' },
      { station: 'Payment Terminus', duration: 230, status: 'ON TIME' },
    ],
  },
  {
    traceId: 'T-410',
    service: 'order-service',
    status: 'RETRY',
    duration: 610,
    stops: [
      { station: 'Gateway Interchange', duration: 20, status: 'ON TIME' },
      { station: 'Order Station', duration: 320, status: 'DELAYED', delayMsg: 'Retrying database connection (attempt 2)' },
      { station: 'Payment Terminus', duration: 270, status: 'ON TIME' },
    ],
  },
  {
    traceId: 'T-102',
    service: 'payment-service',
    status: 'ERROR',
    duration: 180,
    stops: [
      { station: 'Gateway Interchange', duration: 15, status: 'ON TIME' },
      { station: 'Order Station', duration: 165, status: 'CANCELLED', delayMsg: 'Payment gateway rejected request (500 Error)' },
    ],
  },
];

const parseLatency = (latency) => {
  if (!latency) return 0;
  if (typeof latency === 'number') return latency;
  if (typeof latency === 'object' && latency.seconds !== undefined) {
    return Math.round((latency.seconds * 1000) + (latency.nano / 1000000));
  }
  try {
    const match = latency.toString().match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?/);
    if (match) {
      const hours = parseFloat(match[1] || 0);
      const minutes = parseFloat(match[2] || 0);
      const seconds = parseFloat(match[3] || 0);
      return Math.round((hours * 3600 + minutes * 60 + seconds) * 1000);
    }
  } catch (e) {}
  return parseInt(latency) || 0;
};

export const TimelinesPage = () => {
  const [searchInput, setSearchInput] = useState('');
  const [activeTraceId, setActiveTraceId] = useState('T-982');
  const [selectedStop, setSelectedStop] = useState(null);

  const { data: timelinesData, isLoading, isError } = useTimelines(activeTraceId);

  const activeTrace = useMemo(() => {
    // If we have real timeline data from the backend, map it to the expected UI model
    if (timelinesData && timelinesData.timeline && timelinesData.timeline.length > 0) {
      const timelineEvents = timelinesData.timeline;
      const firstEvent = timelineEvents[0];
      
      const stops = timelineEvents.map(event => {
        let status = 'ON TIME';
        if (event.status === 'ERROR' || event.eventType === 'ERROR_OCCURRED') {
          status = 'CANCELLED';
        } else if (event.status === 'RETRY' || event.eventType === 'RETRY_TRIGGERED') {
          status = 'DELAYED';
        }

        return {
          station: event.serviceName || 'Unknown Service',
          duration: parseLatency(event.latency),
          status: status,
          delayMsg: event.payloadJson ? event.payloadJson : null,
          eventType: event.eventType,
          eventId: event.eventId,
          spanId: event.spanId,
          parentSpanId: event.parentSpanId,
          timestamp: event.timestamp,
        };
      });

      const hasError = timelineEvents.some(e => e.status === 'ERROR' || e.eventType === 'ERROR_OCCURRED');
      const hasRetry = timelineEvents.some(e => e.status === 'RETRY' || e.eventType === 'RETRY_TRIGGERED');
      
      return {
        traceId: timelinesData.traceId || activeTraceId,
        service: firstEvent.serviceName || 'telemetry-bootstrap',
        status: hasError ? 'ERROR' : hasRetry ? 'RETRY' : 'SUCCESS',
        duration: stops.reduce((acc, curr) => acc + curr.duration, 0),
        stops: stops,
      };
    }

    // Fallback to static mock traces if no data matches
    const mock = mockTraces.find(t => t.traceId === activeTraceId);
    return mock || mockTraces[0];
  }, [timelinesData, activeTraceId]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setActiveTraceId(searchInput.trim());
      setSelectedStop(null);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 items-start w-full animate-fade-in" style={{ minHeight: 'calc(100vh - 180px)' }}>
      {/* Sidebar List and Search */}
      <div className="w-full md:w-80 flex-shrink-0 bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-4 shadow-xl">
        <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
          Trace / Journey Lookup
        </h3>

        {/* Custom Search Input */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Paste Trace ID..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-8 pr-2 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded-lg text-cyan-300 font-mono focus:outline-none focus:border-cyan-500"
            />
            <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-500" />
          </div>
          <button
            type="submit"
            className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            Find
          </button>
        </form>

        <div className="border-t border-slate-800/80 pt-3">
          <h4 className="text-[10px] font-mono font-bold uppercase text-slate-500 tracking-wider mb-2">
            Preset Journeys
          </h4>
          <div className="space-y-2">
            {mockTraces.map((trace) => (
              <button
                key={trace.traceId}
                onClick={() => {
                  setActiveTraceId(trace.traceId);
                  setSearchInput(trace.traceId);
                  setSelectedStop(null);
                }}
                className={`w-full text-left p-3 border rounded-lg transition-colors flex justify-between items-center cursor-pointer ${
                  activeTraceId === trace.traceId
                    ? 'border-cyan-500/50 bg-cyan-500/10'
                    : 'border-slate-800 hover:border-slate-700 bg-slate-900/60'
                }`}
              >
                <div>
                  <span className="text-[10px] font-mono font-bold text-cyan-400">{trace.traceId}</span>
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-tight">
                    {trace.service}
                  </h4>
                </div>
                <span
                  className={`text-[8px] font-mono font-bold px-1.5 py-0.5 rounded border ${
                    trace.status === 'ERROR'
                      ? 'border-rose-500/40 text-rose-400 bg-rose-500/10'
                      : trace.status === 'RETRY'
                      ? 'border-amber-500/40 text-amber-400 bg-amber-500/10'
                      : 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10'
                  }`}
                >
                  {trace.status === 'ERROR' ? 'CANCELLED' : trace.status === 'RETRY' ? 'DELAYED' : 'ON TIME'}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Journey Detail and Waterfall View */}
      <div className="flex-1 w-full bg-slate-950/80 border border-slate-800 rounded-xl p-6 flex flex-col justify-between shadow-2xl">
        <div>
          <div className="flex justify-between items-center pb-3 border-b border-slate-800 mb-6">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">JOURNEY PLANNER</span>
            <span className="text-xs font-mono">
              Trace ID: <strong className="text-cyan-400">{activeTrace.traceId}</strong>
            </span>
          </div>

          {isLoading ? (
            <div className="py-20 text-center font-mono text-xs text-slate-400 animate-pulse">
              LOADING PHYSICAL SPANS FROM KAFKA ENGINE...
            </div>
          ) : isError ? (
            <div className="py-10 text-center text-xs text-rose-500 font-mono">
              [Disturbance] Failed to connect to Aegis-Runtime engine.
            </div>
          ) : (
            <>
              {/* Dynamic horizontal map view */}
              <div className="relative flex flex-wrap md:flex-nowrap justify-between items-center py-10 px-4 gap-6">
                {/* Track line (hidden on mobile layout wrap) */}
                <div className="hidden md:block absolute left-10 right-10 h-0.5 bg-slate-800 top-1/2 -translate-y-1/2" />

                {activeTrace.stops.map((stop, idx) => {
                  const isCancelled = stop.status === 'CANCELLED';
                  const isDelayed = stop.status === 'DELAYED';

                  return (
                    <div
                      key={idx}
                      onClick={() => setSelectedStop(stop)}
                      className="relative z-10 flex flex-col items-center cursor-pointer group flex-1 min-w-[120px]"
                    >
                      <div
                        className={`w-8 h-8 rounded-full border-2 bg-slate-950 flex items-center justify-center transition-transform group-hover:scale-110 ${
                          isCancelled
                            ? 'border-rose-500 text-rose-400 shadow-lg shadow-rose-500/20'
                            : isDelayed
                            ? 'border-amber-500 text-amber-400 shadow-lg shadow-amber-500/20'
                            : 'border-emerald-500 text-emerald-400 shadow-lg shadow-emerald-500/20'
                        }`}
                      >
                        {isCancelled ? (
                          <span className="text-xs font-bold">✕</span>
                        ) : isDelayed ? (
                          <span className="text-xs font-bold">!</span>
                        ) : (
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                        )}
                      </div>

                      <span className="text-xs font-bold uppercase tracking-tight text-slate-200 mt-3 text-center truncate max-w-[140px]">
                        {stop.station}
                      </span>

                      <span className="text-[10px] font-mono text-cyan-400 mt-1">
                        {stop.duration}ms latency
                      </span>

                      {stop.status !== 'ON TIME' && (
                        <span
                          className={`text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border mt-2 font-mono ${
                            isCancelled
                              ? 'border-rose-500/40 text-rose-400 bg-rose-500/10'
                              : 'border-amber-500/40 text-amber-400 bg-amber-500/10'
                          }`}
                        >
                          {stop.status}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Selected stop inspector dialog */}
        {selectedStop && (
          <div className="mt-8 border-t border-slate-800 pt-4 animate-fade-in font-mono">
            <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Span Specification Details</h4>
            <div className="bg-slate-900/80 p-4 border border-slate-800 rounded-lg text-xs text-slate-300 space-y-2">
              <div>
                <span className="text-slate-500 mr-2">Service:</span>
                <strong className="text-white">{selectedStop.station}</strong>
              </div>
              <div>
                <span className="text-slate-500 mr-2">Measured Latency:</span>
                <strong className="text-cyan-400">{selectedStop.duration} ms</strong>
              </div>
              {selectedStop.spanId && (
                <div>
                  <span className="text-slate-500 mr-2">Span ID:</span>
                  <span>{selectedStop.spanId}</span>
                </div>
              )}
              {selectedStop.delayMsg && (
                <div className="mt-2 border-t border-slate-800 pt-2">
                  <span className="text-rose-400 font-bold block mb-1">
                    Telemetry Event Payload:
                  </span>
                  <pre className="p-2 bg-slate-950 text-cyan-200 rounded overflow-x-auto text-[10px]">
                    {typeof selectedStop.delayMsg === 'string'
                      ? selectedStop.delayMsg
                      : JSON.stringify(selectedStop.delayMsg, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
