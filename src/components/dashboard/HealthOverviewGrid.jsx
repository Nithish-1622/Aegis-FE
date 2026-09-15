import React from 'react';
import { GlassCard } from '../common/GlassCard';
import { StatusBadge } from '../common/StatusBadge';
import { Server, Activity, Cpu, Database } from 'lucide-react';
import { clsx } from 'clsx';

const SERVICE_ICONS = {
  gateway: Server,
  order: Database,
  payment: Activity,
  inventory: Cpu,
  default: Server,
};

const mockFallback = [
  { service: 'gateway-service', status: 'UP', latency: '--', uptime: '--' },
  { service: 'order-service', status: 'UP', latency: '--', uptime: '--' },
  { service: 'payment-service', status: 'UP', latency: '--', uptime: '--' },
  { service: 'inventory-service', status: 'UP', latency: '--', uptime: '--' },
  { service: 'telemetry-service', status: 'UP', latency: '--', uptime: '--' },
];

export const HealthOverviewGrid = ({ data, loading }) => {
  const services = Array.isArray(data) ? data : mockFallback;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="section-title">Service Health Grid</h2>
        <span className="text-xs text-slate-500 font-mono">Updated 3s ago</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
        {services.map((svc, i) => {
          const serviceNameField = svc.serviceName ?? svc.service ?? svc.name ?? '';
          const key = Object.keys(SERVICE_ICONS).find((k) =>
            serviceNameField.toLowerCase().includes(k)
          ) ?? 'default';
          const Icon = SERVICE_ICONS[key];
          const statusKey = (svc.status ?? 'HEALTHY').toUpperCase();
          const isHealthy = ['UP', 'HEALTHY', 'OK', 'RUNNING', 'SUCCESS'].includes(statusKey);
          const isWarn = ['WARN', 'WARNING', 'DEGRADED', 'RETRY'].includes(statusKey);

          return (
            <GlassCard
              key={i}
              glowColor={isHealthy ? 'emerald' : isWarn ? 'amber' : 'rose'}
              className="relative overflow-hidden"
            >
              {/* Status bar */}
              <div
                className={clsx(
                  'absolute top-0 left-0 right-0 h-0.5',
                  isHealthy ? 'bg-emerald-400/70' : isWarn ? 'bg-amber-400/70' : 'bg-rose-400/70'
                )}
              />

              <div className="flex flex-col items-center text-center gap-3 py-2">
                <div
                  className={clsx(
                    'p-3 rounded-xl border',
                    isHealthy
                      ? 'bg-emerald-500/10 border-emerald-500/30'
                      : isWarn
                      ? 'bg-amber-500/10 border-amber-500/30'
                      : 'bg-rose-500/10 border-rose-500/30'
                  )}
                >
                  <Icon
                    size={20}
                    className={
                      isHealthy ? 'text-emerald-400' : isWarn ? 'text-amber-400' : 'text-rose-400'
                    }
                  />
                </div>

                <div>
                  <p className="text-xs font-medium text-slate-200 truncate max-w-[120px]">
                    {svc.serviceName ?? svc.service ?? svc.name ?? `Service ${i + 1}`}
                  </p>
                  {svc.slaBreachCount !== undefined && (
                    <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                      Breaches: {svc.slaBreachCount}
                    </p>
                  )}
                  {svc.latency && svc.latency !== '--' && (
                    <p className="text-[10px] text-slate-500 font-mono mt-0.5">{svc.latency}ms</p>
                  )}
                </div>

                <StatusBadge status={svc.status ?? 'HEALTHY'} showDot />
              </div>
            </GlassCard>
          );
        })}
      </div>
    </div>
  );
};
