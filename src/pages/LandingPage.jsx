import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Shield, 
  Zap, 
  Activity, 
  Layers, 
  Check, 
  ArrowRight, 
  Globe, 
  Terminal, 
  Cpu, 
  Database, 
  TrendingUp, 
  AlertTriangle, 
  ChevronDown, 
  Play, 
  Star, 
  Lock, 
  Users, 
  Server, 
  Sparkles,
  ExternalLink,
  Code,
  CheckCircle2,
  Moon
} from 'lucide-react';
const STACKS = [
  { name: 'Spring Boot', icon: '🍃' },
  { name: 'Apache Kafka', icon: '⚡' },
  { name: 'gRPC', icon: '🚀' },
  { name: 'React 19', icon: '⚛️' },
  { name: 'Kubernetes', icon: '☸️' },
  { name: 'Docker', icon: '🐳' },
  { name: 'Prometheus', icon: '🔥' },
];

const FEATURES_BENTO = [
  {
    title: 'Zero-Overhead Trace Propagation',
    description: 'Sub-millisecond W3C traceparent and X-Aegis-Trace-Id header injection across inbound and outbound HTTP/gRPC requests.',
    icon: <Globe className="text-cyan-400" size={24} />,
    colSpan: 'md:col-span-2',
    accent: 'from-blue-500/10 to-cyan-500/5',
    badge: 'Core Engine'
  },
  {
    title: '@Monitored AOP Profiler',
    description: 'Declarative AspectJ annotation engine for Spring Boot method timing, latency histograms, and exception capturing.',
    icon: <Zap className="text-purple-400" size={24} />,
    colSpan: 'md:col-span-1',
    accent: 'from-purple-500/10 to-indigo-500/5',
    badge: 'Java SDK'
  },
  {
    title: 'Disruptor Ring Buffer',
    description: 'LMAX Disruptor non-blocking memory ring buffer processing 50,000+ spans/sec with zero GC memory pressure.',
    icon: <Database className="text-emerald-400" size={24} />,
    colSpan: 'md:col-span-1',
    accent: 'from-emerald-500/10 to-teal-500/5',
    badge: 'High Throughput'
  },
  {
    title: 'Interactive Topology & Flame Graphs',
    description: 'Dynamic microservice dependency maps, live service health monitoring, and span waterfall flame graph inspection.',
    icon: <Activity className="text-amber-400" size={24} />,
    colSpan: 'md:col-span-2',
    accent: 'from-amber-500/10 to-orange-500/5',
    badge: 'Visual Insights'
  }
];

const PRICING_PLANS = [
  {
    name: 'Developer',
    price: '$0',
    period: 'forever free',
    description: 'Ideal for testing microservice tracing and local development.',
    features: [
      '1,000,000 spans / month',
      '3 Microservice targets',
      '7-day retention',
      'Standard HTTP & REST tracing',
      'Community Support'
    ],
    cta: 'Get Started Free',
    highlight: false
  },
  {
    name: 'Pro Platform',
    price: '$49',
    period: 'per month',
    description: 'For engineering teams scaling high-throughput Spring Boot microservices.',
    features: [
      '50,000,000 spans / month',
      'Unlimited Microservices',
      '30-day retention',
      'Kafka & gRPC interceptors',
      'Live Service Topology Map',
      'Automated AI Anomaly Alerts',
      '24/7 Priority Support'
    ],
    cta: 'Launch Pro Platform',
    highlight: true,
    badge: 'Most Popular'
  },
  {
    name: 'Enterprise Cloud',
    price: 'Custom',
    period: 'billed annually',
    description: 'Dedicated single-tenant infrastructure with custom SLAs & compliance.',
    features: [
      'Unlimited Spans & Throughput',
      '1-Year Custom Data Retention',
      'Dedicated Kafka Ring Buffers',
      'On-Premises & Private Cloud',
      'SOC2 Type II & HIPAA Compliance',
      'Dedicated Solutions Engineer'
    ],
    cta: 'Contact Sales',
    highlight: false
  }
];

const FAQS = [
  {
    q: 'How does Aegis Telemetry achieve sub-millisecond trace overhead?',
    a: 'Aegis SDK uses an internal LMAX Disruptor lock-free ring buffer. Span creation and context propagation occur asynchronously on worker threads, preventing thread blocking or garbage collection spikes on hot execution paths.'
  },
  {
    q: 'Can I integrate Aegis SDK with existing Spring Boot 3.x applications?',
    a: 'Yes! Simply add the aegis-sdk-spring-boot-starter dependency to your Maven pom.xml or Gradle file. The auto-configuration automatically registers HTTP filters, WebClient interceptors, and metrics beans with zero boilerplate.'
  },
  {
    q: 'Does Aegis support OpenTelemetry header standards?',
    a: 'Absolutely. Aegis fully supports standard W3C traceparent headers as well as custom X-Aegis-Trace-Id headers for seamless interoperability across third-party gateways and cloud providers.'
  }
];

export const LandingPage = () => {
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div className="min-h-screen bg-[#060810] text-slate-100 font-sans relative overflow-x-hidden selection:bg-blue-500/30">
      
      {/* ─── Ambient Dual Radial Glow (Matching Reference Image) ───────────── */}
      <div className="absolute top-0 left-0 right-0 h-[700px] pointer-events-none overflow-hidden z-0">
        {/* Left Electric Blue Glow */}
        <div 
          className="absolute -top-32 left-[-10%] w-[650px] h-[650px] rounded-full blur-[140px] opacity-40 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #2563eb 0%, #1e40af 60%, transparent 100%)' }}
        />
        {/* Right Copper/Amber Warm Glow */}
        <div 
          className="absolute -top-20 right-[-10%] w-[650px] h-[650px] rounded-full blur-[150px] opacity-30 pointer-events-none"
          style={{ background: 'radial-gradient(circle, #ea580c 0%, #d97706 60%, transparent 100%)' }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-16">

        {/* ─── Floating Top Navbar (Exact Layout from Image) ───────────────── */}
        <header className="max-w-5xl mx-auto rounded-2xl bg-slate-950/60 border border-slate-800/80 backdrop-blur-xl px-6 py-3 flex items-center justify-between shadow-2xl">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Shield size={18} className="text-white font-bold" />
            </div>
            <span className="text-sm font-extrabold tracking-wider text-white font-sans">
              Aegis Telemetry
            </span>
          </div>

          {/* Center Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-300 font-sans">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#architecture" className="hover:text-white transition-colors">Architecture</a>
            <NavLink to="/sdk/docs" className="hover:text-white transition-colors">Docs</NavLink>
            <span className="text-amber-400 font-bold flex items-center gap-1 cursor-pointer hover:text-amber-300">
              ★ Premium
            </span>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <button className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900 transition-colors">
              <Moon size={16} />
            </button>

            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300">
              <Star size={13} className="text-amber-400" />
              <span>1.4k stars</span>
            </div>

            <NavLink
              to="/concourse"
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
            >
              Launch SaaS App
            </NavLink>
          </div>
        </header>

        {/* ─── Hero Section (Exact Styling & Layout from Reference Image) ─── */}
        <section className="pt-6 pb-12 text-center space-y-8 max-w-4xl mx-auto">
          
          {/* Stacks Badge Row (Pill Buttons under Navbar) */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {STACKS.map((s, idx) => (
              <div
                key={idx}
                className="px-3.5 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-slate-300 text-xs font-mono font-medium flex items-center gap-1.5 shadow-md hover:border-slate-700 transition-colors"
              >
                <span>{s.icon}</span>
                <span>{s.name}</span>
              </div>
            ))}
          </div>

          {/* Giant Headline with Dual Color Gradient */}
          <div className="space-y-3">
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight font-sans leading-tight">
              <span className="bg-gradient-to-r from-blue-400 via-sky-400 to-cyan-300 bg-clip-text text-transparent">
                Aegis Telemetry
              </span>{' '}
              <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-500 bg-clip-text text-transparent">
                Engine
              </span>
            </h1>

            <h2 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight font-sans">
              Distributed Telemetry & Runtime Intelligence
            </h2>
          </div>

          {/* Sub-description */}
          <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Sub-millisecond trace propagation, live topology maps, W3C trace context, 
            and automated AI anomaly detection for high-throughput Spring Boot & Java microservices.
          </p>

          {/* Terminal Command Snippet Box */}
          <div className="pt-2">
            <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-xl bg-[#0a0f1d] border border-slate-800 text-cyan-300 font-mono text-xs font-semibold shadow-2xl">
              <span className="text-orange-400">$</span>
              <span>uipro init --ai antigravity</span>
            </div>
          </div>

          {/* Main Hero Action Buttons (Blue Pill + Dark Glass Pill) */}
          <div className="flex items-center justify-center gap-4 pt-2">
            <NavLink
              to="/concourse"
              className="px-7 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-xl shadow-blue-600/30 transition-all cursor-pointer transform hover:-translate-y-0.5"
            >
              Launch SaaS Platform
            </NavLink>

            <NavLink
              to="/sdk"
              className="px-7 py-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-slate-200 font-bold text-sm transition-all cursor-pointer"
            >
              View Demos & SDK
            </NavLink>
          </div>

        </section>

        {/* ─── Bento Grid Capabilities ────────────────────────────────────── */}
        <section id="features" className="space-y-6 max-w-5xl mx-auto pt-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-extrabold text-white uppercase tracking-tight font-sans">
              Production-Grade Observability Capabilities
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Engineered specifically for Spring Boot 3.x, WebFlux, and distributed microservices.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURES_BENTO.map((item, index) => (
              <div
                key={index}
                className={`p-6 rounded-2xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-all space-y-4 relative overflow-hidden shadow-xl ${item.colSpan}`}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${item.accent} pointer-events-none`} />
                <div className="flex items-center justify-between relative">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-slate-900 text-[10px] font-mono font-bold text-slate-300 border border-slate-800">
                    {item.badge}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white relative">{item.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed relative">{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ─── Transparent SaaS Pricing Section ──────────────────────────── */}
        <section className="space-y-8 max-w-5xl mx-auto pt-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-extrabold text-white uppercase tracking-tight font-sans">
              Simple SaaS Pricing Plans
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Transparent tiers scaling from local dev to global production microservices.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PRICING_PLANS.map((plan, idx) => (
              <div
                key={idx}
                className={`p-6 rounded-2xl bg-slate-950/80 border transition-all flex flex-col justify-between space-y-6 relative shadow-2xl ${
                  plan.highlight
                    ? 'border-blue-500/80 shadow-blue-500/10 bg-slate-950'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-blue-600 text-white font-bold text-[10px] uppercase tracking-wider shadow-md">
                    {plan.badge}
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed mt-1">{plan.description}</p>
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold text-white font-mono">{plan.price}</span>
                    <span className="text-xs text-slate-500">{plan.period}</span>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    {plan.features.map((feat, fidx) => (
                      <div key={fidx} className="flex items-center gap-2 text-xs text-slate-300">
                        <CheckCircle2 size={14} className="text-blue-400 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <NavLink
                  to="/concourse"
                  className={`w-full py-3 rounded-xl font-bold text-xs text-center transition-all cursor-pointer ${
                    plan.highlight
                      ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800'
                  }`}
                >
                  {plan.cta}
                </NavLink>
              </div>
            ))}
          </div>
        </section>

        {/* ─── FAQ Section ───────────────────────────────────────────────── */}
        <section className="max-w-3xl mx-auto space-y-6 pt-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-extrabold text-white uppercase tracking-tight font-sans">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => (
              <div key={idx} className="rounded-xl bg-slate-950/80 border border-slate-800 overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full p-4 text-left text-xs font-bold text-slate-200 flex items-center justify-between hover:bg-slate-900/50 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown size={16} className={`transition-transform ${openFaq === idx ? 'rotate-180 text-blue-400' : 'text-slate-500'}`} />
                </button>
                {openFaq === idx && (
                  <div className="p-4 pt-0 text-xs text-slate-400 leading-relaxed border-t border-slate-800/50 bg-slate-950 font-mono">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* ─── Final Call-To-Action Banner ───────────────────────────────── */}
        <section className="p-8 sm:p-12 rounded-2xl bg-gradient-to-r from-blue-950/40 via-slate-950 to-orange-950/30 border border-slate-800 text-center space-y-6 max-w-4xl mx-auto shadow-2xl relative overflow-hidden">
          <h2 className="text-3xl font-extrabold text-white uppercase tracking-tight relative font-sans">
            Ready to Explore the SaaS App?
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto relative leading-relaxed">
            Launch the live command center dashboard and trace your microservices in real time.
          </p>

          <div className="flex justify-center gap-4 relative">
            <NavLink
              to="/concourse"
              className="px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2 shadow-xl shadow-blue-600/30 transition-all cursor-pointer"
            >
              Launch SaaS Platform
              <ArrowRight size={16} />
            </NavLink>
          </div>
        </section>

        {/* Footer */}
        <footer className="pt-8 border-t border-slate-800/80 text-center text-xs text-slate-500 font-mono">
          <p>© 2026 Aegis Telemetry Engine. All rights reserved.</p>
        </footer>

      </div>

    </div>
  );
};
