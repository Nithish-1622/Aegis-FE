import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
const generateMockLatency = (points = 20) => {
  const now = Date.now();
  return Array.from({ length: points }, (_, i) => ({
    time: new Date(now - (points - i) * 15000).toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }),
    p50: Math.floor(Math.random() * 40 + 15),
    p95: Math.floor(Math.random() * 120 + 60),
    p99: Math.floor(Math.random() * 300 + 150),
  }));
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900/95 border border-purple-500/30 rounded-xl px-3 py-2 shadow-xl">
      <p className="text-xs text-slate-400 font-mono mb-1">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2 text-xs">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-slate-300 uppercase text-[10px] font-mono">{entry.name}:</span>
          <span className="font-semibold text-white font-mono">{entry.value}ms</span>
        </div>
      ))}
    </div>
  );
};

export const LatencyDistributionChart = ({ data, loading }) => {
  const [chartData, setChartData] = React.useState(() => generateMockLatency());

  React.useEffect(() => {
    if (data && Array.isArray(data?.timestamps)) {
      const formatted = data.timestamps.map((t, idx) => {
        const val = data.latency?.[idx] ?? 0;
        return {
          time: new Date(t).toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          }),
          p50: Math.floor(val * 0.7),
          p95: val,
          p99: Math.floor(val * 1.3),
        };
      });
      setChartData(formatted);
    } else if (data && Array.isArray(data) && data.length > 0) {
      setChartData(data);
    } else {
      const id = setInterval(() => {
        setChartData((prev) => {
          const p50 = Math.floor(Math.random() * 40 + 15);
          const p95 = Math.floor(Math.random() * 120 + 60);
          const p99 = Math.floor(Math.random() * 300 + 150);
          const newPoint = {
            time: new Date().toLocaleTimeString('en-US', {
              hour12: false,
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            }),
            p50,
            p95,
            p99,
          };
          return [...prev.slice(-19), newPoint];
        });
      }, 3000);
      return () => clearInterval(id);
    }
  }, [data]);

  return (
    <div className="bg-slate-950/80 border border-slate-800 p-6 rounded-xl shadow-2xl space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold uppercase text-white">Latency Distribution</h2>
          <p className="text-xs text-slate-400 mt-0.5 font-mono">P50 / P95 / P99 percentiles · ms</p>
        </div>
        <div className="flex items-center gap-4 font-mono">
          {[
            { label: 'P50', color: '#10b981' },
            { label: 'P95', color: '#8b5cf6' },
            { label: 'P99', color: '#ef4444' },
          ].map(({ label, color }) => (
            <div key={label} className="flex items-center gap-1.5 text-xs text-slate-400 font-bold uppercase">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
              {label}
            </div>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-rule)" opacity={0.3} />
          <XAxis
            dataKey="time"
            tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'var(--font-family-sans)' }}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fill: '#64748b', fontSize: 10, fontFamily: 'var(--font-family-sans)' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={200} stroke="var(--color-status-delayed)" strokeDasharray="4 4" label={{ value: 'SLA Limit', fill: 'var(--color-status-delayed)', fontSize: 9 }} />
          <Line type="monotone" dataKey="p50" stroke="var(--color-line-inventory)" strokeWidth={2} dot={false} activeDot={{ r: 3 }} />
          <Line type="monotone" dataKey="p95" stroke="var(--color-line-payment)" strokeWidth={2} dot={false} activeDot={{ r: 3 }} />
          <Line type="monotone" dataKey="p99" stroke="var(--color-status-cancelled)" strokeWidth={1.5} dot={false} strokeDasharray="4 2" activeDot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
