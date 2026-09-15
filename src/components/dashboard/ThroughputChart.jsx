import React from 'react';
import {AreaChart,Area,XAxis,YAxis,CartesianGrid,Tooltip,ResponsiveContainer,ReferenceLine,} from 'recharts';
const generateMockData = (points = 20) => {
  const now = Date.now();
  return Array.from({ length: points }, (_, i) => ({
    time: new Date(now - (points - i) * 15000).toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }),
    throughput: Math.floor(Math.random() * 80 + 20),
    errors: Math.floor(Math.random() * 8),
  }));
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900/95 border border-cyan-500/30 rounded-xl px-3 py-2 shadow-xl">
      <p className="text-xs text-slate-400 font-mono mb-1">{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2 text-xs">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-slate-300 capitalize">{entry.name}:</span>
          <span className="font-semibold text-white font-mono">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

export const ThroughputChart = ({ data, loading }) => {
  const [chartData, setChartData] = React.useState(() => generateMockData());

  React.useEffect(() => {
    if (data && Array.isArray(data?.timestamps)) {
      const formatted = data.timestamps.map((t, idx) => ({
        time: new Date(t).toLocaleTimeString('en-US', {
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }),
        throughput: data.throughput?.[idx] ?? 0,
        errors: data.errorCount?.[idx] ?? 0,
      }));
      setChartData(formatted);
    } else if (data && Array.isArray(data) && data.length > 0) {
      setChartData(data);
    } else {
      // Rolling mock data update
      const id = setInterval(() => {
        setChartData((prev) => {
          const newPoint = {
            time: new Date().toLocaleTimeString('en-US', {
              hour12: false,
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            }),
            throughput: Math.floor(Math.random() * 80 + 20),
            errors: Math.floor(Math.random() * 8),
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
          <h2 className="text-sm font-bold uppercase text-white">Throughput Monitor</h2>
          <p className="text-xs text-slate-400 mt-0.5 font-mono">Operations per second · Live stream</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold uppercase font-mono">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            Throughput
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold uppercase font-mono">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
            Errors
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="throughputGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-line-gateway)" stopOpacity={0.2} />
              <stop offset="95%" stopColor="var(--color-line-gateway)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="errorGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-status-cancelled)" stopOpacity={0.2} />
              <stop offset="95%" stopColor="var(--color-status-cancelled)" stopOpacity={0} />
            </linearGradient>
          </defs>
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
          <Area
            type="monotone"
            dataKey="throughput"
            stroke="var(--color-line-gateway)"
            strokeWidth={2}
            fill="url(#throughputGrad)"
            dot={false}
            activeDot={{ r: 4, fill: 'var(--color-line-gateway)', strokeWidth: 0 }}
          />
          <Area
            type="monotone"
            dataKey="errors"
            stroke="var(--color-status-cancelled)"
            strokeWidth={1.5}
            fill="url(#errorGrad)"
            dot={false}
            activeDot={{ r: 3, fill: 'var(--color-status-cancelled)', strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
