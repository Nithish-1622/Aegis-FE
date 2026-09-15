import React from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info, Circle } from 'lucide-react';
import { clsx } from 'clsx';

const statusConfig = {
  UP: { label: 'UP', color: 'badge-success', dot: 'status-dot-healthy', Icon: CheckCircle2 },
  HEALTHY: { label: 'HEALTHY', color: 'badge-success', dot: 'status-dot-healthy', Icon: CheckCircle2 },
  SUCCESS: { label: 'SUCCESS', color: 'badge-success', dot: 'status-dot-healthy', Icon: CheckCircle2 },
  OK: { label: 'OK', color: 'badge-success', dot: 'status-dot-healthy', Icon: CheckCircle2 },
  RUNNING: { label: 'RUNNING', color: 'badge-success', dot: 'status-dot-healthy', Icon: CheckCircle2 },
  WARN: { label: 'WARN', color: 'badge-warn', dot: 'status-dot-warn', Icon: AlertTriangle },
  WARNING: { label: 'WARNING', color: 'badge-warn', dot: 'status-dot-warn', Icon: AlertTriangle },
  RETRY: { label: 'RETRY', color: 'badge-warn', dot: 'status-dot-warn', Icon: AlertTriangle },
  DEGRADED: { label: 'DEGRADED', color: 'badge-warn', dot: 'status-dot-warn', Icon: AlertTriangle },
  DOWN: { label: 'DOWN', color: 'badge-error', dot: 'status-dot-error', Icon: XCircle },
  ERROR: { label: 'ERROR', color: 'badge-error', dot: 'status-dot-error', Icon: XCircle },
  CRITICAL: { label: 'CRITICAL', color: 'badge-error', dot: 'status-dot-error', Icon: XCircle },
  FAILED: { label: 'FAILED', color: 'badge-error', dot: 'status-dot-error', Icon: XCircle },
  INFO: { label: 'INFO', color: 'badge-info', dot: '', Icon: Info },
};

const fallback = { label: 'UNKNOWN', color: 'badge-info', dot: '', Icon: Circle };

export const StatusBadge = ({ status, showDot = true, showIcon = false, className = '' }) => {
  const cfg = statusConfig[status?.toUpperCase?.()] ?? fallback;
  const { label, color, dot, Icon } = cfg;

  return (
    <span className={clsx(color, className)}>
      {showDot && dot && <span className={dot} />}
      {showIcon && <Icon size={10} />}
      {label}
    </span>
  );
};
