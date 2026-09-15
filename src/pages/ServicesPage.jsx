import React, { useState } from 'react';
import { useRuntimeHealth } from '../services/useTelemetryStore';
import { StatusIndicator } from '../components/common/StatusIndicator';
import { MetricTile } from '../components/common/MetricTile';
import { Server, Cpu, Database, Activity, RefreshCw, Search, ArrowRight, ExternalLink } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const SERVICES_STATIC = [
  {
    serviceName: 'gateway-service',
    line: 'gateway',
    type: 'Edge API Gateway',
    status: 'HEALTHY',
    latencyP95: 14,
    latencyP99: 28,
    activeThreads: '24 / 200',
    slaBreachCount: 0,
    endpoints: ['GET /api/v1/checkout', 'POST /orders', 'GET /demo/ping'],
    version: 'v1.4.2',
  },
  {
    serviceName: 'order-service',
    line: 'order',
    type: 'Spring Boot AOP Processor',
    status: 'HEALTHY',
    latencyP95: 42,
    latencyP99: 110,
    activeThreads: '48 / 200',
    slaBreachCount: 1,
    endpoints: ['/orders/process', '/orders/validate', 'GET /demo/trace'],
    version: 'v2.1.0',
  },
  {
    serviceName: 'payment-service',
    line: 'payment',
    type: 'External Payment Gateway',
    status: 'DEGRADED',
    latencyP95: 185,
    latencyP99: 420,
    activeThreads: '112 / 200',
    slaBreachCount: 5,
    endpoints: ['/payments/charge', '/payments/refund', 'GET /demo/error'],
    version: 'v1.0.8',
  },
  {
    serviceName: 'inventory-service',
    line: 'inventory',
    type: 'Kafka Async Consumer',
    status: 'HEALTHY',
    latencyP95: 18,
    latencyP99: 35,
    activeThreads: '12 / 64',
    slaBreachCount: 0,
    endpoints: ['/inventory/reserve', '/inventory/check'],
    version: 'v1.9.4',
  },
  {
    serviceName: 'telemetry-service',
    line: 'telemetry',
    type: 'Disruptor Collector Engine',
    status: 'HEALTHY',
    latencyP95: 4,
    latencyP99: 9,
    activeThreads: '8 / 32',
    slaBreachCount: 0,
    endpoints: ['/api-telemetry/spans', '/actuator/health'],
    version: 'v0.1.0-SNAPSHOT',
  },
];

export const ServicesPage = () => {
  const { data: healthData, isLoading, refetch } = useRuntimeHealth();
  const [filterQuery, setFilterQuery] = useState('');

  const services = React.useMemo(() => {
    if (Array.isArray(healthData) && healthData.length > 0) {
      return healthData;
    }
    return SERVICES_STATIC;
  }, [healthData]);

  const filtered = services.filter((s) =>
    (s.serviceName ?? s.service ?? s.name ?? '').toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in font-sans">
      
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white uppercase tracking-tight font-sans">
            Runtime Services & Microservice Operational View
          </h1>
          <p className="text-xs text-slate-400 font-mono">
            Active instances, P95/P99 latency distribution, SLA breach counters, and Spring Boot Actuator states.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-slate-500" size={14} />
            <input
              type="text"
              placeholder="Filter services..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="pl-9 pr-4 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-cyan-500 w-56 font-mono"
            />
          </div>

          <button
            onClick={() => refetch()}
            className="p-2 border border-slate-800 bg-slate-900 text-slate-300 hover:border-cyan-500/40 rounded-lg cursor-pointer transition-colors"
          >
            <RefreshCw size={14} className={isLoading ? 'animate-spin text-cyan-400' : ''} />
          </button>
        </div>
      </div>

      {/* Overview Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <MetricTile label="Total Services" value={services.length} unit="active" context="All systems online" status="normal" />
        <MetricTile label="Healthy Count" value={services.filter(s => (s.status ?? 'UP') === 'UP' || s.status === 'HEALTHY').length} unit="services" status="success" />
        <MetricTile label="Degraded Count" value={services.filter(s => s.status === 'DEGRADED' || s.status === 'WARN').length} unit="services" status="warn" />
        <MetricTile label="Total SLA Breaches" value={services.reduce((acc, s) => acc + (s.slaBreachCount || 0), 0)} unit="incidents" status="error" />
      </div>

      {/* Microservice Operational Table */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900/90 text-slate-400 font-mono uppercase text-[10px] tracking-wider border-b border-slate-800">
            <tr>
              <th className="px-4 py-3">Service Name</th>
              <th className="px-4 py-3">Type / Role</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Latency P95</th>
              <th className="px-4 py-3">Latency P99</th>
              <th className="px-4 py-3">Thread Pool</th>
              <th className="px-4 py-3">SLA Breaches</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-sans">
            {filtered.map((svc, i) => {
              const name = svc.serviceName ?? svc.service ?? svc.name ?? `Service-${i}`;
              const status = svc.status ?? 'HEALTHY';
              const p95 = svc.latencyP95 ?? svc.latency ?? 24;
              const p99 = svc.latencyP99 ?? Math.round(p95 * 1.5);

              return (
                <tr key={i} className="hover:bg-slate-900/40 transition-colors">
                  <td className="px-4 py-3.5 font-mono font-bold text-white">
                    <div className="flex items-center gap-2">
                      <Server size={14} className="text-cyan-400" />
                      <span>{name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-slate-400">
                    <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 text-[10px] font-mono border border-slate-800">
                      {svc.type || 'Spring Boot Microservice'}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <StatusIndicator status={status} />
                  </td>
                  <td className="px-4 py-3.5 font-mono font-bold text-cyan-300">
                    {p95} ms
                  </td>
                  <td className="px-4 py-3.5 font-mono font-bold text-purple-300">
                    {p99} ms
                  </td>
                  <td className="px-4 py-3.5 font-mono text-slate-400">
                    {svc.activeThreads || '18 / 200'}
                  </td>
                  <td className="px-4 py-3.5 font-mono font-bold">
                    <span className={svc.slaBreachCount > 0 ? 'text-rose-400' : 'text-slate-500'}>
                      {svc.slaBreachCount ?? 0}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <NavLink
                      to="/timelines"
                      className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-cyan-400 hover:underline cursor-pointer"
                    >
                      Inspect Traces <ArrowRight size={12} />
                    </NavLink>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
};
