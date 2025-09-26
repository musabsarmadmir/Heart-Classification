import axios from 'axios';

// Allow a runtime-injected global config (loaded from /runtime-config.js) so we can
// change API endpoint without rebuilding the bundle.
declare global {
  interface Window {
    __RUNTIME_CONFIG__?: { API_BASE?: string };
  }
}

const envBase = ((import.meta as any).env?.VITE_API_URL?.toString() || '').replace(/\/$/, '');
const runtimeBase = (typeof window !== 'undefined' && window.__RUNTIME_CONFIG__?.API_BASE) || '';
const baseURL = (runtimeBase || envBase || '').replace(/\/$/, '');

export const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface PredictResponse {
  probability: number;
  label: number;
}

export interface PredictRequest {
  features: Record<string, number>;
}

export const predictHeartDisease = async (payload: PredictRequest) => {
  const { data } = await api.post<PredictResponse>('/api/predict', payload);
  return data;
};
