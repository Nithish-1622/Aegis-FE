import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Package, 
  Terminal, 
  Check, 
  Copy, 
  Zap, 
  Activity, 
  ShieldCheck, 
  Cpu, 
  Layers, 
  ArrowRight, 
  Globe, 
  Gauge, 
  Database,
  Code,
  BookOpen,
  Play
} from 'lucide-react';
import { toast } from 'sonner';

const INSTALL_SNIPPETS = {
  maven: {
    label: 'Maven (pom.xml)',
    code: `<dependency>
    <groupId>com.aegis.telemetry</groupId>
    <artifactId>aegis-sdk-spring-boot-starter</artifactId>
    <version>0.1.0-SNAPSHOT</version>
</dependency>`,
    filename: 'pom.xml'
  },
  gradleGroovy: {
    label: 'Gradle (Groovy)',
    code: `implementation 'com.aegis.telemetry:aegis-sdk-spring-boot-starter:0.1.0-SNAPSHOT'`,
    filename: 'build.gradle'
  },
  gradleKotlin: {
    label: 'Gradle (Kotlin)',
    code: `implementation("com.aegis.telemetry:aegis-sdk-spring-boot-starter:0.1.0-SNAPSHOT")`,
    filename: 'build.gradle.kts'
  },
  sbt: {
    label: 'SBT (Scala)',
    code: `libraryDependencies += "com.aegis.telemetry" % "aegis-sdk-spring-boot-starter" % "0.1.0-SNAPSHOT"`,
    filename: 'build.sbt'
  }
};

const FEATURES = [
  {
    icon: <Globe className="text-cyan-400" size={24} />,
    title: 'Zero-Config HTTP Filter',
    description: 'Automatic W3C traceparent and X-Aegis-Trace-Id header injection/extraction across inbound and outbound HTTP requests.'
  },
  {
    icon: <Zap className="text-purple-400" size={24} />,
    title: '@Monitored AOP Profiler',
    description: 'Annotation-driven method execution timing, exception capturing, and sub-millisecond latency profiling with AspectJ.'
  },
  {
    icon: <Database className="text-emerald-400" size={24} />,
    title: 'Kafka Telemetry Pipeline',
    description: 'Asynchronous trace propagation through Kafka headers with non-blocking ring buffer buffers to eliminate thread blocking.'
  },
  {
    icon: <Activity className="text-blue-400" size={24} />,
    title: 'gRPC Interceptors',
    description: 'Native Client and Server gRPC interceptors ensuring context continuation across high-performance RPC boundaries.'
  },
  {
    icon: <Layers className="text-amber-400" size={24} />,
    title: 'Spring Boot Auto-Starter',
    description: 'Auto-configuration starter that registers telemetry filters, metrics exporters, and health indicators out of the box.'
  },
  {
    icon: <Cpu className="text-rose-400" size={24} />,
    title: 'Thread Context Carrier',
    description: 'Propagates distributed trace state across ThreadLocal boundaries, Executor thread pools, and Spring WebFlux reactive pipelines.'
  }
];

const BENCHMARKS = [
  { metric: '< 0.15 ms', label: 'CPU Overhead per Span', desc: 'Minimal footprint on hot application paths' },
  { metric: '0 B/sec', label: 'GC Memory Pressure', desc: 'Object recycling via LMAX Disruptor ring buffer' },
  { metric: '50,000+', label: 'Spans/sec Throughput', desc: 'Ultra high-throughput non-blocking emitter' },
  { metric: '99.999%', label: 'Delivery Reliability', desc: 'Automatic retry and fallback buffer guarantees' }
];

export const SdkPortalPage = () => {
  const [activeTab, setActiveTab] = useState('maven');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(INSTALL_SNIPPETS[activeTab].code);
    setCopied(true);
    toast.success('Dependency snippet copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 rounded-xl p-6 border border-slate-800 shadow-2xl space-y-12 animate-fade-in font-sans">
      
      {/* ─── Hero Section ─────────────────────────────────────────────────── */}
      <div className="relative pt-6 pb-10 text-center space-y-6 max-w-4xl mx-auto">
        <div className="absolute inset-0 -top-10 bg-gradient-to-b from-cyan-500/10 via-purple-500/5 to-transparent blur-3xl rounded-full pointer-events-none" />

        {/* Version Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 text-xs font-mono text-cyan-400 shadow-lg shadow-cyan-500/10">
          <Package size={14} className="text-cyan-400 animate-pulse" />
          <span>aegis-sdk-spring-boot-starter</span>
          <span className="bg-cyan-500/20 px-2 py-0.5 rounded text-[10px] font-bold text-cyan-300">v0.1.0-SNAPSHOT</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white uppercase font-sans">
          Enterprise Java & Spring Boot <br />
          <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            Distributed Telemetry SDK
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          High-performance Maven package for Spring Boot microservices. Zero-config HTTP tracing, 
          AOP method profiling, Kafka pipeline propagation, and sub-millisecond latency overhead.
        </p>

        {/* CTA Actions */}
        <div className="flex items-center justify-center gap-4 pt-2">
          <NavLink
            to="/sdk/docs"
            className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
          >
            <BookOpen size={16} />
            View Developer Docs
            <ArrowRight size={16} />
          </NavLink>
          <NavLink
            to="/sdk/playground"
            className="px-5 py-2.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-500/50 hover:bg-slate-800 text-slate-200 font-bold text-sm flex items-center gap-2 transition-all cursor-pointer"
          >
            <Play size={16} className="text-cyan-400" />
            Interactive Playground
          </NavLink>
        </div>
      </div>

      {/* ─── Installation Widget ─────────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto bg-slate-900/80 rounded-xl border border-slate-800 backdrop-blur-md overflow-hidden shadow-xl">
        {/* Tab Headers */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/80 px-4 py-2">
          <div className="flex items-center gap-2">
            <Terminal size={16} className="text-cyan-400" />
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider font-bold">Maven Package Installation</span>
          </div>

          <div className="flex items-center gap-1">
            {Object.keys(INSTALL_SNIPPETS).map((key) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`px-3 py-1 rounded text-xs font-mono transition-colors cursor-pointer ${
                  activeTab === key
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {INSTALL_SNIPPETS[key].label}
              </button>
            ))}
          </div>
        </div>

        {/* Code View */}
        <div className="relative p-4 bg-[#05070a] font-mono text-xs text-slate-200 overflow-x-auto">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] text-slate-500">{INSTALL_SNIPPETS[activeTab].filename}</span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] transition-all cursor-pointer"
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              <span>{copied ? 'Copied!' : 'Copy Code'}</span>
            </button>
          </div>
          <pre className="text-cyan-200 font-mono leading-relaxed whitespace-pre-wrap">
            {INSTALL_SNIPPETS[activeTab].code}
          </pre>
        </div>
      </div>

      {/* ─── Interactive Telemetry Architecture Flow ───────────────────────── */}
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-white uppercase tracking-tight">Telemetry Architecture Pipeline</h2>
          <p className="text-xs text-slate-400 max-w-xl mx-auto">
            How Aegis SDK intercepts microservice requests, packs trace contexts into non-blocking ring buffers, and streams metrics to Aegis Runtime.
          </p>
        </div>

        <div className="p-6 bg-slate-900/60 rounded-xl border border-slate-800 grid grid-cols-1 md:grid-cols-4 gap-4 text-center relative">
          
          <div className="p-4 rounded-lg bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="w-8 h-8 rounded-full bg-cyan-500/10 text-cyan-400 flex items-center justify-center mx-auto">
              <Globe size={18} />
            </div>
            <h4 className="text-xs font-bold text-slate-200">1. Inbound Request</h4>
            <p className="text-[11px] text-slate-400">HTTP/gRPC request arrives with or without trace headers</p>
          </div>

          <div className="p-4 rounded-lg bg-slate-950/80 border border-cyan-500/30 space-y-2 relative shadow-lg shadow-cyan-500/5">
            <div className="w-8 h-8 rounded-full bg-purple-500/10 text-purple-400 flex items-center justify-center mx-auto">
              <ShieldCheck size={18} />
            </div>
            <h4 className="text-xs font-bold text-cyan-300">2. Aegis Web Filter & AOP</h4>
            <p className="text-[11px] text-slate-400">Injects X-Aegis-Trace-Id and profiles @Monitored methods</p>
          </div>

          <div className="p-4 rounded-lg bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto">
              <Cpu size={18} />
            </div>
            <h4 className="text-xs font-bold text-slate-200">3. Disruptor Ring Buffer</h4>
            <p className="text-[11px] text-slate-400">Lock-free memory ring buffer batching spans asynchronously</p>
          </div>

          <div className="p-4 rounded-lg bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center mx-auto">
              <Activity size={18} />
            </div>
            <h4 className="text-xs font-bold text-slate-200">4. Aegis Runtime Stream</h4>
            <p className="text-[11px] text-slate-400">Pushes live spans to Aegis Telemetry collector endpoints</p>
          </div>

        </div>
      </div>

      {/* ─── Feature Grid ─────────────────────────────────────────────────── */}
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-white uppercase tracking-tight">Core SDK Capabilities</h2>
          <p className="text-xs text-slate-400">Designed specifically for Spring Boot 3.x, WebFlux, and Java 17+ enterprise environments.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feat, index) => (
            <div
              key={index}
              className="p-5 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-cyan-500/40 hover:bg-slate-900/80 transition-all space-y-3"
            >
              <div className="w-10 h-10 rounded-lg bg-slate-800/80 flex items-center justify-center">
                {feat.icon}
              </div>
              <h3 className="text-sm font-bold text-slate-100">{feat.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{feat.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Benchmarks Section ──────────────────────────────────────────── */}
      <div className="p-8 rounded-xl bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-slate-800 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <Gauge className="text-cyan-400" size={24} />
          <div>
            <h3 className="text-lg font-bold text-white uppercase">Performance Benchmarks</h3>
            <p className="text-xs text-slate-400">JMH Benchmark metrics evaluated on JDK 21 under 100k req/sec simulated load</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {BENCHMARKS.map((b, i) => (
            <div key={i} className="space-y-1">
              <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400 font-mono">{b.metric}</div>
              <div className="text-xs font-bold text-slate-200">{b.label}</div>
              <div className="text-[11px] text-slate-500">{b.desc}</div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
