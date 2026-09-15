import React, { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  MarkerType,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Server, Database, CreditCard, Package, Radio } from 'lucide-react';
import { clsx } from 'clsx';

// ─── Custom Node ──────────────────────────────────────────────────────────────

const SERVICE_ICONS = {
  gateway: { Icon: Server, color: '#00F0FF', bg: 'rgba(0,240,255,0.1)', border: 'rgba(0,240,255,0.4)' },
  order: { Icon: Database, color: '#A855F7', bg: 'rgba(168,85,247,0.1)', border: 'rgba(168,85,247,0.4)' },
  payment: { Icon: CreditCard, color: '#10B981', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.4)' },
  inventory: { Icon: Package, color: '#F59E0B', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.4)' },
  telemetry: { Icon: Radio, color: '#F43F5E', bg: 'rgba(244,63,94,0.1)', border: 'rgba(244,63,94,0.4)' },
  default: { Icon: Server, color: '#00F0FF', bg: 'rgba(0,240,255,0.1)', border: 'rgba(0,240,255,0.4)' },
};

const AegisServiceNode = ({ data, selected }) => {
  const key = Object.keys(SERVICE_ICONS).find((k) =>
    data.label?.toLowerCase().includes(k)
  ) ?? 'default';
  const { Icon, color, bg, border } = SERVICE_ICONS[key];
  const isHealthy = data.status !== 'DOWN' && data.status !== 'ERROR';

  return (
    <div
      style={{
        background: 'rgba(17,24,39,0.9)',
        border: `1.5px solid ${selected ? color : border}`,
        boxShadow: selected ? `0 0 20px ${color}40, 0 0 40px ${color}15` : `0 0 10px ${bg}`,
        backdropFilter: 'blur(12px)',
      }}
      className="rounded-xl px-4 py-3 min-w-[130px] text-center cursor-pointer transition-all duration-300 group"
    >
      {/* Health dot */}
      <div className="absolute top-2 right-2">
        <span
          className={clsx('w-2 h-2 rounded-full inline-block animate-pulse', isHealthy ? '' : 'bg-rose-400')}
          style={isHealthy ? { background: '#10B981', boxShadow: '0 0 6px rgba(16,185,129,0.8)' } : {}}
        />
      </div>

      {/* Icon */}
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-2 transition-all duration-300 group-hover:scale-110"
        style={{ background: bg, border: `1px solid ${border}` }}
      >
        <Icon size={18} style={{ color }} />
      </div>

      <div>
        <p className="text-xs font-semibold text-slate-100 leading-tight">{data.label}</p>
        {data.latency && (
          <p className="text-[10px] font-mono mt-0.5" style={{ color }}>
            {data.latency}ms
          </p>
        )}
        {data.status && (
          <p
            className="text-[9px] font-medium mt-1 uppercase tracking-wider"
            style={{ color: isHealthy ? '#10B981' : '#F43F5E' }}
          >
            {data.status}
          </p>
        )}
      </div>
    </div>
  );
};

// ─── Animated Edge ────────────────────────────────────────────────────────────

const AnimatedEdge = ({
  id, sourceX, sourceY, targetX, targetY,
  sourcePosition, targetPosition, data, markerEnd,
}) => {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX, sourceY, sourcePosition,
    targetX, targetY, targetPosition,
  });

  return (
    <>
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          stroke: data?.color ?? '#00F0FF',
          strokeWidth: data?.weight ?? 1.5,
          opacity: 0.7,
        }}
      />
      {/* Animated flow dot */}
      <circle r="4" fill={data?.color ?? '#00F0FF'} opacity={0.9}>
        <animateMotion dur={`${data?.speed ?? 2}s`} repeatCount="indefinite" path={edgePath} />
      </circle>
      {data?.label && (
        <EdgeLabelRenderer>
          <div
            style={{ transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)` }}
            className="absolute pointer-events-none bg-slate-900/80 border border-slate-700/50 rounded-lg px-1.5 py-0.5"
          >
            <span className="text-[9px] font-mono text-slate-400">{data.label}</span>
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
};

// ─── Default Topology ─────────────────────────────────────────────────────────

const DEFAULT_NODES = [
  {
    id: 'gateway',
    type: 'aegisService',
    position: { x: 350, y: 50 },
    data: { label: 'Gateway', status: 'UP', latency: 12 },
  },
  {
    id: 'order',
    type: 'aegisService',
    position: { x: 150, y: 220 },
    data: { label: 'Order Service', status: 'UP', latency: 34 },
  },
  {
    id: 'payment',
    type: 'aegisService',
    position: { x: 550, y: 220 },
    data: { label: 'Payment', status: 'UP', latency: 56 },
  },
  {
    id: 'inventory',
    type: 'aegisService',
    position: { x: 150, y: 390 },
    data: { label: 'Inventory', status: 'UP', latency: 28 },
  },
  {
    id: 'telemetry',
    type: 'aegisService',
    position: { x: 550, y: 390 },
    data: { label: 'Telemetry', status: 'UP', latency: 8 },
  },
];

const DEFAULT_EDGES = [
  { id: 'gw-order', source: 'gateway', target: 'order', type: 'animated', data: { color: '#00F0FF', weight: 2, speed: 1.5, label: '~120 rps' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#00F0FF' } },
  { id: 'gw-payment', source: 'gateway', target: 'payment', type: 'animated', data: { color: '#A855F7', weight: 2, speed: 2, label: '~80 rps' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#A855F7' } },
  { id: 'order-inventory', source: 'order', target: 'inventory', type: 'animated', data: { color: '#10B981', weight: 1.5, speed: 2.5, label: '~60 rps' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#10B981' } },
  { id: 'order-telemetry', source: 'order', target: 'telemetry', type: 'animated', data: { color: '#F59E0B', weight: 1, speed: 3, label: 'events' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#F59E0B' } },
  { id: 'payment-telemetry', source: 'payment', target: 'telemetry', type: 'animated', data: { color: '#F43F5E', weight: 1, speed: 2.5, label: 'events' }, markerEnd: { type: MarkerType.ArrowClosed, color: '#F43F5E' } },
];

const nodeTypes = { aegisService: AegisServiceNode };
const edgeTypes = { animated: AnimatedEdge };

// ─── Node Detail Drawer ───────────────────────────────────────────────────────

const NodeDetailDrawer = ({ node, onClose }) => {
  if (!node) return null;
  const key = Object.keys(SERVICE_ICONS).find((k) =>
    node.data?.label?.toLowerCase().includes(k)
  ) ?? 'default';
  const { Icon, color } = SERVICE_ICONS[key];

  return (
    <div className="absolute top-0 right-0 h-full w-72 bg-slate-900/95 backdrop-blur-xl border-l border-slate-700/50 z-10 p-5 overflow-y-auto animate-slide-in">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-semibold text-slate-100">Node Details</h3>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-all text-xs"
        >
          ✕
        </button>
      </div>

      <div className="flex flex-col gap-4">
        <div
          className="flex items-center gap-3 p-3 rounded-xl border"
          style={{ borderColor: `${color}40`, background: `${color}10` }}
        >
          <Icon size={24} style={{ color }} />
          <div>
            <p className="text-sm font-semibold text-slate-100">{node.data?.label}</p>
            <p className="text-xs font-mono" style={{ color }}>
              {node.data?.status ?? 'UNKNOWN'}
            </p>
          </div>
        </div>

        {[
          ['Node ID', node.id],
          ['Status', node.data?.status ?? 'N/A'],
          ['Avg Latency', node.data?.latency ? `${node.data.latency}ms` : 'N/A'],
          ['Type', 'Spring Boot 3'],
          ['Protocol', 'HTTP/REST'],
          ['Port', node.id === 'gateway' ? '8081' : node.id === 'telemetry' ? '8085' : '8080'],
        ].map(([k, v]) => (
          <div key={k} className="flex items-start justify-between py-2 border-b border-slate-700/30">
            <span className="text-xs text-slate-500">{k}</span>
            <span className="text-xs font-mono text-slate-300 text-right max-w-[160px] break-all">{v}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Main Canvas ──────────────────────────────────────────────────────────────

const TopologyCanvas = ({ data }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(DEFAULT_NODES);
  const [edges, setEdges, onEdgesChange] = useEdgesState(DEFAULT_EDGES);
  const [selectedNode, setSelectedNode] = React.useState(null);

  // Merge API data into nodes
  React.useEffect(() => {
    if (!data) return;
    const apiNodes = data.nodes ?? [];
    const apiEdges = data.edges ?? [];

    if (apiNodes.length > 0) {
      setNodes(
        apiNodes.map((n, i) => ({
          id: n.id ?? `node-${i}`,
          type: 'aegisService',
          position: n.position ?? DEFAULT_NODES[i % DEFAULT_NODES.length]?.position ?? { x: i * 200, y: i * 100 },
          data: {
            label: n.label ?? n.name ?? n.id,
            status: n.status ?? 'UP',
            latency: n.latency ?? n.avgLatency,
          },
        }))
      );
    }
    if (apiEdges.length > 0) {
      setEdges(
        apiEdges.map((e, i) => ({
          id: e.id ?? `edge-${i}`,
          source: e.source ?? e.from,
          target: e.target ?? e.to,
          type: 'animated',
          data: { color: '#00F0FF', weight: 1.5, speed: 2 },
          markerEnd: { type: MarkerType.ArrowClosed, color: '#00F0FF' },
        }))
      );
    }
  }, [data]);

  const onNodeClick = useCallback((_, node) => {
    setSelectedNode(node);
  }, []);

  return (
    <div className="relative w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        onPaneClick={() => setSelectedNode(null)}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        minZoom={0.4}
        maxZoom={2}
        style={{ background: 'transparent' }}
      >
        <Background
          variant="dots"
          gap={24}
          size={1}
          color="rgba(100,116,139,0.15)"
        />
        <Controls
          style={{
            background: 'rgba(17,24,39,0.8)',
            border: '1px solid rgba(100,116,139,0.3)',
            borderRadius: '12px',
          }}
        />
        <MiniMap
          style={{
            background: 'rgba(7,11,18,0.9)',
            border: '1px solid rgba(0,240,255,0.2)',
            borderRadius: '12px',
          }}
          nodeColor={(n) => {
            const k = Object.keys(SERVICE_ICONS).find((key) =>
              n.data?.label?.toLowerCase().includes(key)
            ) ?? 'default';
            return SERVICE_ICONS[k].color;
          }}
          maskColor="rgba(7,11,18,0.6)"
        />
      </ReactFlow>

      <NodeDetailDrawer node={selectedNode} onClose={() => setSelectedNode(null)} />
    </div>
  );
};

export const ServiceTopologyCanvas = ({ data }) => (
  <ReactFlowProvider>
    <TopologyCanvas data={data} />
  </ReactFlowProvider>
);
