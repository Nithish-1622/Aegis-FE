import React, { useState } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  Handle,
  Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// Fixed Vignelli style 45-degree angle positions
const NODES = [
  {
    id: 'gateway-service',
    type: 'customStation',
    position: { x: 300, y: 100 },
    data: { label: 'Gateway Interchange', isInterchange: true, color: 'var(--color-line-gateway)' },
  },
  {
    id: 'order-service',
    type: 'customStation',
    position: { x: 200, y: 250 },
    data: { label: 'Order Station', color: 'var(--color-line-order)' },
  },
  {
    id: 'payment-service',
    type: 'customStation',
    position: { x: 400, y: 250 },
    data: { label: 'Payment Terminus', color: 'var(--color-line-payment)' },
  },
  {
    id: 'inventory-service',
    type: 'customStation',
    position: { x: 200, y: 400 },
    data: { label: 'Inventory Depot', color: 'var(--color-line-inventory)' },
  },
];

const EDGES = [
  {
    id: 'e-gw-order',
    source: 'gateway-service',
    target: 'order-service',
    style: { stroke: 'var(--color-line-order)', strokeWidth: 4 },
  },
  {
    id: 'e-gw-payment',
    source: 'gateway-service',
    target: 'payment-service',
    style: { stroke: 'var(--color-line-payment)', strokeWidth: 4 },
  },
  {
    id: 'e-order-inventory',
    source: 'order-service',
    target: 'inventory-service',
    style: { stroke: 'var(--color-line-inventory)', strokeWidth: 4 },
  },
];

const CustomStationNode = ({ data, selected }) => {
  const isInterchange = data.isInterchange;
  return (
    <div className="flex flex-col items-center select-none cursor-pointer relative">
      {/* Source & Target Connectors */}
      <Handle type="target" position={Position.Top} className="opacity-0 pointer-events-none" />
      
      {isInterchange ? (
        <div
          className={`w-10 h-10 rounded-full border-2 border-cyan-400 bg-slate-950 flex items-center justify-center transition-all ${
            selected ? 'scale-110 shadow-lg shadow-cyan-500/50' : ''
          }`}
        >
          <div className="w-5 h-5 rounded-full bg-amber-400 animate-pulse" />
        </div>
      ) : (
        <div
          className={`w-6 h-6 rounded-full border-2 border-slate-700 bg-slate-950 transition-all ${
            selected ? 'scale-110 border-cyan-400 shadow-lg shadow-cyan-500/50' : ''
          }`}
          style={{
            backgroundColor: data.color,
          }}
        />
      )}
      <span className="text-[10px] font-bold uppercase tracking-tight text-slate-200 bg-slate-900/90 px-2 py-0.5 rounded-md mt-2 border border-slate-800 shadow-md">
        {data.label}
      </span>

      <Handle type="source" position={Position.Bottom} className="opacity-0 pointer-events-none" />
    </div>
  );
};

const nodeTypes = {
  customStation: CustomStationNode,
};

const NodeDetailSign = ({ node, onClose }) => {
  if (!node) return null;
  const isGateway = node.id === 'gateway-service';

  return (
    <div className="w-80 bg-slate-950 border-l border-slate-800 p-6 flex flex-col justify-between h-full animate-slide-in font-sans">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono">
            Station Profile
          </h3>
          <button onClick={onClose} className="text-slate-500 hover:text-white font-bold cursor-pointer">✕</button>
        </div>

        <h2 className="text-lg font-bold uppercase tracking-tight text-white mb-4">
          {node.data?.label}
        </h2>

        <div className="space-y-3 font-mono text-xs">
          {[
            ['Station ID', node.id],
            ['Line Segment', isGateway ? 'Gateway Transit' : 'Branch Line'],
            ['Status', 'ON TIME'],
            ['Platform Count', isGateway ? 'Platform 1, 2' : 'Platform 1'],
            ['Type', 'Observability Node'],
          ].map(([label, val]) => (
            <div key={label} className="flex justify-between py-1.5 border-b border-slate-800/80">
              <span className="text-slate-500">{label}:</span>
              <span className="text-slate-200 font-bold">{val}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t border-slate-800">
        <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1 font-mono">Station Alerts:</p>
        <p className="text-xs text-emerald-400 font-bold">All services running on schedule.</p>
      </div>
    </div>
  );
};

export const TopologyPage = () => {
  const [selectedNode, setSelectedNode] = useState(null);

  const onNodeClick = (_, node) => {
    setSelectedNode(node);
  };

  return (
    <div className="flex border border-slate-800 bg-[#05070a] rounded-xl overflow-hidden shadow-2xl animate-fade-in" style={{ height: 'calc(100vh - 180px)' }}>
      <div className="flex-1 relative">
        <ReactFlow
          nodes={NODES}
          edges={EDGES}
          nodeTypes={nodeTypes}
          onNodeClick={onNodeClick}
          onPaneClick={() => setSelectedNode(null)}
          fitView
          fitViewOptions={{ padding: 0.2 }}
        >
          <Background variant="dots" color="#334155" size={1} gap={20} />
          <Controls className="bg-slate-900 border-slate-800 text-slate-300" />
        </ReactFlow>

        {/* Legend Overlay */}
        <div className="absolute bottom-4 left-4 bg-slate-900/90 border border-slate-800 p-3 rounded-lg text-[10px] font-mono font-bold uppercase space-y-1.5 backdrop-blur-md shadow-xl">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            Gateway Line
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            Order Branch Line
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
            Payment Terminus
          </div>
        </div>
      </div>

      {selectedNode && (
        <NodeDetailSign node={selectedNode} onClose={() => setSelectedNode(null)} />
      )}
    </div>
  );
};
