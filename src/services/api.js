import axios from 'axios';

// ─── Axios Instances with Proxy Paths ──────────────────────────────────────────

export const telemetryApi = axios.create({
  baseURL: '/api-telemetry',
  timeout: 5000,
});

export const runtimeApi = axios.create({
  baseURL: '/api-runtime',
  timeout: 5000,
});

export const gatewayApi = axios.create({
  baseURL: '/api-gateway',
  timeout: 5000,
});

// ─── Response Interceptors ────────────────────────────────────────────────────

[telemetryApi, runtimeApi, gatewayApi].forEach((api) => {
  api.interceptors.response.use(
    (res) => res,
    (err) => {
      console.warn('[Aegis API Error]', err.config?.baseURL, err.message);
      return Promise.reject(err);
    }
  );
});

// ─── API Functions ────────────────────────────────────────────────────────────

// Person 1 — Telemetry (8085)
export const pingTelemetry = () => telemetryApi.get('/demo/ping');
export const traceTelemetry = () => telemetryApi.get('/demo/trace');
export const triggerError = () => telemetryApi.get('/demo/error');
export const getTelemetryHealth = () => telemetryApi.get('/actuator/health');

// Person 2 — Runtime Intelligence (8080)
export const getDashboard = () => runtimeApi.get('/runtime/dashboard');
export const getDashboardTrends = (window = '1h') => runtimeApi.get(`/runtime/dashboard/trends?window=${window}`);
export const getRuntimeHealth = () => runtimeApi.get('/runtime/health');
export const getTopology = () => runtimeApi.get('/runtime/topology');
export const getTimelines = (traceId = 'default-trace') => runtimeApi.get(`/runtime/timeline/${traceId}`);
export const getAnomalies = () => runtimeApi.get('/runtime/anomalies');
export const getRetries = () => runtimeApi.get('/runtime/retries');
export const getMetrics = () => runtimeApi.get('/runtime/metrics');

// Gateway (8081)
export const placeOrder = (payload = { item: 'laptop', quantity: 1, price: 1200.0 }) =>
  gatewayApi.post('/orders', payload);
