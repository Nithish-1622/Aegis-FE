import { useQuery } from '@tanstack/react-query';
import {
  getDashboard,
  getDashboardTrends,
  getRuntimeHealth,
  getTopology,
  getTimelines,
  getAnomalies,
  getRetries,
  getMetrics,
  getTelemetryHealth,
} from './api';

const STALE_TIME = 0;
const POLLING_FAST = 3000;  // 3s
const POLLING_SLOW = 5000;  // 5s

// ─── Dashboard ────────────────────────────────────────────────────────────────

export const useDashboard = () =>
  useQuery({
    queryKey: ['dashboard'],
    queryFn: () => getDashboard().then((r) => r.data),
    refetchInterval: POLLING_FAST,
    staleTime: STALE_TIME,
    retry: 1,
  });

export const useDashboardTrends = (window = '1h') =>
  useQuery({
    queryKey: ['dashboard-trends', window],
    queryFn: () => getDashboardTrends(window).then((r) => r.data),
    refetchInterval: POLLING_SLOW,
    staleTime: STALE_TIME,
    retry: 1,
  });

// ─── Health ───────────────────────────────────────────────────────────────────

export const useRuntimeHealth = () =>
  useQuery({
    queryKey: ['runtime-health'],
    queryFn: () => getRuntimeHealth().then((r) => r.data),
    refetchInterval: POLLING_FAST,
    staleTime: STALE_TIME,
    retry: 1,
  });

export const useTelemetryHealth = () =>
  useQuery({
    queryKey: ['telemetry-health'],
    queryFn: () => getTelemetryHealth().then((r) => r.data),
    refetchInterval: POLLING_FAST,
    staleTime: STALE_TIME,
    retry: 1,
  });

// ─── Topology ─────────────────────────────────────────────────────────────────

export const useTopology = () =>
  useQuery({
    queryKey: ['topology'],
    queryFn: () => getTopology().then((r) => r.data),
    refetchInterval: POLLING_SLOW,
    staleTime: STALE_TIME,
    retry: 1,
  });

// ─── Timelines ────────────────────────────────────────────────────────────────

export const useTimelines = (traceId = 'default-trace') =>
  useQuery({
    queryKey: ['timelines', traceId],
    queryFn: () => getTimelines(traceId).then((r) => r.data),
    refetchInterval: POLLING_FAST,
    staleTime: STALE_TIME,
    retry: 1,
  });

// ─── Anomalies ────────────────────────────────────────────────────────────────

export const useAnomalies = () =>
  useQuery({
    queryKey: ['anomalies'],
    queryFn: () => getAnomalies().then((r) => r.data),
    refetchInterval: POLLING_FAST,
    staleTime: STALE_TIME,
    retry: 1,
  });

// ─── Retries ──────────────────────────────────────────────────────────────────

export const useRetries = () =>
  useQuery({
    queryKey: ['retries'],
    queryFn: () => getRetries().then((r) => r.data),
    refetchInterval: POLLING_SLOW,
    staleTime: STALE_TIME,
    retry: 1,
  });

// ─── Metrics ──────────────────────────────────────────────────────────────────

export const useMetrics = () =>
  useQuery({
    queryKey: ['metrics'],
    queryFn: () => getMetrics().then((r) => r.data),
    refetchInterval: POLLING_FAST,
    staleTime: STALE_TIME,
    retry: 1,
  });
