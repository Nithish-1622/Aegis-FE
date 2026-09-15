import React from 'react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { MetricTile } from '../components/common/MetricTile';
import { HealthOverviewGrid } from '../components/dashboard/HealthOverviewGrid';
import { ThroughputChart } from '../components/dashboard/ThroughputChart';
import { LatencyDistributionChart } from '../components/dashboard/LatencyDistributionChart';
import { Activity, ShieldCheck, AlertOctagon, Cpu, Zap } from 'lucide-react';

const LINE_COLORS = {
  gateway: '#f59e0b',
  order: '#3b82f6',
  payment: '#8b5cf6',
  inventory: '#10b981',
};

const mapStatusToText = (line, healthData) => {
  if (!healthData || !Array.isArray(healthData)) return `${line} line: good service`;
  const service = healthData.find(s => s.serviceName?.toLowerCase().includes(line));
  if (!service) return `${line} line: good service`;
  const s = service.status?.toUpperCase() ?? 'HEALTHY';
  if (['DOWN', 'ERROR', 'CRITICAL', 'FAILED', 'CANCELLED'].includes(s)) {
    return `${line} line: cancelled service - ${service.slaBreachCount ?? 0} disruptions`;
  }
  if (['WARN', 'WARNING', 'DEGRADED', 'RETRY', 'DELAYED'].includes(s)) {
    return `${line} line: minor delays - ${service.slaBreachCount ?? 0} breaches`;
  }
  return `${line} line: good service`;
};

const getStatusColorClass = (statusText) => {
  if (statusText.includes('cancelled')) return 'text-rose-400';
  if (statusText.includes('delays')) return 'text-amber-400';
  return 'text-emerald-400';
};

const generateFallbackChartData = () => {
  return Array.from({ length: 10 }, (_, i) => ({
    time: i,
    value: Math.floor(Math.random() * 40 + 10),
  }));
};

const LineStatusTickerRow = ({ line, colorClass, healthData, trendsData }) => {
  const statusText = mapStatusToText(line, healthData);
  const color = LINE_COLORS[line];

  const chartPoints = React.useMemo(() => {
    if (!trendsData) return generateFallbackChartData();
    const points = trendsData.timestamps?.map((t, idx) => ({
      time: idx,
      value: trendsData.throughput?.[idx] ?? 0,
    })) ?? [];
    return points.length > 0 ? points : generateFallbackChartData();
  }, [trendsData]);

  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-800/80 gap-4">
      {/* Route badge indicator */}
      <div className="flex items-center gap-3">
        <span className={`w-3 h-3 rounded-full ${colorClass}`} />
        <span className={`text-xs font-bold uppercase tracking-wide font-mono ${getStatusColorClass(statusText)}`}>
          {statusText}
        </span>
      </div>

      {/* Embedded ridership trend style sparkline */}
      <div className="w-32 h-8">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartPoints} margin={{ top: 2, right: 2, left: 2, bottom: 2 }}>
            <defs>
              <linearGradient id={`grad-${line}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.2} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={1.5}
              fill={`url(#grad-${line})`}
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export const ConcoursePage = ({ healthData, dashboardTrends }) => {
  return (
    <div className="space-y-6 animate-fade-in font-sans">
      
      {/* Overview Command Center Header Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricTile
          label="Overall Runtime Health"
          value="OPERATIONAL"
          unit=""
          context="4 / 4 Microservices Active"
          status="success"
          trend="up"
          trendValue="99.99%"
        />
        <MetricTile
          label="Avg P95 Latency"
          value="24.8"
          unit="ms"
          context="Within SLA threshold (< 50ms)"
          status="normal"
          trend="down"
          trendValue="-2.4ms"
        />
        <MetricTile
          label="Live Throughput"
          value="4,820"
          unit="req/sec"
          context="Kafka Disruptor Ring Buffer 12%"
          status="normal"
          trend="up"
          trendValue="+14%"
        />
        <MetricTile
          label="Active Incidents"
          value="0"
          unit="alerts"
          context="Zero critical SLA breaches"
          status="success"
          trend="neutral"
          trendValue="Clean"
        />
      </div>

      {/* Microservice Health Grid */}
      <HealthOverviewGrid data={healthData} />

      {/* Line Status Information & Ticker Panel */}
      <div className="bg-slate-950/80 border border-slate-800 p-6 rounded-xl shadow-2xl space-y-4">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-800 flex items-center justify-between font-mono">
          <span>SERVICE LINE TICKER & REAL-TIME INCIDENT STATUS</span>
          <span className="font-mono text-cyan-400">● LIVE POLLING 3s</span>
        </h2>
        <div className="space-y-1">
          <LineStatusTickerRow line="gateway" colorClass="bg-amber-400" healthData={healthData} trendsData={dashboardTrends} />
          <LineStatusTickerRow line="order" colorClass="bg-blue-500" healthData={healthData} trendsData={dashboardTrends} />
          <LineStatusTickerRow line="payment" colorClass="bg-purple-500" healthData={healthData} trendsData={dashboardTrends} />
          <LineStatusTickerRow line="inventory" colorClass="bg-emerald-500" healthData={healthData} trendsData={dashboardTrends} />
        </div>
      </div>

      {/* Visualization Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ThroughputChart data={dashboardTrends} />
        <LatencyDistributionChart data={dashboardTrends} />
      </div>
    </div>
  );
};
