import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Shield, 
  Activity, 
  Layers, 
  Clock, 
  AlertTriangle, 
  Terminal, 
  Package, 
  BookOpen, 
  Play, 
  Home, 
  Server, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Wifi, 
  Cpu,
  Sliders,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { StatusIndicator } from '../common/StatusIndicator';

const NAV_ITEMS = [
  { path: '/', label: 'Overview', icon: Home, badge: 'SaaS' },
  { path: '/concourse', label: 'Command Center', icon: Activity },
  { path: '/services', label: 'Services & Health', icon: Server },
  { path: '/topology', label: 'Service Topology', icon: Layers },
  { path: '/timelines', label: 'Trace Journeys', icon: Clock },
  { path: '/anomalies', label: 'Disruptions Log', icon: AlertTriangle },
  { path: '/simulator', label: 'Dispatch Desk', icon: Sliders },
];

const SDK_NAV_ITEMS = [
  { path: '/sdk', label: 'Maven Package', icon: Package },
  { path: '/sdk/docs', label: 'SDK Docs', icon: BookOpen },
  { path: '/sdk/playground', label: 'Playground', icon: Play },
];

export const AppShell = ({ children, activeFilter, onFilterChange }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [environment, setEnvironment] = useState('prod-cluster-01');
  const location = useLocation();

  const isLandingPage = location.pathname === '/';

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex font-sans selection:bg-cyan-500/30">
      
      {/* ─── Left Sidebar Navigation ───────────────────────────────────────── */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 bg-slate-950/95 border-r border-slate-800/80 flex flex-col justify-between transition-all duration-300 backdrop-blur-md ${
          collapsed ? 'w-16' : 'w-64'
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <NavLink to="/" className="flex items-center gap-3 overflow-hidden cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shrink-0 shadow-lg shadow-cyan-500/20">
              <Shield size={18} className="text-slate-950 font-bold" />
            </div>
            {!collapsed && (
              <div className="truncate">
                <div className="text-xs font-extrabold uppercase tracking-wider text-white font-sans">
                  AEGIS RUNTIME
                </div>
                <div className="text-[10px] font-mono text-cyan-400">v0.1.0-SNAPSHOT</div>
              </div>
            )}
          </NavLink>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1 rounded text-slate-500 hover:text-slate-200 hover:bg-slate-900 transition-colors hidden md:block cursor-pointer"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Environment Switcher */}
        {!collapsed && (
          <div className="px-4 py-2 bg-slate-900/50 border-b border-slate-800/80 font-mono text-[10px] flex items-center justify-between">
            <span className="text-slate-500 font-bold">CLUSTER:</span>
            <select
              value={environment}
              onChange={(e) => setEnvironment(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded px-2 py-0.5 text-cyan-300 font-mono text-[10px] focus:outline-none focus:border-cyan-500"
            >
              <option value="prod-cluster-01">prod-cluster-01</option>
              <option value="staging-eu-west">staging-eu-west</option>
              <option value="local-docker">local-docker</option>
            </select>
          </div>
        )}

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto p-3 space-y-6">
          {/* Main Nav */}
          <div className="space-y-1">
            {!collapsed && (
              <div className="px-2 text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500 mb-2">
                Core Observability
              </div>
            )}
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold shadow-lg shadow-cyan-500/5'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                    }`
                  }
                  title={collapsed ? item.label : undefined}
                >
                  <Icon size={16} className="shrink-0" />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                  {!collapsed && item.badge && (
                    <span className="ml-auto text-[9px] font-mono px-1.5 py-0.2 bg-slate-800 text-slate-400 rounded">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </div>

          {/* Developer SDK Nav */}
          <div className="space-y-1 pt-2 border-t border-slate-800/80">
            {!collapsed && (
              <div className="px-2 text-[10px] font-mono font-bold uppercase tracking-widest text-slate-500 mb-2">
                Developer SDK
              </div>
            )}
            {SDK_NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-semibold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                    }`
                  }
                  title={collapsed ? item.label : undefined}
                >
                  <Icon size={16} className="shrink-0" />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* Footer System Status Indicator */}
        <div className="p-4 border-t border-slate-800 bg-slate-950 font-mono text-xs space-y-2">
          {!collapsed ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-slate-500 uppercase font-bold">Runtime Status</span>
                <StatusIndicator status="HEALTHY" size="xs" />
              </div>
              <div className="flex items-center gap-2 text-[10px] text-slate-400">
                <Wifi size={12} className="text-emerald-400" />
                <span>Streaming via Axios Proxy</span>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <StatusIndicator status="HEALTHY" size="xs" showLabel={false} />
            </div>
          )}
        </div>
      </aside>

      {/* ─── Main Content Area ────────────────────────────────────────────── */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${collapsed ? 'ml-16' : 'ml-64'}`}>
        
        {/* Top Control Bar */}
        <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-6 py-3 flex items-center justify-between flex-wrap gap-4 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase text-slate-400">Target:</span>
              <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-300 font-mono text-xs">
                {environment}
              </span>
            </div>

            <div className="h-4 w-px bg-slate-800 hidden sm:block" />

            <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-400">
              <CheckCircle2 size={14} className="text-emerald-400" />
              <span>4 Services Operational</span>
            </div>
          </div>

          {/* Right Header Filters & Time */}
          <div className="flex items-center gap-4">
            {onFilterChange && (
              <div className="hidden lg:flex items-center gap-2 font-mono text-xs">
                <span className="text-[11px] text-slate-500 uppercase font-bold">Line Filter:</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onFilterChange(null)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase cursor-pointer ${
                      !activeFilter ? 'bg-cyan-500 text-slate-950' : 'bg-slate-900 text-slate-400 hover:text-white'
                    }`}
                  >
                    All
                  </button>
                  {['gateway', 'order', 'payment', 'inventory'].map((line) => (
                    <button
                      key={line}
                      onClick={() => onFilterChange(line)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase cursor-pointer ${
                        activeFilter === line ? 'bg-cyan-500 text-slate-950' : 'bg-slate-900 text-slate-400 hover:text-white'
                      }`}
                    >
                      {line}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="text-xs font-mono text-slate-400">
              <span className="text-slate-500">UTC: </span>
              <span className="text-cyan-400 font-bold">
                {new Date().toLocaleTimeString('en-US', { hour12: false })}
              </span>
            </div>
          </div>
        </header>

        {/* Page Content Render Container */}
        <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">
          {children}
        </main>
      </div>

    </div>
  );
};
