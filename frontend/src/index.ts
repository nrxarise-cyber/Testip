// ── IP Checker types ────────────────────────────────────────────────────────

export interface BlacklistEntry {
  source: string
  listed: boolean
}

export interface IPCheckResult {
  ip: string
  country?: string
  country_code?: string
  country_flag?: string
  city?: string
  region?: string
  timezone?: string
  isp?: string
  asn?: string
  organization?: string
  hostname?: string
  latitude?: number
  longitude?: number
  is_residential?: boolean
  is_datacenter?: boolean
  is_vpn?: boolean
  is_proxy?: boolean
  is_tor?: boolean
  risk_score?: number
  fraud_score?: number
  abuse_score?: number
  blacklist_status?: BlacklistEntry[]
  error?: string
}

// ── Proxy Checker types ────────────────────────────────────────────────────

export interface ProxyCheckResult {
  proxy: string
  host?: string
  port?: number
  username?: string
  password?: string
  is_alive: boolean
  ping_ms?: number
  response_time_ms?: number
  country?: string
  country_code?: string
  isp?: string
  asn?: string
  exit_ip?: string
  is_residential?: boolean
  is_datacenter?: boolean
  anonymous_level?: 'transparent' | 'anonymous' | 'elite' | 'unknown'
  supports_http?: boolean
  supports_https?: boolean
  supports_socks4?: boolean
  supports_socks5?: boolean
  is_vpn?: boolean
  is_tor?: boolean
  proxy_score?: number
  fraud_score?: number
  blacklist_status?: boolean
  error?: string
}

export interface BulkCheckResult {
  total: number
  live: number
  dead: number
  results: ProxyCheckResult[]
}

// ── History types ──────────────────────────────────────────────────────────

export type CheckType = 'ip' | 'proxy' | 'bulk'

export interface HistoryEntry {
  id: number
  check_type: CheckType
  input_data: string
  result: IPCheckResult | ProxyCheckResult | BulkCheckResult
  created_at: string
}

export interface HistoryListResponse {
  total: number
  page: number
  page_size: number
  items: HistoryEntry[]
}

// ── API error ──────────────────────────────────────────────────────────────

export interface ApiError {
  detail: string | { msg: string; type: string }[]
}
