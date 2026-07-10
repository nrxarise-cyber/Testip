import axios, { AxiosError } from 'axios'
import type {
  IPCheckResult,
  ProxyCheckResult,
  BulkCheckResult,
  HistoryListResponse,
} from '@/types'

const BASE_URL = import.meta.env.VITE_API_URL || ''

const apiClient = axios.create({
  baseURL: `${BASE_URL}/api/v1`,
  headers: { 'Content-Type': 'application/json' },
  timeout: 60_000, // 60s to allow slow proxy checks
})

// ── Response interceptor for normalized errors ────────────────────────────

apiClient.interceptors.response.use(
  (res) => res,
  (err: AxiosError) => {
    const detail =
      (err.response?.data as { detail?: string })?.detail ||
      err.message ||
      'An unexpected error occurred'
    return Promise.reject(new Error(String(detail)))
  }
)

// ── IP Checker ────────────────────────────────────────────────────────────

export const checkIP = async (ip: string): Promise<IPCheckResult> => {
  const { data } = await apiClient.post<IPCheckResult>('/ip/check', { ip })
  return data
}

// ── Proxy Checker ─────────────────────────────────────────────────────────

export const checkProxy = async (proxy: string): Promise<ProxyCheckResult> => {
  const { data } = await apiClient.post<ProxyCheckResult>('/proxy/check', { proxy })
  return data
}

// ── Bulk Checker ──────────────────────────────────────────────────────────

export const checkBulk = async (proxies: string[]): Promise<BulkCheckResult> => {
  const { data } = await apiClient.post<BulkCheckResult>('/bulk/check', { proxies })
  return data
}

// ── History ───────────────────────────────────────────────────────────────

export const getHistory = async (
  page = 1,
  pageSize = 20
): Promise<HistoryListResponse> => {
  const { data } = await apiClient.get<HistoryListResponse>('/history', {
    params: { page, page_size: pageSize },
  })
  return data
}

export const clearHistory = async (): Promise<void> => {
  await apiClient.delete('/history')
}

export const healthCheck = async (): Promise<{ status: string }> => {
  const { data } = await apiClient.get('/health')
  return data
}
