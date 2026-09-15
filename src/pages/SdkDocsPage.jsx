import React, { useState } from 'react';
import { 
  BookOpen, 
  Layers, 
  Package, 
  Terminal, 
  Check, 
  Copy, 
  ShieldCheck, 
  Code, 
  Cpu, 
  Zap, 
  Search,
  ChevronRight,
  Database,
  Globe
} from 'lucide-react';
import { toast } from 'sonner';

const MAVEN_MODULES = [
  {
    artifactId: 'aegis-sdk-core',
    version: '0.1.0-SNAPSHOT',
    size: '84 KB',
    category: 'Core Runtime',
    description: 'Core tracing abstractions, Span context propagation, W3C traceparent headers, and Carrier interfaces.'
  },
  {
    artifactId: 'aegis-sdk-spring-boot-starter',
    version: '0.1.0-SNAPSHOT',
    size: '142 KB',
    category: 'Spring Starter',
    description: 'Auto-configuration starter for Spring Boot 3.x microservices. Registers filters, metrics, and beans.'
  },
  {
    artifactId: 'aegis-sdk-aop',
    version: '0.1.0-SNAPSHOT',
    size: '68 KB',
    category: 'Instrumentation',
    description: '@Monitored AspectJ annotation engine for declarative method profiling and latency timers.'
  },
  {
    artifactId: 'aegis-sdk-kafka',
    version: '0.1.0-SNAPSHOT',
    size: '112 KB',
    category: 'Messaging',
    description: 'Kafka Producer/Consumer record interceptors for asynchronous message trace propagation.'
  },
  {
    artifactId: 'aegis-sdk-grpc',
    version: '0.1.0-SNAPSHOT',
    size: '96 KB',
    category: 'RPC Tracing',
    description: 'gRPC Client and Server interceptors ensuring trace context continuation across RPC boundaries.'
  },
  {
    artifactId: 'aegis-sdk-httpclient',
    version: '0.1.0-SNAPSHOT',
    size: '54 KB',
    category: 'HTTP Clients',
    description: 'Apache HttpClient & OkHttp context injection wrappers for outbound service calls.'
  },
  {
    artifactId: 'aegis-sdk-metrics',
    version: '0.1.0-SNAPSHOT',
    size: '78 KB',
    category: 'Observability',
    description: 'Micrometer & Prometheus metric exporter integration for span rates and histograms.'
  },
  {
    artifactId: 'aegis-sdk-logback',
    version: '0.1.0-SNAPSHOT',
    size: '46 KB',
    category: 'Logging',
    description: 'Logback MDC appender for automatic TraceID log enrichment (trace_id=%X{trace_id}).'
  },
  {
    artifactId: 'aegis-sdk-testkit',
    version: '0.1.0-SNAPSHOT',
    size: '38 KB',
    category: 'Testing',
    description: 'In-memory mock tracer and span verifier for JUnit 5 integration testing.'
  }
];

const DOC_SECTIONS = {
  quickstart: {
    title: 'Getting Started Quickstart',
    description: 'Add Aegis Telemetry SDK to your Spring Boot project in under 2 minutes.',
    code: `// 1. Add dependency to pom.xml
<dependency>
    <groupId>com.aegis.telemetry</groupId>
    <artifactId>aegis-sdk-spring-boot-starter</artifactId>
    <version>0.1.0-SNAPSHOT</version>
</dependency>

// 2. Enable Telemetry in your Spring Application class
@SpringBootApplication
@EnableAegisTelemetry
public class OrderServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(OrderServiceApplication.class, args);
    }
}`,
    language: 'java'
  },
  aop: {
    title: 'Core Method Instrumentation with @Monitored',
    description: 'Annotate key service methods to automatically profile execution time and record spans.',
    code: `@Service
public class OrderProcessingService {

    @Monitored(name = "process_payment_flow", captureArguments = true)
    public PaymentResult processPayment(OrderRequest request) {
        // Method execution time, exceptions, and trace context are recorded automatically
        return paymentClient.charge(request.getAmount());
    }
}`,
    language: 'java'
  },
  config: {
    title: 'Spring Boot Configuration (application.yml)',
    description: 'Configure Aegis Telemetry collector endpoints, sampling rates, and buffer limits.',
    code: `aegis:
  telemetry:
    enabled: true
    service-name: order-service
    collector-url: http://localhost:8085/api-telemetry
    sampler:
      type: probabilistic
      ratio: 1.0
    buffer:
      ring-buffer-size: 4096
      flush-interval-ms: 500
    http-filter:
      enabled: true
      include-patterns: /api/**`,
    language: 'yaml'
  },
  kafka: {
    title: 'Async Kafka Message Tracing',
    description: 'Automatically inject trace context into Kafka Record Headers when producing or consuming messages.',
    code: `@Autowired
private KafkaTemplate<String, OrderEvent> kafkaTemplate;

public void sendOrderNotification(OrderEvent event) {
    // AegisKafkaInterceptor attaches X-Aegis-Trace-Id to Kafka record headers automatically
    kafkaTemplate.send("order-events-topic", event.getOrderId(), event);
}`,
    language: 'java'
  }
};

export const SdkDocsPage = () => {
  const [activeSection, setActiveSection] = useState('quickstart');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedKey, setCopiedKey] = useState(null);

  const handleCopyCode = (code, key) => {
    navigator.clipboard.writeText(code);
    setCopiedKey(key);
    toast.success('Code snippet copied!');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const filteredModules = MAVEN_MODULES.filter(
    (m) =>
      m.artifactId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 rounded-xl p-6 border border-slate-800 shadow-2xl space-y-8 animate-fade-in font-sans">
      
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
            <BookOpen className="text-cyan-400" size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white uppercase tracking-tight">Developer Documentation & Artifact Matrix</h1>
            <p className="text-xs text-slate-400">Complete API reference, Spring Boot starters, and Maven package artifact specifications.</p>
          </div>
        </div>

        {/* Quick Search */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 text-slate-500" size={14} />
          <input
            type="text"
            placeholder="Search Maven artifacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50 w-64"
          />
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Sidebar Nav */}
        <div className="space-y-4">
          <div className="text-xs font-mono text-slate-500 uppercase tracking-widest font-bold px-2">
            Documentation Index
          </div>
          <div className="space-y-1">
            {Object.keys(DOC_SECTIONS).map((key) => (
              <button
                key={key}
                onClick={() => setActiveSection(key)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeSection === key
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <span>{DOC_SECTIONS[key].title}</span>
                <ChevronRight size={14} className={activeSection === key ? 'text-cyan-400' : 'text-slate-600'} />
              </button>
            ))}

            <button
              onClick={() => setActiveSection('matrix')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeSection === 'matrix'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
              }`}
            >
              <span>Maven Artifact Matrix (9 Modules)</span>
              <ChevronRight size={14} className={activeSection === 'matrix' ? 'text-cyan-400' : 'text-slate-600'} />
            </button>
          </div>
        </div>

        {/* Content View */}
        <div className="lg:col-span-3 space-y-6">
          {activeSection !== 'matrix' ? (
            <div className="p-6 bg-slate-900/70 border border-slate-800 rounded-xl space-y-4 shadow-xl">
              <div>
                <h2 className="text-lg font-bold text-white">{DOC_SECTIONS[activeSection].title}</h2>
                <p className="text-xs text-slate-400">{DOC_SECTIONS[activeSection].description}</p>
              </div>

              {/* Code Snippet Box */}
              <div className="relative rounded-lg bg-[#05070a] border border-slate-800 p-4 font-mono text-xs text-cyan-200 overflow-x-auto">
                <div className="flex justify-between items-center mb-2 pb-2 border-b border-slate-800/80">
                  <span className="text-[10px] text-slate-500 uppercase">{DOC_SECTIONS[activeSection].language} snippet</span>
                  <button
                    onClick={() => handleCopyCode(DOC_SECTIONS[activeSection].code, activeSection)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] transition-all cursor-pointer"
                  >
                    {copiedKey === activeSection ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
                    <span>{copiedKey === activeSection ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
                <pre className="whitespace-pre-wrap leading-relaxed">
                  {DOC_SECTIONS[activeSection].code}
                </pre>
              </div>
            </div>
          ) : (
            /* Maven Artifact Matrix Table */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white uppercase">Aegis Maven Package Artifact Matrix</h2>
                  <p className="text-xs text-slate-400">All 9 compiled JAR modules available under <code className="text-cyan-400 font-mono">com.aegis.telemetry</code></p>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 text-xs font-mono border border-cyan-500/30">
                  9 Modules
                </span>
              </div>

              <div className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 text-slate-400 font-mono uppercase text-[10px] tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="px-4 py-3">Artifact ID</th>
                      <th className="px-4 py-3">Version</th>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3">JAR Size</th>
                      <th className="px-4 py-3">Description</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-sans">
                    {filteredModules.map((mod, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                        <td className="px-4 py-3 font-mono font-bold text-cyan-300">
                          {mod.artifactId}
                        </td>
                        <td className="px-4 py-3 font-mono text-slate-400">
                          {mod.version}
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-semibold">
                            {mod.category}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-mono text-emerald-400">
                          {mod.size}
                        </td>
                        <td className="px-4 py-3 text-slate-400 text-[11px] leading-relaxed">
                          {mod.description}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
