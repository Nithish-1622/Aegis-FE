import React from 'react';
import { Activity } from 'lucide-react';

export const EmptyState = ({ title = 'No Data Found', description = 'No telemetry records exist for the selected filter.', action }) => {
  return (
    <div className="p-10 text-center border border-dashed border-slate-800 rounded-xl bg-slate-950/40 space-y-3">
      <div className="w-10 h-10 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
        <Activity size={20} />
      </div>
      <h4 className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider">{title}</h4>
      <p className="text-xs text-slate-500 max-w-sm mx-auto">{description}</p>
      {action && <div className="pt-2">{action}</div>}
    </div>
  );
};
