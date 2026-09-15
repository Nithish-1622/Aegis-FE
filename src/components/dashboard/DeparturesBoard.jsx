import React from 'react';
import { SplitFlapText } from '../common/SplitFlapText';

const LINE_COLORS = {
  gateway: 'bg-[var(--color-line-gateway)]',
  order: 'bg-[var(--color-line-order)]',
  payment: 'bg-[var(--color-line-payment)]',
  inventory: 'bg-[var(--color-line-inventory)]',
  telemetry: 'bg-[var(--color-line-inventory)]',
};

const mapStatusWord = (status = '') => {
  const s = status.toUpperCase();
  if (['DOWN', 'ERROR', 'CRITICAL', 'FAILED', 'CANCELLED'].includes(s)) return 'CANCELLED';
  if (['WARN', 'WARNING', 'DEGRADED', 'RETRY', 'DELAYED'].includes(s)) return 'DELAYED';
  return 'ON TIME';
};

const getStatusColor = (statusWord) => {
  if (statusWord === 'CANCELLED') return 'text-[var(--color-status-cancelled)]';
  if (statusWord === 'DELAYED') return 'text-[var(--color-status-delayed)]';
  return 'text-[var(--color-status-ontime)]';
};

export const DeparturesBoard = ({ departures = [] }) => {
  const displayRows = React.useMemo(() => {
    // Generate empty rows if we have fewer than 8 entries
    const rows = [...departures];
    while (rows.length < 8) {
      rows.push({
        isEmpty: true,
        route: '',
        origin: '',
        destination: '',
        status: '',
        platform: '',
      });
    }
    return rows.slice(0, 8);
  }, [departures]);

  return (
    <div className="bg-slate-950/80 border border-slate-800 p-6 rounded-xl shadow-2xl space-y-4">
      {/* Board Header Signage */}
      <div className="border-b border-slate-800 pb-3 flex justify-between items-center text-xs font-bold uppercase text-slate-200 tracking-wider">
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          DEPARTURES BOARD — LIVE REQUEST LOG
        </span>
        <span className="font-mono text-cyan-400">● ACTIVE PLATFORMS</span>
      </div>

      {/* Split Flap Table */}
      <div className="space-y-2 select-none overflow-x-auto">
        {/* Table Headers */}
        <div className="flex items-center gap-4 text-[10px] font-mono text-slate-500 uppercase tracking-widest px-2">
          <div className="w-6">LINE</div>
          <div className="w-32">ROUTE</div>
          <div className="w-56">JOURNEY</div>
          <div className="w-24">STATUS</div>
          <div className="w-16">PLATFORM</div>
        </div>

        {/* Rows */}
        {displayRows.map((row, index) => {
          if (row.isEmpty) {
            return (
              <div key={`empty-${index}`} className="flex items-center gap-4 py-2 px-2 bg-slate-950/40 border-b border-slate-800/80">
                <div className="w-6"><span className="inline-block w-2.5 h-2.5 rounded-full bg-slate-800" /></div>
                <div className="w-32"><SplitFlapText text="---" length={12} /></div>
                <div className="w-56"><SplitFlapText text="---" length={24} /></div>
                <div className="w-24"><SplitFlapText text="---" length={8} /></div>
                <div className="w-16"><SplitFlapText text="---" length={5} /></div>
              </div>
            );
          }

          const routeName = row.route ?? row.service ?? 'GATEWAY';
          const lineKey = Object.keys(LINE_COLORS).find(k => routeName.toLowerCase().includes(k)) ?? 'gateway';
          const dotColor = LINE_COLORS[lineKey];
          const statusWord = mapStatusWord(row.status);
          const platformStr = (row.platform ?? row.traceId ?? 'T00').substring(0, 5);

          return (
            <div key={row.id ?? index} className="flex items-center gap-4 py-2 px-2 bg-slate-900/60 border-b border-slate-800 hover:bg-slate-800/60 transition-colors">
              {/* Route dot */}
              <div className="w-6">
                <span className={`inline-block w-3 h-3 rounded-full ${dotColor}`} />
              </div>

              {/* Service Line Name */}
              <div className="w-32">
                <SplitFlapText text={routeName} length={12} />
              </div>

              {/* Origin -> Destination */}
              <div className="w-56">
                <SplitFlapText
                  text={`${row.origin ?? 'SRC'}->${row.destination ?? 'DEST'}`}
                  length={24}
                />
              </div>

              {/* Status Word */}
              <div className={`w-24 font-mono font-bold ${getStatusColor(statusWord)}`}>
                <SplitFlapText text={statusWord} length={8} />
              </div>

              {/* Platform (Short trace id) */}
              <div className="w-16">
                <SplitFlapText text={platformStr} length={5} />
              </div>
            </div>
          );
        })}
      </div>

      {departures.length === 0 && (
        <div className="text-center py-4 text-xs font-mono text-slate-500 border-t border-slate-800">
          No live departures yet — dispatch a trace event from the Dispatch Desk.
        </div>
      )}
    </div>
  );
};
