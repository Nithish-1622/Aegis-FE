import React from 'react';
import { NavLink } from 'react-router-dom';
import { Shield } from 'lucide-react';

const PAGES = [
  { path: '/', label: 'Home' },
  { path: '/concourse', label: 'Concourse' },
  { path: '/topology', label: 'Line Diagram' },
  { path: '/timelines', label: 'Journey Planner' },
  { path: '/anomalies', label: 'Disruptions' },
  { path: '/simulator', label: 'Dispatch Desk' },
  { path: '/sdk', label: 'Maven SDK' },
  { path: '/sdk/docs', label: 'SDK Docs' },
  { path: '/sdk/playground', label: 'SDK Playground' },
];

export const HeaderSwatches = ({ activeFilter, onFilterChange }) => {
  const lines = [
    { id: 'gateway', label: 'Gateway Line', color: 'bg-amber-400' },
    { id: 'order', label: 'Order Line', color: 'bg-blue-500' },
    { id: 'payment', label: 'Payment Line', color: 'bg-purple-500' },
    { id: 'inventory', label: 'Inventory Line', color: 'bg-emerald-500' },
  ];

  return (
    <div className="sticky top-0 z-50 w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-6 py-2.5 flex items-center justify-between flex-wrap gap-4 shadow-xl">
      {/* Brand & Page Navigation */}
      <div className="flex items-center gap-6">
        <NavLink to="/" className="flex items-center gap-2.5 group cursor-pointer">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
            <Shield size={16} className="text-slate-950 font-bold" />
          </div>
          <span className="text-sm font-extrabold uppercase tracking-wider text-white font-sans">AEGIS TELEMETRY</span>
        </NavLink>

        <div className="h-4 w-px bg-slate-800" />

        {/* Primary Page Nav Links */}
        <nav className="flex items-center gap-1">
          {PAGES.map((page) => (
            <NavLink
              key={page.path}
              to={page.path}
              className={({ isActive }) =>
                `px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all rounded-lg ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`
              }
            >
              {page.label}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Service Line Filters */}
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">Filters:</span>
          <div className="flex items-center gap-1.5 font-mono">
            <button
              onClick={() => onFilterChange(null)}
              className={`px-2.5 py-1 border text-[10px] font-bold uppercase tracking-wider transition-colors rounded-full cursor-pointer ${
                !activeFilter
                  ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold'
                  : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700'
              }`}
            >
              All
            </button>
            {lines.map((line) => (
              <button
                key={line.id}
                onClick={() => onFilterChange(line.id)}
                className={`flex items-center gap-1 px-2.5 py-1 border text-[10px] font-bold uppercase tracking-wider transition-colors rounded-full cursor-pointer ${
                  activeFilter === line.id
                    ? 'bg-cyan-500 text-slate-950 border-cyan-400 font-bold'
                    : 'bg-slate-900/80 text-slate-300 border-slate-800 hover:border-slate-700'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${line.color}`} />
                {line.id}
              </button>
            ))}
          </div>
        </div>

        <div className="h-4 w-px bg-slate-800" />

        <div className="text-[11px] font-mono uppercase text-slate-400">
          Time: <span className="font-bold text-cyan-400">{new Date().toLocaleTimeString('en-US', { hour12: false })}</span>
        </div>
      </div>
    </div>
  );
};
