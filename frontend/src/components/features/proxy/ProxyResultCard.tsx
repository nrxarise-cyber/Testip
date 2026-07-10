import { AlertTriangle, Server, Shield, Zap } from 'lucide-react'
import { GlassCard } from '@/components/ui/GlassCard'
import { Badge } from '@/components/ui/Badge'
import { CopyButton } from '@/components/ui/CopyButton'
import type { ProxyCheckResult } from '@/types'

interface ProxyResultCardProps {
  result: ProxyCheckResult
}

interface RowProps {
  label: string
  value?: string | number | boolean | null
  valueClass?: string
}

function Row({ label, value, valueClass }: RowProps) {
  if (value === null || value === undefined) return null
  const displayValue = typeof value === 'boolean' ? (value ? 'Yes' : 'No') : String(value)
  return (
    <div className="result-row">
      <span className="result-label">{label}</span>
      <span className={`result-value ${valueClass ?? ''}`}>{displayValue}</span>
    </div>
  )
}

function SectionHeader({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
  return (
    <div className="flex items-center gap-2 pt-3 pb-1 mt-2 border-t border-tg-border/20">
      <Icon className="w-3.5 h-3.5 text-tg-blue-light" />
      <span className="text-[11px] font-semibold uppercase tracking-wider text-tg-muted">{title}</span>
    </div>
  )
}

function ProtocolBadge({ label, supported }: { label: string; supported?: boolean | null }) {
  if (supported === null || supported === undefined) return null
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border ${
      supported
        ? 'bg-success/20 text-success border-success/30'
        : 'bg-tg-surface text-tg-muted border-tg-border/30'
    }`}>
      {label}
    </span>
  )
}

/**
 * Proxy check result card with live/dead status, ping, and all analytics.
 */
export function ProxyResultCard({ result }: ProxyResultCardProps) {
  if (result.error && !result.is_alive) {
    return (
      <GlassCard className="border-danger/20">
        <div className="flex items-center gap-3 mb-3">
          <span className="w-2.5 h-2.5 rounded-full bg-danger pulse-red flex-shrink-0" />
          <div>
            <p className="font-mono text-tg-text font-semibold text-sm">{result.proxy}</p>
            <p className="text-xs text-danger mt-0.5">Dead — Connection failed</p>
          </div>
          <Badge variant="danger" className="ml-auto">❌ Dead</Badge>
        </div>
        {result.error && (
          <p className="text-xs text-tg-muted bg-tg-surface/40 rounded-lg p-2 font-mono break-all">
            {result.error}
          </p>
        )}
      </GlassCard>
    )
  }

  const copyText = JSON.stringify(result, null, 2)

  return (
    <GlassCard>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3 flex-1">
          <span className={`w-2.5 h-2.5 rounded-full mt-1 flex-shrink-0 ${
            result.is_alive ? 'bg-success pulse-green' : 'bg-danger pulse-red'
          }`} />
          <div className="min-w-0 flex-1">
            <p className="font-mono text-tg-text font-semibold text-sm break-all leading-tight">
              {result.proxy}
            </p>
            {result.exit_ip && result.exit_ip !== result.host && (
              <p className="text-xs text-tg-muted mt-0.5">Exit: {result.exit_ip}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 ml-2 flex-shrink-0">
          <Badge variant={result.is_alive ? 'success' : 'danger'}>
            {result.is_alive ? '✅ Live' : '❌ Dead'}
          </Badge>
          <CopyButton text={copyText} variant="icon" />
        </div>
      </div>

      {/* Quick stats */}
      {result.is_alive && (
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="glass-sm p-2 text-center">
            <p className="text-[10px] text-tg-muted">Ping</p>
            <p className="text-sm font-bold text-tg-blue-light">
              {result.ping_ms != null ? `${result.ping_ms}ms` : 'N/A'}
            </p>
          </div>
          <div className="glass-sm p-2 text-center">
            <p className="text-[10px] text-tg-muted">Anonymity</p>
            <p className="text-sm font-bold text-tg-text capitalize">{result.anonymous_level ?? 'N/A'}</p>
          </div>
          <div className="glass-sm p-2 text-center">
            <p className="text-[10px] text-tg-muted">Country</p>
            <p className="text-sm font-bold text-tg-text">{result.country_code ?? 'N/A'}</p>
          </div>
        </div>
      )}

      {/* Protocol support */}
      {result.is_alive && (
        <div className="flex gap-1.5 flex-wrap mb-3">
          <ProtocolBadge label="HTTP" supported={result.supports_http} />
          <ProtocolBadge label="HTTPS" supported={result.supports_https} />
          <ProtocolBadge label="SOCKS4" supported={result.supports_socks4} />
          <ProtocolBadge label="SOCKS5" supported={result.supports_socks5} />
        </div>
      )}

      {/* Network section */}
      <SectionHeader icon={Server} title="Network" />
      <Row label="Exit IP" value={result.exit_ip} />
      <Row label="Country" value={result.country} />
      <Row label="ISP" value={result.isp} />
      <Row label="ASN" value={result.asn} />
      <Row label="Type" value={result.is_residential ? 'Residential' : result.is_datacenter ? 'Datacenter' : undefined} />

      {/* Performance */}
      {result.is_alive && (
        <>
          <SectionHeader icon={Zap} title="Performance" />
          <Row label="Ping" value={result.ping_ms != null ? `${result.ping_ms} ms` : undefined} />
          <Row label="Response Time" value={result.response_time_ms != null ? `${result.response_time_ms} ms` : undefined} />
        </>
      )}

      {/* Security */}
      <SectionHeader icon={Shield} title="Security" />
      <Row label="VPN" value={result.is_vpn} valueClass={result.is_vpn ? 'text-warning' : 'text-success'} />
      <Row label="TOR" value={result.is_tor} valueClass={result.is_tor ? 'text-danger' : 'text-success'} />
      {result.proxy_score !== undefined && result.proxy_score !== null && (
        <div className="result-row">
          <span className="result-label">Proxy Score</span>
          <Badge variant={result.proxy_score > 60 ? 'danger' : result.proxy_score > 30 ? 'warning' : 'success'}>
            {result.proxy_score}/100
          </Badge>
        </div>
      )}
      {result.fraud_score !== undefined && result.fraud_score !== null && (
        <div className="result-row">
          <span className="result-label">Fraud Score</span>
          <Badge variant={result.fraud_score > 60 ? 'danger' : result.fraud_score > 30 ? 'warning' : 'success'}>
            {result.fraud_score}/100
          </Badge>
        </div>
      )}
      {result.blacklist_status !== null && result.blacklist_status !== undefined && (
        <div className="result-row">
          <span className="result-label">Blacklist</span>
          <Badge variant={result.blacklist_status ? 'danger' : 'success'}>
            {result.blacklist_status ? '⛔ Listed' : '✅ Clean'}
          </Badge>
        </div>
      )}

      {/* Copy */}
      <div className="mt-4 pt-3 border-t border-tg-border/20">
        <CopyButton text={copyText} label="Copy Full Result" className="w-full justify-center" />
      </div>
    </GlassCard>
  )
}
