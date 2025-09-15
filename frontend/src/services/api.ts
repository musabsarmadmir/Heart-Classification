import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

export const api = axios.create({ baseURL: BASE_URL, timeout: 15000 })

export type Features = Record<string, number>

export async function health() {
  const { data } = await api.get('/health')
  return data as { status: string }
}

export async function configInfo() {
  const { data } = await api.get('/config')
  return data as any
}

export async function predict(features: Features) {
  const { data } = await api.post('/predict', { features })
  return data as { probability: number; label: number }
}