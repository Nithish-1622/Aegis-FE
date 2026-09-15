import React, { useState } from 'react';
import { pingTelemetry, traceTelemetry, triggerError, placeOrder } from '../services/api';
import { toast } from 'sonner';

const SIMULATORS = [
  {
    id: 'ping',
    label: 'Dispatch on Gateway Line',
    endpoint: 'GET /demo/ping',
    color: 'border-l-amber-400 hover:bg-slate-900',
    fn: pingTelemetry,
    successWord: 'ON TIME',
    service: 'gateway',
  },
  {
    id: 'trace',
    label: 'Trace Request Journey',
    endpoint: 'GET /demo/trace',
    color: 'border-l-blue-500 hover:bg-slate-900',
    fn: traceTelemetry,
    successWord: 'ON TIME',
    service: 'order',
  },
  {
    id: 'error',
    label: 'Force a Cancellation',
    endpoint: 'GET /demo/error',
    color: 'border-l-rose-500 hover:bg-slate-900',
    fn: triggerError,
    successWord: 'CANCELLED',
    service: 'payment',
  },
  {
    id: 'order',
    label: 'Dispatch Multi-hop Order',
    endpoint: 'POST /orders',
    color: 'border-l-emerald-500 hover:bg-slate-900',
    fn: () => placeOrder({ item: 'laptop', quantity: 1, price: 1200.0 }),
    successWord: 'DELAYED',
    service: 'inventory',
  },
];

export const TelemetrySimulatorPage = ({ onDispatch }) => {
  const [loadingId, setLoadingId] = useState(null);

  const handleSimulate = async (sim) => {
    setLoadingId(sim.id);
    const startTime = Date.now();
    try {
      const res = await sim.fn();
      const dur = Date.now() - startTime;
      
      // Dispatch row to parent app state for live split-flap update
      onDispatch({
        id: `${sim.id}-${startTime}`,
        route: sim.service.toUpperCase(),
        origin: 'GATEWAY',
        destination: sim.service.toUpperCase(),
        status: sim.successWord,
        platform: res.data?.traceId ?? `T${Math.floor(Math.random()*90+10)}`,
      });

      toast.success(`${sim.label} succeeded`, {
        description: `HTTP ${res.status} · ${dur}ms`,
      });
    } catch (err) {
      const errMsg = err.response?.data?.message ?? err.message ?? 'Unknown disturbance';
      const traceId = err.response?.data?.traceId ?? `FAIL-${Math.floor(Math.random() * 90 + 10)}`;
      
      onDispatch({
        id: `${sim.id}-${startTime}`,
        route: sim.service.toUpperCase(),
        origin: 'GATEWAY',
        destination: sim.service.toUpperCase(),
        status: 'CANCELLED',
        platform: traceId,
      });

      toast.error(`${sim.label} failed`, {
        description: errMsg,
      });
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Signage panel info */}
      <div className="bg-slate-950/80 border border-slate-800 p-6 rounded-xl shadow-2xl space-y-2">
        <h2 className="text-xl font-bold uppercase tracking-tight text-white font-sans">
          Dispatch Control Desk
        </h2>
        <p className="text-xs text-slate-400 font-mono">
          REAL-TIME TELEMETRY EVENT SIMULATOR & SPLIT-FLAP DISPATCHER
        </p>
      </div>

      {/* Simulator buttons list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SIMULATORS.map((sim) => (
          <button
            key={sim.id}
            disabled={loadingId !== null}
            onClick={() => handleSimulate(sim)}
            className={`w-full text-left p-5 bg-slate-950/80 border border-slate-800 border-l-4 ${sim.color} transition-all rounded-xl cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed shadow-xl hover:border-slate-700`}
          >
            <h3 className="text-sm font-bold uppercase tracking-tight text-white font-sans">
              {sim.label}
            </h3>
            <span className="block text-[11px] font-mono text-cyan-400 mt-1">
              Endpoint: {sim.endpoint}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
