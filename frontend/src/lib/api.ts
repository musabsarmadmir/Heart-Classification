import axios from 'axios';

const baseURL = ((import.meta as any).env?.VITE_API_URL?.toString() || '').replace(/\/$/, '');

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
